/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosError } from "axios";

type ApiErrorResponse = {
  message?: unknown;
  errors?: Record<string, unknown>;
};

export function getApiErrorMessage(err: unknown): string {
  // لو مش AxiosError
  if (!axios.isAxiosError(err)) {
    if (err instanceof Error) return err.message;
    return "حدث خطأ غير متوقع";
  }

  const error = err as AxiosError<ApiErrorResponse>;
  const data = error.response?.data;

  // لو مفيش response (Network/timeout/DNS)
  if (!error.response) {
    return "تعذر الاتصال بالسيرفر. تحقق من الإنترنت وحاول مرة أخرى";
  }

  // message مباشرة
  if (data?.message && !data?.errors) return String(data.message);

  // errors object: { field: [msg] }
  const errors = data?.errors;
  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const firstVal = (errors as any)[firstKey];

    // لو array messages
    if (Array.isArray(firstVal) && firstVal[0]) return String(firstVal[0]);

    // لو string مباشرة
    if (typeof firstVal === "string") return firstVal;
  }

  return error.message || "حدث خطأ غير متوقع";
}