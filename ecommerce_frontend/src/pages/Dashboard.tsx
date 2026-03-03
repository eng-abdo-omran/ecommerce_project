/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminOverview } from "../features/admin/hooks/useAdminOverview";
import { Loader } from "../shared/components/ui/Loader";
import { Button } from "../shared/components/ui/Button";
import { getApiErrorMessage } from "../shared/utils/error";
import { useTranslation } from "react-i18next";

function formatMoney(value: number, currency = "EGP", locale = "en-US") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function StatusPill({
  status,
  label,
  count,
}: {
  status: string;
  label: string;
  count: number;
}) {
  const tone =
    status === "pending"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "processing"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : status === "shipped"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : status === "completed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${tone}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-60" />
      {label}
      <span className="ms-1 rounded-full bg-black/5 px-2 py-0.5 text-[11px]">
        {count}
      </span>
    </span>
  );
}

function StatCard({
  title,
  value,
  sub,
  icon,
  onClick,
}: {
  title: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        text-left rounded-3xl border bg-white p-5 shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300
        focus:outline-none focus:ring-2 focus:ring-black/10
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-600">{title}</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900">
            {value}
          </div>
          {sub ? <div className="mt-2 text-xs text-gray-500">{sub}</div> : null}
        </div>
        {icon ? (
          <div className="h-12 w-12 rounded-2xl bg-black text-white grid place-items-center shadow-sm">
            {icon}
          </div>
        ) : null}
      </div>
    </button>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const { t, i18n } = useTranslation();
  const q = useAdminOverview();

  const data = q.data?.data;
  const currency = data?.currency ?? "EGP";

  // ✅ تنسيق رقم/عملة حسب اللغة (جزء من الـ i18n)
  const moneyLocale = i18n.language === "en" ? "en-US" : "ar-EG";

  const last7 = data?.revenue_last_7_days ?? [];
  const maxRev = useMemo(
    () => Math.max(1, ...last7.map((x) => x.revenue)),
    [last7]
  );

  if (q.isLoading)
    return (
      <Loader
        label={t("admin.overview.loading", {
          defaultValue: "Loading overview...",
        })}
      />
    );

  if (q.isError) {
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="text-xl font-extrabold text-gray-900">
          {t("admin.overview.failed", {
            defaultValue: "Failed to load overview",
          })}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {getApiErrorMessage(q.error)}
        </div>
        <div className="mt-4">
          <Button onClick={() => q.refetch()}>
            {t("admin.overview.retry", { defaultValue: "Retry" })}
          </Button>
        </div>
      </div>
    );
  }

  const k = data!.kpis;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-gray-500">
              {t("admin.overview.breadcrumb", {
                defaultValue: "Admin / Overview",
              })}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("admin.overview.title", { defaultValue: "Overview" })}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {t("admin.overview.subtitle", {
                defaultValue:
                  "Quick snapshot of orders, revenue and inventory health.",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => nav("/admin/orders")}>
              {t("admin.top.viewOrders", { defaultValue: "View Orders" })}
            </Button>
            <Button onClick={() => nav("/admin/products")}>
              {t("admin.top.manageProducts", {
                defaultValue: "Manage Products",
              })}
            </Button>
            
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title={t("admin.overview.kpis.ordersToday", {
            defaultValue: "Orders Today",
          })}
          value={`${k.orders_today}`}
          sub={t("admin.overview.kpis.ordersTodaySub", {
            defaultValue: "Number of orders created today",
          })}
          icon={<span className="text-lg font-extrabold">O</span>}
          onClick={() => nav("/admin/orders")}
        />
        <StatCard
          title={t("admin.overview.kpis.revenueToday", {
            defaultValue: "Revenue Today",
          })}
          value={formatMoney(k.revenue_today, currency, moneyLocale)}
          sub={t("admin.overview.kpis.revenueTodaySub", {
            defaultValue: "Sum of today orders totals",
          })}
          icon={<span className="text-lg font-extrabold">$</span>}
          onClick={() => nav("/admin/orders")}
        />
        <StatCard
          title={t("admin.overview.kpis.ordersMonth", {
            defaultValue: "Orders This Month",
          })}
          value={`${k.orders_month}`}
          sub={t("admin.overview.kpis.ordersMonthSub", {
            defaultValue: "Orders since month start",
          })}
          icon={<span className="text-lg font-extrabold">M</span>}
          onClick={() => nav("/admin/orders")}
        />
        <StatCard
          title={t("admin.overview.kpis.revenueMonth", {
            defaultValue: "Revenue This Month",
          })}
          value={formatMoney(k.revenue_month, currency, moneyLocale)}
          sub={t("admin.overview.kpis.revenueMonthSub", {
            defaultValue: "Revenue since month start",
          })}
          icon={<span className="text-lg font-extrabold">R</span>}
          onClick={() => nav("/admin/orders")}
        />
        <StatCard
          title={t("admin.overview.kpis.products", {
            defaultValue: "Products",
          })}
          value={`${k.products_count}`}
          sub={t("admin.overview.kpis.productsSub", {
            defaultValue: "Total products in catalog",
          })}
          icon={<span className="text-lg font-extrabold">P</span>}
          onClick={() => nav("/admin/products")}
        />
        <StatCard
          title={t("admin.overview.kpis.customers", {
            defaultValue: "Customers",
          })}
          value={`${k.customers_count}`}
          sub={t("admin.overview.kpis.customersSub", {
            defaultValue: "Total customers count",
          })}
          icon={<span className="text-lg font-extrabold">C</span>}
          onClick={() => nav("/admin/customers")}
        />
      </div>

      {/* Status + Chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-700">
                {t("admin.overview.revenueTitle", {
                  defaultValue: "Revenue (Last 7 days)",
                })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t("admin.overview.revenueSub", {
                  defaultValue: "Mini chart based on daily totals",
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 items-end h-28">
            {last7.map((d) => {
              const h = Math.round((d.revenue / maxRev) * 100);
              return (
                <div key={d.date} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-xl bg-black/10 overflow-hidden h-20 flex items-end"
                    title={`${d.date}: ${formatMoney(d.revenue, currency, moneyLocale)}`}
                  >
                    <div
                      className="w-full rounded-xl bg-black"
                      style={{ height: `${Math.max(6, h)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-500">{d.date.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">
            {t("admin.overview.ordersByStatus", {
              defaultValue: "Orders by Status",
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(data!.by_status ?? {}).map(([st, cnt]) => (
              <StatusPill
                key={st}
                status={st}
                count={cnt as number}
                label={t(`admin.status.${st}`, { defaultValue: st })}
              />
            ))}
          </div>
          <div className="mt-4">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => nav("/admin/orders")}
            >
              {t("admin.overview.openOrders", { defaultValue: "Open Orders" })}
            </Button>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-700">
                {t("admin.overview.recentOrders", { defaultValue: "Recent Orders" })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t("admin.overview.recentOrdersSub", { defaultValue: "Last 8 orders" })}
              </div>
            </div>
            <button
              className="text-sm font-semibold text-gray-900 hover:underline"
              onClick={() => nav("/admin/orders")}
              type="button"
            >
              {t("admin.overview.viewAll", { defaultValue: "View all" })}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {(data!.recent_orders ?? []).map((o) => (
              <button
                key={o.id}
                onClick={() => nav(`/admin/orders/${o.id}`)}
                className="
                  w-full text-left rounded-2xl border bg-white px-4 py-3
                  transition hover:bg-gray-50 hover:border-gray-300
                "
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">
                      {o.order_number ?? `#${o.id}`} —{" "}
                      <span className="text-gray-500">
                        {t(`admin.status.${o.status}`, { defaultValue: o.status })}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {o.customer?.name ?? t("common.na", { defaultValue: "—" })} •{" "}
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="font-extrabold text-gray-900">
                    {formatMoney(o.total_amount, currency, moneyLocale)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-700">
                {t("admin.overview.lowStock", { defaultValue: "Low Stock" })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t("admin.overview.lowStockSub", {
                  defaultValue: "Products near out-of-stock",
                })}
              </div>
            </div>
            <button
              className="text-sm font-semibold text-gray-900 hover:underline"
              onClick={() => nav("/admin/products")}
              type="button"
            >
              {t("admin.overview.manage", { defaultValue: "Manage" })}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {(data!.low_stock ?? []).map((p) => (
              <button
                key={p.id}
                onClick={() => nav(`/admin/products/${p.id}`)}
                className="
                  w-full text-left rounded-2xl border bg-white px-4 py-3
                  transition hover:bg-gray-50 hover:border-gray-300
                "
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {t("admin.overview.price", { defaultValue: "Price:" })} {p.price}
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-rose-700">
                    {t("admin.overview.qty", { defaultValue: "Qty:" })} {p.quantity ?? 0}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Button className="w-full" onClick={() => nav("/admin/products")}>
              {t("admin.overview.restock", { defaultValue: "Restock Products" })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}