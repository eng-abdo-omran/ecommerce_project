<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class MyOrderController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('perPage', 10);

        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product']) // مهم للـUI
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'message' => 'طلباتي',
            'data' => $orders,
        ]);
    }

    public function show(Request $request, $id)
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with(['items.product'])
            ->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => 'تفاصيل الطلب',
            'data' => $order,
        ]);
    }
}
