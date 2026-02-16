export type UserLite = {
  id: number;
  name: string;
  email: string;
};

export type ProductLite = {
  id: number;
  name: string;
};

export type Favorite = {
  id: number;
  user_id: number;
  product_id: number;

  created_at?: string;
  updated_at?: string;

  user?: UserLite | null;
  product?: ProductLite | null;
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

export type FavoritesListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Favorite>;
};
