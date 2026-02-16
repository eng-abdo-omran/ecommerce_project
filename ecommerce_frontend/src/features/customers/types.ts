export type Customer = {
  id: number;
  full_name: string;
  phone: string;
  alternate_phone: string | null;
  country: string;
  address: string;
  note: string | null;
  user_add_id: number | null;
  user_id: number | null;

  created_at?: string;
  updated_at?: string;

  // relations موجودة في الموديل (userAdd, user) [1](https://fcibuedu-my.sharepoint.com/personal/abdelrahmanmohammed_fci_bu_edu_eg/Documents/Microsoft%20Copilot%20Chat%20Files/customers.txt)
  user_add?: { id: number; name: string; email: string } | null;
  user?: { id: number; name: string; email: string } | null;
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

export type CustomersListResponse = {
  status: boolean;
  message: string;
  data: LaravelPagination<Customer>;
};