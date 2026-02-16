export type Coupon = {
  id: number;
  code: string;

  discount_value: string; // decimal غالبًا string
  discount_type: 0 | 1;   // 0 fixed, 1 percentage (حسب request) [1](https://fcibuedu-my.sharepoint.com/personal/abdelrahmanmohammed_fci_bu_edu_eg/Documents/Microsoft%20Copilot%20Chat%20Files/new.txt)

  usage_limit: number;

  start_date: string; // date
  end_date: string;   // date

  description: string | null;
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

export type CouponsListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Coupon>;
};