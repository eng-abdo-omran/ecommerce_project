<?php

namespace App\Http\Services;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CheckoutService
{
    public function checkout(int $userId, array $payload): array
    {
        return DB::transaction(function () use ($userId, $payload) {

            // 1) تأكد العنوان ملك المستخدم
            $address = Address::where('id', $payload['address_id'])
                ->where('user_id', $userId)
                ->first();

            if (!$address) {
                return [
                    'status' => false,
                    'message' => 'العنوان غير موجود أو لا يخص المستخدم',
                ];
            }

            // 2) هات الكارت + العناصر
            $cart = Cart::where('user_id', $userId)->first();
            if (!$cart) {
                return ['status' => false, 'message' => 'لا توجد سلة لهذا المستخدم'];
            }

            $cart->load(['items.product']);

            if ($cart->items->isEmpty()) {
                return ['status' => false, 'message' => 'سلتك فارغة'];
            }

            // 3) lock المنتجات للتحكم في المخزون
            $productIds = $cart->items->pluck('product_id')->unique()->values()->all();

            $products = Product::whereIn('id', $productIds)
                ->lockForUpdate() // ده يمنع race condition
                ->get()
                ->keyBy('id');

            // 4) احسب subtotal على السيرفر + تحقق stock
            $itemsPayload = [];
            $subtotal = 0.0;

            foreach ($cart->items as $ci) {
                $p = $products->get($ci->product_id);
                if (!$p) {
                    return ['status' => false, 'message' => 'منتج غير موجود في السلة'];
                }

                $requestedQty = (int)$ci->quantity;
                $stock = (int)($p->quantity ?? 0);

                if ($requestedQty > $stock) {
                    return [
                        'status' => false,
                        'message' => "الكمية غير متاحة للمنتج: {$p->name}",
                    ];
                }

                $unitPrice = (float)$p->price;
                $lineSubtotal = $unitPrice * $requestedQty;

                $subtotal += $lineSubtotal;

                $itemsPayload[] = [
                    'product_id' => $p->id,
                    'user_id' => $userId,
                    'quantity' => $requestedQty,
                    'unit_price' => $unitPrice,
                    'subtotal' => $lineSubtotal,
                    'options' => $ci->options, // snapshot selections
                ];
            }

            // 5) الشحن (Flat rate)
            $shippingFee = (float) (config('checkout.shipping_fee') ?? 50);

            // 6) كوبون (اختياري)
            $discount = 0.0;
            $couponCode = null;

            if (!empty($payload['coupon_code'])) {
                $couponCode = strtoupper(trim($payload['coupon_code']));

                $coupon = Coupon::where('code', $couponCode)->first();
                if (!$coupon) {
                    return ['status' => false, 'message' => 'كوبون غير صحيح'];
                }

                // تحقق تاريخ
                $today = Carbon::today();
                if ($coupon->start_date && $today->lt($coupon->start_date)) {
                    return ['status' => false, 'message' => 'الكوبون لم يبدأ بعد'];
                }
                if ($coupon->end_date && $today->gt($coupon->end_date)) {
                    return ['status' => false, 'message' => 'الكوبون انتهى'];
                }

                // تحقق usage_limit (بشكل إجمالي) - احترافي: نعد استخداماته
                $usedCount = DB::table('coupon_redemptions')
                    ->where('coupon_id', $coupon->id)
                    ->count();

                if ($coupon->usage_limit !== null && $usedCount >= (int)$coupon->usage_limit) {
                    return ['status' => false, 'message' => 'تم استهلاك الكوبون بالكامل'];
                }

                // احسب الخصم
                if ((int)$coupon->discount_type === 0) {
                    // fixed
                    $discount = (float)$coupon->discount_value;
                } else {
                    // percentage
                    $percent = (float)$coupon->discount_value;
                    $percent = max(0, min(100, $percent));
                    $discount = ($subtotal * $percent) / 100.0;
                }

                // الخصم ماينفعش يبقى أكبر من subtotal
                $discount = min($discount, $subtotal);
            }

            // 7) Total
            $total = ($subtotal - $discount) + $shippingFee;

            // 8) Create order
            $orderNumber = 'ORD-' . strtoupper(Str::random(10));

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $userId,
                'total_amount' => $total, // لو هتزود أعمدة subtotal/discount/shipping بعدين هنحدّث
                'status' => 'pending',
                'shipping_address' => [
                    'id' => $address->id,
                    'label' => $address->label,
                    'city' => $address->city,
                    'street' => $address->street,
                    'notes' => $address->notes,
                ],
                'billing_address' => null,
                'notes' => $payload['notes'] ?? null,
            ]);

            // 9) Save items
            foreach ($itemsPayload as $row) {
                $row['order_id'] = $order->id;
                OrderItem::create($row);
            }

            // 10) Decrement stock
            foreach ($cart->items as $ci) {
                $p = $products->get($ci->product_id);
                $p->quantity = (int)$p->quantity - (int)$ci->quantity;
                $p->save();
            }

            // 11) سجل استخدام الكوبون
            if (!empty($couponCode)) {
                $coupon = Coupon::where('code', $couponCode)->first();
                if ($coupon) {
                    DB::table('coupon_redemptions')->insert([
                        'coupon_id' => $coupon->id,
                        'user_id' => $userId,
                        'order_id' => $order->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // 12) Clear cart
            $cart->items()->delete();

            // 13) Online payment placeholder
            $nextAction = null;
            if (($payload['payment_method'] ?? 'cod') === 'online') {
                // هنا لاحقاً: create payment intent / redirect url
                $nextAction = [
                    'type' => 'payment_required',
                    'provider' => 'TBD',
                    'redirect_url' => null,
                ];
            }

            return [
                'status' => true,
                'message' => 'تم إنشاء الطلب بنجاح',
                'data' => [
                    'order' => Order::with(['items.product'])->find($order->id),
                    'pricing' => [
                        'subtotal' => $subtotal,
                        'discount' => $discount,
                        'shipping_fee' => $shippingFee,
                        'total' => $total,
                        'currency' => 'EGP',
                        'coupon_code' => $couponCode,
                    ],
                    'next_action' => $nextAction,
                ],
            ];
        });
    }
}
