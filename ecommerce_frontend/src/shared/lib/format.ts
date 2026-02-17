export function formatCurrency(value: number, currency = "EGP", locale = "ar-EG") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function toNumber(v: unknown, fallback = 0) {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}