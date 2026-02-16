export type Store = {
  id: number;
  name: string;
  domain: string;
  tech_stack: string[] | null;
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

export type StoresListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Store>;
};
