<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected OrderService $service;

    public function __construct(OrderService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $orders = $this->service->indexOrders([
            'search'    => $request->query('search'),
            'status'    => $request->query('status'),
            'perPage'   => (int) $request->query('perPage', 10),

            'date_from' => $request->query('date_from'),
            'date_to'   => $request->query('date_to'),

            'min_total' => $request->query('min_total'),
            'max_total' => $request->query('max_total'),

            'sortBy'    => $request->query('sortBy', 'created_at'),
            'sortDir'   => $request->query('sortDir', 'desc'),
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'قائمة الطلبات',
            'data'    => $orders
        ]);
    }

    public function show($id)
    {
        $result = $this->service->get($id);

        if (!($result['status'] ?? false)) {
            return response()->json($result, 404);
        }

        return response()->json($result);
    }

    public function store(OrderRequest $request)
    {
        $result = $this->service->create($request->validated());
        return response()->json($result, ($result['status'] ?? false) ? 201 : 500);
    }

    public function update(OrderRequest $request, $id)
    {
        $result = $this->service->update($id, $request->validated());
        return response()->json($result, ($result['status'] ?? false) ? 200 : 500);
    }

    public function destroy($id)
    {
        $result = $this->service->delete($id);
        return response()->json($result, ($result['status'] ?? false) ? 200 : 404);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $status = $request->validated()['status'];

        $result = $this->service->updateStatus($id, $status);

        return response()->json($result, ($result['status'] ?? false) ? 200 : 404);
    }
}
