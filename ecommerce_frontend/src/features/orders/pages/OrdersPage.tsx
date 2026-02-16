/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useOrders } from "../hooks/useOrders";
import type { OrderStatus } from "../types";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";

const statusOptions: { value: "" | OrderStatus; label: string }[] = [
  { value: "", label: "كل الحالات" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "processing", label: "قيد المعالجة" },
  { value: "shipped", label: "تم الشحن" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

export default function OrdersPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");

  const [sortBy, setSortBy] = useState<
    "created_at" | "total_amount" | "status" | "id"
  >("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data, isPending, isFetching } = useOrders({
    page,
    perPage: 10,

    search: debouncedSearch || undefined,
    status: status || undefined,

    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,

    min_total: minTotal || undefined,
    max_total: maxTotal || undefined,

    sortBy,
    sortDir,
  });

  const statusMut = useUpdateOrderStatus();

  const pagination = data?.data;
  const orders = pagination?.data ?? [];

  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext =
    (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const header = useMemo(
    () => `${pagination?.total ?? 0} طلب`,
    [pagination?.total],
  );

  function resetFilters() {
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setMinTotal("");
    setMaxTotal("");
    setSortBy("created_at");
    setSortDir("desc");
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">الطلبات</h1>
          <p className="text-sm text-gray-500">
            {header} {isFetching && "— تحديث..."}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm w-64"
            placeholder="Search by order number, user name, or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (page !== 1) setPage(1);
            }}
          />
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">الحالة</label>
            <select
              className="mt-1 w-full border rounded-lg p-2 text-sm"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                setPage(1);
              }}
            >
              {statusOptions.map((op) => (
                <option key={op.label} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500">من تاريخ</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-lg p-2 text-sm"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">إلى تاريخ</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-lg p-2 text-sm"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">أقل إجمالي</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg p-2 text-sm"
              value={minTotal}
              onChange={(e) => {
                setMinTotal(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">أعلى إجمالي</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg p-2 text-sm"
              value={maxTotal}
              onChange={(e) => {
                setMaxTotal(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
          <div className="flex gap-2">
            <div>
              <label className="text-xs text-slate-500">ترتيب حسب</label>
              <br />
              <select
                className="mt-1 border rounded-lg p-2 text-sm"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
              >
                <option value="created_at">التاريخ</option>
                <option value="total_amount">الإجمالي</option>
                <option value="status">الحالة</option>
                <option value="id">ID</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">الاتجاه</label>
              <br />
              <select
                className="mt-1 border rounded-lg p-2 text-sm"
                value={sortDir}
                onChange={(e) => {
                  setSortDir(e.target.value as any);
                  setPage(1);
                }}
              >
                <option value="desc">تنازلي</option>
                <option value="asc">تصاعدي</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">رقم الطلب</th>
                <th className="text-left p-3">العميل</th>
                <th className="text-left p-3">الإجمالي</th>
                <th className="text-left p-3">الحالة</th>
                <th className="text-right p-3">إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {isPending && !data ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    جاري التحميل...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    لا توجد طلبات حاليًا.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="p-3">{o.id}</td>
                    <td className="p-3">{o.order_number ?? "—"}</td>
                    <td className="p-3">
                      {o.user ? (
                        <div>
                          <div className="font-medium">{o.user.name}</div>
                          <div className="text-xs text-slate-500">
                            {o.user.email}
                          </div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3">{o.total_amount}</td>
                    <td className="p-3">
                      <select
                        className="border rounded-lg px-2 py-1 text-xs bg-white"
                        value={o.status}
                        onChange={(e) =>
                          statusMut.mutate({
                            id: o.id,
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
                    </td>{" "}
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="px-3 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        التفاصيل
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          صفحة {pagination?.current_page ?? 1} من {pagination?.last_page ?? 1}
        </p>
        <div className="flex gap-2">
          <button
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            type="button"
          >
            Prev
          </button>
          <button
            disabled={!canNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
