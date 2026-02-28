import { http } from "../../../api/axios";

export type OverviewResponse = {
  status: boolean;
  data: {
    kpis: {
      orders_today: number;
      orders_month: number;
      revenue_today: number;
      revenue_month: number;
      products_count: number;
      customers_count: number;
    };
    by_status: Record<string, number>;
    recent_orders: Array<{
      id: number;
      order_number: string | null;
      status: string;
      total_amount: number;
      created_at: string;
      customer: { id: number; name: string; email: string } | null;
    }>;
    low_stock: Array<{
      id: number;
      name: string;
      quantity: number | null;
      price: string | number;
    }>;
    revenue_last_7_days: Array<{ date: string; revenue: number }>;
    currency: "EGP";
  };
};

export async function getAdminOverview() {
  const { data } = await http.get<OverviewResponse>("/dashboard/overview");
  return data;
}