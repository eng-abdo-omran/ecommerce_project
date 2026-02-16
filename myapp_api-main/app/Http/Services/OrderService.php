<?php

namespace App\Http\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderService
{
    protected Order $model;

    public function __construct(Order $model)
    {
        $this->model = $model;
    }

    /**
     * List (basic)
     */
    public function list()
    {
        return $this->model->with(['user', 'items.product'])->paginate(15);
    }

    /**
     * Get single order
     */
    public function get($id)
    {
        $order = $this->model->with(['user', 'items.product'])->find($id);

        if (!$order) {
            return [
                'status' => false,
                'message' => 'الطلب غير موجود',
            ];
        }

        return [
            'status' => true,
            'message' => 'تفاصيل الطلب',
            'data' => $order
        ];
    }

    /**
     * Create order + items
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $orderItems = $data['order_items'];
            unset($data['order_items']);

            $order = $this->model->create($data);

            foreach ($orderItems as $item) {
                $item['order_id'] = $order->id;
                OrderItem::create($item);
            }

            return [
                'status' => true,
                'message' => 'تم إنشاء الطلب بنجاح',
                'data' => $this->model->with(['user', 'items.product'])->find($order->id)
            ];
        });
    }

    /**
     * Update order + replace items (simple strategy)
     */
    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $order = $this->model->find($id);

            if (!$order) {
                return [
                    'status' => false,
                    'message' => 'الطلب غير موجود',
                ];
            }

            $orderItems = $data['order_items'];
            unset($data['order_items']);

            $order->update($data);

            // replace items
            $order->items()->delete();

            foreach ($orderItems as $item) {
                $item['order_id'] = $order->id;
                OrderItem::create($item);
            }

            return [
                'status' => true,
                'message' => 'تم تحديث الطلب بنجاح',
                'data' => $this->model->with(['user', 'items.product'])->find($order->id)
            ];
        });
    }

    /**
     * Delete order + items
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $order = $this->model->find($id);

            if (!$order) {
                return [
                    'status' => false,
                    'message' => 'الطلب غير موجود',
                ];
            }

            $order->items()->delete();
            $order->delete();

            return [
                'status' => true,
                'message' => 'تم حذف الطلب بنجاح',
            ];
        });
    }

    /**
     * Advanced index with search/filters/sort/pagination
     */
    public function indexOrders(array $filters = [])
    {
        $search   = $filters['search'] ?? null;
        $status   = $filters['status'] ?? null;
        $dateFrom = $filters['date_from'] ?? null;
        $dateTo   = $filters['date_to'] ?? null;
        $minTotal = $filters['min_total'] ?? null;
        $maxTotal = $filters['max_total'] ?? null;

        $sortBy   = $filters['sortBy'] ?? 'created_at';
        $sortDir  = $filters['sortDir'] ?? 'desc';
        $perPage  = (int)($filters['perPage'] ?? 10);

        //  العلاقات الصحيحة حسب Order model: user + items
        $query = $this->model->with(['user', 'items.product']);

        //  Search: order_number / id / notes / user name/email / product name/sku
        if ($search) {
            $query->where(function ($q) use ($search) {

                if (is_numeric($search)) {
                    $q->orWhere('id', (int)$search);
                }

                $q->orWhere('order_number', 'like', "%{$search}%");
                $q->orWhere('notes', 'like', "%{$search}%");

                $q->orWhereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });

                $q->orWhereHas('items.product', function ($pq) use ($search) {
                    $pq->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            });
        }

        // status filter
        if ($status) {
            $query->where('status', $status);
        }

        // totals range  اسم العمود: total_amount
        if ($minTotal !== null && $minTotal !== '') {
            $query->where('total_amount', '>=', $minTotal);
        }
        if ($maxTotal !== null && $maxTotal !== '') {
            $query->where('total_amount', '<=', $maxTotal);
        }

        // date range
        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        // sorting whitelist
        $allowedSort = ['id', 'order_number', 'total_amount', 'status', 'created_at'];
        if (!in_array($sortBy, $allowedSort)) $sortBy = 'created_at';

        $sortDir = strtolower($sortDir) === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $sortDir)->paginate($perPage);
    }

    public function updateStatus($id, string $status)
    {
        $order = $this->model->find($id);

        if (!$order) {
            return [
                'status' => false,
                'message' => 'الطلب غير موجود',
            ];
        }

        $order->update(['status' => $status]);

        return [
            'status' => true,
            'message' => 'تم تحديث حالة الطلب بنجاح',
            'data' => $this->model->with(['user', 'items.product'])->find($order->id)
        ];
    }
}
