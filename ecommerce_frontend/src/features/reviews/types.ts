export type ProductLite = {
  id: number;
  name: string;
};

export type CustomerLite = {
  id: number;
  full_name: string;
};

export type Review = {
  id: number;
  product_id: number;
  customer_id: number;
  rating: number;
  comment: string | null;
  user_add_id?: number | null;

  created_at?: string;
  updated_at?: string;

  product?: ProductLite | null;
  customer?: CustomerLite | null;
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

export type ReviewsListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Review>;
};
