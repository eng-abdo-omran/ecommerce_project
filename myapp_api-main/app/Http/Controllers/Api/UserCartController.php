<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\VariantValue;
use Illuminate\Http\Request;

class UserCartController extends Controller
{
    private function cart(Request $request): Cart
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id]);
    }

    /**
     * normalize options for hashing فقط (IDs only)
     * input: options: [{variant_id, value_id, ...any}]
     * output: [{variant_id, value_id}] sorted
     */
    private function normalizeOptionsForHash(array $options): array
    {
        return collect($options)
            ->map(function ($o) {
                return [
                    'variant_id' => (int)($o['variant_id'] ?? 0),
                    'value_id'   => (int)($o['value_id'] ?? 0),
                ];
            })
            ->filter(fn($o) => $o['variant_id'] > 0 && $o['value_id'] > 0)
            ->sortBy(fn($o) => $o['variant_id'] . '-' . $o['value_id'])
            ->values()
            ->all();
    }

    private function optionsHash(array $normalizedForHash): ?string
    {
        if (empty($normalizedForHash)) return null;
        return hash('sha256', json_encode($normalizedForHash));
    }

    /**
     * Build options snapshot with names (variant_name/value_name)
     * and validate that the value belongs to the same product
     */
    private function buildOptionsSnapshot(int $productId, array $rawOptions): array
    {
        $normalized = $this->normalizeOptionsForHash($rawOptions);
        if (empty($normalized)) return [];

        $valueIds = collect($normalized)->pluck('value_id')->unique()->values()->all();

        // نجيب values + variant بتاعها علشان ناخد الاسم
        $values = VariantValue::with('variant')
            ->whereIn('id', $valueIds)
            ->where('product_id', $productId) // مهم جدًا لمنع تلاعب
            ->get()
            ->keyBy('id');

        // لو في value مش تابع لنفس المنتج => invalid
        if ($values->count() !== count($valueIds)) {
            throw new \RuntimeException("اختيارات الفاريانت غير صحيحة لهذا المنتج");
        }

        // Snapshot مرتب حسب variant_id
        $snapshot = [];
        foreach ($normalized as $pair) {
            $vv = $values->get($pair['value_id']);
            $snapshot[] = [
                'variant_id'   => (int)$pair['variant_id'],
                'variant_name' => (string)optional($vv?->variant)->name,
                'value_id'     => (int)$pair['value_id'],
                'value_name'   => (string)($vv?->value ?? ''),
            ];
        }

        return $snapshot;
    }

    /**
     * Hydrate existing options (old items) that have only ids (no names).
     * Will return options with names when possible.
     */
    private function hydrateOptionsIfMissing(int $productId, $options): ?array
    {
        if (!$options || !is_array($options)) return null;

        // لو already contains variant_name/value_name => good
        $alreadyNamed = collect($options)->every(function ($o) {
            return isset($o['variant_name']) && isset($o['value_name']);
        });
        if ($alreadyNamed) return $options;

        // Otherwise rebuild snapshot from whatever ids exist
        try {
            return $this->buildOptionsSnapshot($productId, $options);
        } catch (\Throwable $e) {
            // لو فشلنا نرجع ids فقط بدل ما نكسر show
            return $options;
        }
    }

    public function show(Request $request)
    {
        $cart = $this->cart($request)->load(['items.product']);

        $items = $cart->items->map(function ($item) {
            $price = (float)($item->product->price ?? 0);

            //  hydrate options to display names
            $options = $this->hydrateOptionsIfMissing((int)$item->product_id, $item->options);

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'options' => $options,
                'product' => $item->product,
                'unit_price' => $price,
                'subtotal' => $price * $item->quantity,
            ];
        });

        $total = $items->sum('subtotal');

        return response()->json([
            'status' => true,
            'message' => 'سلة المستخدم',
            'data' => [
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
            'options'    => 'sometimes|array',
            'options.*.variant_id' => 'required_with:options|integer|exists:product_variants,id',
            'options.*.value_id'   => 'required_with:options|integer|exists:variant_values,id',
        ]);

        $cart = $this->cart($request);
        $product = Product::findOrFail($data['product_id']);
        $qty = $data['quantity'] ?? 1;

        $rawOptions = $data['options'] ?? [];

        //  build snapshot with names + validate values belong to this product
        try {
            $optionsSnapshot = $this->buildOptionsSnapshot($product->id, $rawOptions);
        } catch (\RuntimeException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        //  hash based on ids only
        $normalizedForHash = $this->normalizeOptionsForHash($rawOptions);
        $hash = $this->optionsHash($normalizedForHash);

        $item = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'options_hash' => $hash,
        ]);

        $item->options = !empty($optionsSnapshot) ? $optionsSnapshot : null;
        $item->quantity = ($item->exists ? $item->quantity : 0) + $qty;
        $item->save();

        return response()->json([
            'status' => true,
            'message' => 'تمت الإضافة إلى السلة',
            'data' => $item,
        ], 201);
    }

    public function updateItem(Request $request, $itemId)
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1|max:999',
        ]);

        $cart = $this->cart($request);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('id', $itemId)
            ->firstOrFail();

        $item->quantity = $data['quantity'];
        $item->save();

        return response()->json([
            'status' => true,
            'message' => 'تم تحديث الكمية',
            'data' => $item,
        ]);
    }

    public function removeItem(Request $request, $itemId)
    {
        $cart = $this->cart($request);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('id', $itemId)
            ->first();

        if ($item) $item->delete();

        return response()->json([
            'status' => true,
            'message' => 'تم حذف المنتج من السلة',
        ]);
    }

    public function clear(Request $request)
    {
        $cart = $this->cart($request);
        CartItem::where('cart_id', $cart->id)->delete();

        return response()->json([
            'status' => true,
            'message' => 'تم تفريغ السلة',
        ]);
    }


    public function merge(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:999',
            'items.*.options' => 'sometimes|array',
            'items.*.options.*.variant_id' => 'required_with:items.*.options|integer|exists:product_variants,id',
            'items.*.options.*.value_id' => 'required_with:items.*.options|integer|exists:variant_values,id',
        ]);

        $cart = $this->cart($request);

        foreach ($data['items'] as $it) {
            $product = Product::findOrFail($it['product_id']);

            $rawOptions = $it['options'] ?? [];

            try {
                $optionsSnapshot = $this->buildOptionsSnapshot($product->id, $rawOptions);
            } catch (\Throwable $e) {
                continue; // تجاهل السطر الغلط بدل كسر الميرج
            }

            $normalizedForHash = $this->normalizeOptionsForHash($rawOptions);
            $hash = $this->optionsHash($normalizedForHash);

            $item = CartItem::firstOrNew([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'options_hash' => $hash,
            ]);

            $item->options = !empty($optionsSnapshot) ? $optionsSnapshot : null;
            $item->quantity = ($item->exists ? $item->quantity : 0) + (int)$it['quantity'];
            $item->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'تم دمج سلة الضيف بنجاح',
        ]);
    }
}
