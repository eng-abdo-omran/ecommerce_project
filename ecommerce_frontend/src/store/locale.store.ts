import { create } from "zustand";
import i18n from "../app/i18n";

export type Locale = "ar" | "en";
export type Dir = "rtl" | "ltr";

type LocaleState = {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LOCALE_KEY = "locale";

const normalizeLocale = (value: unknown): Locale =>
  value === "en" || value === "ar" ? value : "ar";

const toDir = (locale: Locale): Dir => (locale === "ar" ? "rtl" : "ltr");

export const useLocaleStore = create<LocaleState>((set, get) => {
  const initialLocale = normalizeLocale(localStorage.getItem(LOCALE_KEY));

  // خلّي الستور يتزامن لو اللغة اتغيرت من أي مكان غير الستور
  i18n.on("languageChanged", (lng) => {
    const next = normalizeLocale(lng);
    set({ locale: next, dir: toDir(next) });
  });

  return {
    locale: initialLocale,
    dir: toDir(initialLocale),

    setLocale: (locale) => {
      i18n.changeLanguage(locale); // i18n.ts هيظبط localStorage + dir + lang في DOM
      set({ locale, dir: toDir(locale) });
    },

    toggleLocale: () => {
      const next: Locale = get().locale === "ar" ? "en" : "ar";
      i18n.changeLanguage(next);
      set({ locale: next, dir: toDir(next) });
    },
  };
});