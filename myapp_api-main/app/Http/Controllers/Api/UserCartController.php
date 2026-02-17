<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class UserCartController extends Controller
{
    private function cart(Request $request): Cart
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id]);
    }

    public function show(Request $request)
    {
        $cart = $this->cart($request)->load(['items.product']);

        $items = $cart->items->map(function ($item) {
            $price = (float) ($item->product->price ?? 0);
            return [
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'product'    => $item->product, // full product
                'unit_price' => $price,
                'subtotal'   => $price * $item->quantity,
            ];
        });

        $total = $items->sum('subtotal');

        return response()->json([
            'status'  => true,
            'message' => 'سلة المستخدم',
            'data'    => [
                'items' => $items->values(),
                'total' => $total,
            ],
        ]);
    }

    public function addItem(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'sometimes|integer|min:1|max:999',
        ]);

        $cart = $this->cart($request);

        // تأكد المنتج موجود
        Product::findOrFail($data['product_id']);

        $qty = $data['quantity'] ?? 1;

        $item = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'product_id' => $data['product_id'],
        ]);

        $item->quantity = ($item->exists ? $item->quantity : 0) + $qty;
        $item->save();

        return response()->json([
            'status'  => true,
            'message' => 'تمت الإضافة إلى السلة',
            'data'    => $item,
        ], 201);
    }

    public function updateItem(Request $request, $productId)
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1|max:999',
        ]);

        $cart = $this->cart($request);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->firstOrFail();

        $item->quantity = $data['quantity'];
        $item->save();

        return response()->json([
            'status'  => true,
            'message' => 'تم تحديث الكمية',
            'data'    => $item,
        ]);
    }

    public function removeItem(Request $request, $productId)
    {
        $cart = $this->cart($request);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        if ($item) $item->delete();

        return response()->json([
            'status'  => true,
            'message' => 'تم حذف المنتج من السلة',
        ]);
    }

    public function clear(Request $request)
    {
        $cart = $this->cart($request);
        CartItem::where('cart_id', $cart->id)->delete();

        return response()->json([
            'status'  => true,
            'message' => 'تم تفريغ السلة',
        ]);
    }

    /**
     * Merge guest cart (client sends items) into user cart
     * payload: items: [{product_id, quantity}]
     */
    public function merge(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:999',
        ]);

        $cart = $this->cart($request);

        foreach ($data['items'] as $it) {
            $item = CartItem::firstOrNew([
                'cart_id' => $cart->id,
                'product_id' => $it['product_id'],
            ]);

            $item->quantity = ($item->exists ? $item->quantity : 0) + $it['quantity'];
            $item->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'تم دمج سلة الضيف بنجاح',
        ]);
    }
}
