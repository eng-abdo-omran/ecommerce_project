import React from "react";
import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <ToastProvider />
    </QueryProvider>
  );
}