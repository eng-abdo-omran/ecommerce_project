import { create } from "zustand";

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  count: () => number;
  clear: () => void;
};

function loadFavs(): number[] {
  try {
    const raw = localStorage.getItem("fav_ids");
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function saveFavs(ids: number[]) {
  localStorage.setItem("fav_ids", JSON.stringify(ids));
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadFavs(),

  toggle: (id) => {
    const s = new Set(get().ids);
    if (s.has(id)) s.delete(id);
    else s.add(id);

    const next = Array.from(s);
    saveFavs(next);
    set({ ids: next });
  },

  has: (id) => get().ids.includes(id),

  count: () => get().ids.length,

  clear: () => {
    saveFavs([]);
    set({ ids: [] });
  },
}));