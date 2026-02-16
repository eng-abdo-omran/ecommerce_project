export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: number;
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

export type UsersListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<User>;
};
