/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../../shared/components/ui/Loader";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useAuthStore } from "../../../store/auth.store";
import { useMyOrders } from "../hooks/useMyOrders";

export default function OrdersPage() {
  const token = useAuthStore((s) => s.token);
  const [page, setPage] = useState(1);

  const q = useMyOrders({ page, perPage: 10 }, Boolean(token));

  if (q.isLoading) return <Loader label="جاري تحميل الطلبات..." />;

  const pagination = q.data?.data;
  const orders = pagination?.data ?? [];

  if (!orders.length) {
    return <EmptyState title="لا توجد طلبات حتى الآن" description="عندما تقوم بعمل طلب سيظهر هنا." />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">طلباتي</h1>
        <p className="text-sm text-gray-500">تابع حالة طلباتك وتفاصيلها.</p>
      </div>

      <div className="space-y-2">
        {orders.map((o: any) => (
          <Link
            key={o.id}
            to={`/account/orders/${o.id}`}
            className="block rounded-2xl border p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">
                طلب #{o.order_number ?? o.id}
              </div>
              <span className="text-xs rounded-full px-3 py-1 border bg-white">
                {o.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              الإجمالي: <span className="font-semibold">{o.total_amount}</span>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        page={pagination?.current_page ?? page}
        lastPage={pagination?.last_page ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}