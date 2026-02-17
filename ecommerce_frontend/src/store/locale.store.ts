import { create } from "zustand";

export type Locale = "ar" | "en";
export type Dir = "rtl" | "ltr";

type LocaleState = {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const getInitialLocale = (): Locale => {
  const saved = localStorage.getItem("locale") as Locale | null;
  return saved === "en" || saved === "ar" ? saved : "ar";
};

const toDir = (locale: Locale): Dir => (locale === "ar" ? "rtl" : "ltr");

export const useLocaleStore = create<LocaleState>((set, get) => {
  const initialLocale = getInitialLocale();
  return {
    locale: initialLocale,
    dir: toDir(initialLocale),
    setLocale: (locale) => {
      localStorage.setItem("locale", locale);
      set({ locale, dir: toDir(locale) });
    },
    toggleLocale: () => {
      const next: Locale = get().locale === "ar" ? "en" : "ar";
      localStorage.setItem("locale", next);
      set({ locale: next, dir: toDir(next) });
    },
  };
});