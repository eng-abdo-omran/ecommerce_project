/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import type { OrderStatus } from "../types";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const orderId = Number(id);

  const { data, isLoading, isError } = useOrder(orderId);
  const order = data?.data;

  const items = useMemo(() => order?.items ?? [], [order?.items]);

  const statusMut = useUpdateOrderStatus(orderId);

  if (isLoading) return <div className="p-6">جاري التحميل...</div>;
  if (isError || !order)
    return <div className="p-6 text-red-600">تعذر تحميل الطلب</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">تفاصيل الطلب #{order.id}</h1>
          <p className="text-sm text-slate-500">
            رقم الطلب: {order.order_number ?? "—"} 
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
        >
          رجوع
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">الحالة الحالية</div>
          <div className="mt-1">
            <select
              className="border rounded-lg px-3 py-2 text-sm bg-white"
              value={order.status}
              onChange={(e) =>
                statusMut.mutate({
                  id: orderId,
                  status: e.target.value as OrderStatus,
                })
              }
              disabled={statusMut.isPending}
            >
              <option value="pending">قيد الانتظار</option>
              <option value="processing">قيد المعالجة</option>
              <option value="shipped">تم الشحن</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
            {statusMut.isPending && (
              <span className="ml-2 text-xs text-slate-500">جاري الحفظ...</span>
            )}
          </div>
        </div>

        <div className="text-sm text-slate-600">
          الإجمالي: <span className="font-medium">{order.total_amount}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow p-4">
        <h2 className="font-semibold mb-2">بيانات العميل</h2>
        {order.user ? (
          <div className="text-sm">
            <div>
              <span className="text-slate-500">الاسم:</span>
              <br /> {order.user.name}
            </div>
            <div>
              <span className="text-slate-500">الإيميل:</span>
              <br />
              {order.user.email}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">لا يوجد مستخدم مرتبط</div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow p-4">
        <h2 className="font-semibold mb-2">عناصر الطلب</h2>
        {items.length === 0 ? (
          <div className="text-sm text-slate-500">لا توجد عناصر</div>
        ) : (
          <div className="space-y-2">
            {items.map((it: any) => (
              <div key={it.id} className="p-3 rounded-xl border bg-slate-50">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-medium">
                      {it.product?.name ?? `Product #${it.product_id}`}
                    </div>
                    <div className="text-xs text-slate-500">
                      SKU: {it.product?.sku ?? "—"} • Qty: {it.quantity}
                    </div>
                  </div>
                  <div className="text-sm text-slate-700">
                    <div>Unit: {it.unit_price}</div>
                    <div>Subtotal: {it.subtotal}</div>
                  </div>
                </div>
                {it.notes && (
                  <div className="text-xs text-slate-500 mt-2">
                    Notes: {it.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow p-4">
        <h2 className="font-semibold mb-2">العناوين</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border bg-slate-50 p-3">
            <div className="font-medium mb-1">عنوان الشحن</div>
            <pre className="text-xs text-slate-700 whitespace-pre-wrap">
              {JSON.stringify(order.shipping_address, null, 2)}
            </pre>
          </div>
          <div className="rounded-xl border bg-slate-50 p-3">
            <div className="font-medium mb-1">عنوان الفاتورة</div>
            <pre className="text-xs text-slate-700 whitespace-pre-wrap">
              {JSON.stringify(order.billing_address, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
