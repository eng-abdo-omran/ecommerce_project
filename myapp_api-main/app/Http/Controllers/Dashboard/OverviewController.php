<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OverviewController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();
        $monthStart = Carbon::now()->startOfMonth();

        // KPIs
        $ordersToday = Order::whereDate('created_at', $today)->count();
        $ordersMonth = Order::where('created_at', '>=', $monthStart)->count();

        $revenueToday = (float) Order::whereDate('created_at', $today)->sum('total_amount');
        $revenueMonth = (float) Order::where('created_at', '>=', $monthStart)->sum('total_amount');

        $productsCount = Product::count();
        $customersCount = class_exists(Customer::class) ? Customer::count() : 0;

        // Low stock (threshold configurable)
        $threshold = (int)($request->query('lowStock', 5));
        $lowStock = Product::select('id', 'name', 'quantity', 'price')
            ->whereNotNull('quantity')
            ->where('quantity', '<=', $threshold)
            ->orderBy('quantity', 'asc')
            ->limit(8)
            ->get();

        // Recent orders
        $recentOrders = Order::with(['user', 'items.product'])
            ->latest()
            ->limit(8)
            ->get()
            ->map(function ($o) {
                return [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'status' => $o->status,
                    'total_amount' => (float) $o->total_amount,
                    'created_at' => $o->created_at,
                    'customer' => $o->user ? [
                        'id' => $o->user->id,
                        'name' => $o->user->name,
                        'email' => $o->user->email,
                    ] : null,
                ];
            });

        // Orders by status (for donut / pills)
        $byStatus = Order::select('status', DB::raw('COUNT(*) as cnt'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn($r) => [$r->status => (int)$r->cnt]);

        // Last 7 days revenue (simple mini chart)
        $last7 = collect(range(0, 6))->map(function ($i) {
            $d = Carbon::today()->subDays(6 - $i);
            $sum = (float) Order::whereDate('created_at', $d)->sum('total_amount');
            return [
                'date' => $d->toDateString(),
                'revenue' => $sum,
            ];
        });

        return response()->json([
            'status' => true,
            'data' => [
                'kpis' => [
                    'orders_today' => $ordersToday,
                    'orders_month' => $ordersMonth,
                    'revenue_today' => $revenueToday,
                    'revenue_month' => $revenueMonth,
                    'products_count' => $productsCount,
                    'customers_count' => $customersCount,
                ],
                'by_status' => $byStatus,
                'recent_orders' => $recentOrders,
                'low_stock' => $lowStock,
                'revenue_last_7_days' => $last7,
                'currency' => 'EGP',
            ],
        ]);
    }
}
