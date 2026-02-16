export type Supplier = {
  id: number;
  full_name: string;
  phone: string | null;
  alternate_phone: string | null;
  total: string | number | null;
  country: string | null;
  address: string | null;
  note: string | null;
  user_add_id: number | null;
  created_at?: string;
  updated_at?: string;
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

export type SuppliersListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Supplier>;
};