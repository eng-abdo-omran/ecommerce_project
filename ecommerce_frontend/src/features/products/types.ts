export type Product = {
  id: number;
  sku: string | null;
  name: string;
  slug: string | null;
  description: string | null;

  price: string; // decimal غالبًا بيرجع string من Laravel
  compare_price: string | null;
  cost_price: string | null;

  weight: number | null;
  quantity: number | null;
  dimensions: string | null;

  images: string | null; //  main image path: product/xxx.jpg
  details: string | null;
  features: string | null;

  supplier_id: number | null;
  category_id: number | null;
  brand_id: number | null;

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

export type ProductsListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Product>;
};

export type BrandLite = {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
};

export type CategoryLite = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
};