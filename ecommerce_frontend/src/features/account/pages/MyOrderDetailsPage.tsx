/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router-dom";
import { Loader } from "../../../shared/components/ui/Loader";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { useAuthStore } from "../../../store/auth.store";
import { useMyOrder } from "../hooks/useMyOrders";
import { resolvePublicImage } from "../../../shared/utils/assets";

export default function OrderDetailsPage() {
  const token = useAuthStore((s) => s.token);
  const { id } = useParams();
  const orderId = Number(id);

  const q = useMyOrder(orderId, Boolean(token));

  if (q.isLoading) return <Loader label="جاري تحميل تفاصيل الطلب..." />;

  const order = q.data?.data;
  if (!order) return <EmptyState title="تعذر تحميل الطلب" />;

  const items = order.items ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">تفاصيل الطلب</h1>
          <p className="text-sm text-gray-500">طلب #{order.order_number ?? order.id}</p>
        </div>
        <Link to="/account/orders" className="text-sm text-indigo-600 hover:underline">
          رجوع
        </Link>
      </div>

      <div className="rounded-2xl border p-4 bg-gray-50">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border bg-white px-3 py-1">الحالة: {order.status}</span>
          <span className="rounded-full border bg-white px-3 py-1">الإجمالي: {order.total_amount}</span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((it: any) => {
          const p = it.product ?? {};
          const img = resolvePublicImage(p.images ?? null);
          return (
            <div key={it.id} className="rounded-2xl border p-4">
              <div className="flex gap-3">
                <div className="h-16 w-16 rounded-xl border bg-gray-50 overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={p.name ?? ""}
                      className="h-full w-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 line-clamp-1">{p.name ?? `#${it.product_id}`}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    كمية: <span className="font-semibold">{it.quantity}</span> — سعر: {it.unit_price}
                  </div>
                </div>

                <div className="text-sm font-semibold text-gray-900">
                  {it.subtotal}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}