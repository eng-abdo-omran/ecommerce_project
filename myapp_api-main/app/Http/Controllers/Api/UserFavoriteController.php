<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\Request;

class UserFavoriteController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $favorites = Favorite::where('user_id', $userId)
            ->with('product') // نرجع بيانات المنتج مباشرة
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'قائمة المفضلة',
            'data' => $favorites,
        ]);
    }

    public function toggle(Request $request, $productId)
    {
        $userId = $request->user()->id;

        // تأكد المنتج موجود
        $product = Product::findOrFail($productId);

        $fav = Favorite::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->first();

        if ($fav) {
            $fav->delete();
            return response()->json([
                'status' => true,
                'message' => 'تمت الإزالة من المفضلة',
                'data' => ['is_favorite' => false],
            ]);
        }

        Favorite::create([
            'user_id' => $userId,
            'product_id' => $product->id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'تمت الإضافة إلى المفضلة',
            'data' => ['is_favorite' => true],
        ]);
    }
    public function ids(Request $request)
    {
        $userId = $request->user()->id;

        // لو اسم الموديل Favorite:
        $ids = Favorite::where('user_id', $userId)
            ->pluck('product_id')
            ->values();

        return response()->json([
            'status' => true,
            'data' => $ids,
        ]);
    }
}
