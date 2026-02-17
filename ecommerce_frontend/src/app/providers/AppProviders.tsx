import React, { useEffect } from "react";
import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";
import { useLocaleStore } from "../../store/locale.store";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useLocaleStore();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <QueryProvider>
      {children}
      <ToastProvider />
    </QueryProvider>
  );
}