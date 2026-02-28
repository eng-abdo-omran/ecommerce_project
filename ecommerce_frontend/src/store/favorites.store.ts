import { create } from "zustand";

type FavoritesState = {
  ids: Record<number, true>;
  setAll: (ids: number[]) => void;
  has: (id: number) => boolean;
  toggle: (id: number) => void;

  clear: () => void;
};

function loadIds(): Record<number, true> {
  try {
    const raw = localStorage.getItem("favorite_ids");
    if (!raw) return {};
    const arr = JSON.parse(raw) as number[];
    const map: Record<number, true> = {};
    for (const id of arr) map[id] = true;
    return map;
  } catch {
    return {};
  }
}

function persist(map: Record<number, true>) {
  const ids = Object.keys(map).map((x) => Number(x));
  localStorage.setItem("favorite_ids", JSON.stringify(ids));
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadIds(),

  setAll: (ids) => {
    const map: Record<number, true> = {};
    ids.forEach((id) => (map[id] = true));
    persist(map);
    set({ ids: map });
  },

  has: (id) => Boolean(get().ids[id]),

  toggle: (id) => {
    const next = { ...get().ids };
    if (next[id]) delete next[id];
    else next[id] = true;
    persist(next);
    set({ ids: next });
  },
  

  clear: () => {
    localStorage.removeItem("favorite_ids");
    set({ ids: {} });
  },
}));