export type Category = {
  id: number;
  name: string;
  slug: string;
  note: string | null;
  image: string | null;
  user_add_id: number | null;
  category_id: number | null;
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

export type CategoriesListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Category>;
};