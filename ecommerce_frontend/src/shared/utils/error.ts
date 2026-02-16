import type { AxiosError } from "axios";

export function getApiErrorMessage(err: unknown): string {
  const error = err as AxiosError<any>;
  const data = error?.response?.data;

  // رسالة عامة
  if (data?.message && !data?.errors) return String(data.message);

  // يدعم: { errors: { field: [msg] } } سواء Laravel أو شكل الباك عندك
  if (data?.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstMsg = data.errors[firstKey]?.[0];
    if (firstMsg) return String(firstMsg);
  }

  return error?.message || "حدث خطأ غير متوقع";
}