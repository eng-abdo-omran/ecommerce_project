export type DiscountType = "percent" | "fixed";

export type Offer = {
  id: number;
  user_add_id: number | null;
  product_id: number | null;

  title: string;
  description: string | null;

  discount_type: DiscountType;
  value: string; // decimal غالبًا string من Laravel

  start_at: string | null; // datetime
  end_at: string | null;

  created_at?: string;
  updated_at?: string;

  // relations (OfferService بيرجع userAdd + product) [1](https://fcibuedu-my.sharepoint.com/personal/abdelrahmanmohammed_fci_bu_edu_eg/Documents/Microsoft%20Copilot%20Chat%20Files/offers.txt)
  user_add?: { id: number; name: string; email: string } | null;
  product?: { id: number; name: string; sku?: string | null } | null;
};

export type LaravelPagination<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  from: number | null;
  to: number | null;
};

export type OffersListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Offer>;
};

export type ProductLite = {
  id: number;
  name: string;
  sku: string | null;
};