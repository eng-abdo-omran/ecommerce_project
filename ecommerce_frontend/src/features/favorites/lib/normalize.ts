/* eslint-disable @typescript-eslint/no-explicit-any */
export function normalizeFavoriteProducts(items: any[]): any[] {
  return (items ?? []).map((x) => x?.product ?? x).filter(Boolean);
}