export type InterfaceProductImage = {
  id: number;
  url: string;
  full_url?: string;
  alt_text?: string | null;
  sort_order?: number;
};

export type InterfaceCategory = {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
};

export type InterfaceProduct = {
  id: number;
  name: string;
  price: string;
  compare_price?: string | null;
  main_image?: string; // غالبًا URL كامل
  images?: InterfaceProductImage[];
  category?: InterfaceCategory;
};