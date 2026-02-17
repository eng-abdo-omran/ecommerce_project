import { create } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  price: string;
  image?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  count: () => number;
};

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("cart_items");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem("cart_items", JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),

  addItem: (item, qty = 1) => {
    const items = [...get().items];
    const idx = items.findIndex((x) => x.id === item.id);

    if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty };
    else items.push({ ...item, qty });

    saveCart(items);
    set({ items });
  },

  removeItem: (id) => {
    const items = get().items.filter((x) => x.id !== id);
    saveCart(items);
    set({ items });
  },

  setQty: (id, qty) => {
    const items = get().items.map((x) =>
      x.id === id ? { ...x, qty: Math.max(1, qty) } : x
    );
    saveCart(items);
    set({ items });
  },

  clear: () => {
    saveCart([]);
    set({ items: [] });
  },

  count: () => get().items.reduce((acc, x) => acc + x.qty, 0),
}));