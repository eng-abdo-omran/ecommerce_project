/* eslint-disable @typescript-eslint/no-explicit-any */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function join(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

/**
 * يحوّل أي input (string | array | object) إلى URL صالح للصورة.
 * - لو جالك URL كامل (http://localhost/...) هيشيل الـhost ويعيد بناءه على VITE_BACKEND_URL (مع البورت).
 * - لو جالك path نسبي (product_images/...) هيركبه على VITE_BACKEND_URL.
 * - لو جالك array من الصور: يختار sort_order=0 وإلا أول عنصر.
 * - لو جالك object: يفضل full_url ثم url.
 */
export function resolvePublicImage(input: unknown): string {
  if (!input) return "";

  // 1) String
  if (typeof input === "string") {
    // لو URL كامل
    if (/^https?:\/\//i.test(input)) {
      try {
        const u = new URL(input);
        // ناخد pathname فقط ونبنيه على BACKEND_URL علشان نضمن البورت الصحيح
        const fixedPath = u.pathname.replace(/^\/+/, "");
        return join(BACKEND_URL, fixedPath);
      } catch {
        // لو حصل parsing error لأي سبب
        const cleaned = input.replace(/^\/+/, "");
        return join(BACKEND_URL, cleaned);
      }
    }

    // لو path نسبي
    const clean = input.replace(/^\/+/, "");
    return join(BACKEND_URL, clean);
  }

  // 2) Array (images[])
  if (Array.isArray(input)) {
    const best = input.find((x: any) => x?.sort_order === 0) ?? input[0];
    return resolvePublicImage(best);
  }

  // 3) Object (image item)
  if (typeof input === "object") {
    const obj = input as Record<string, unknown>;

    if (typeof obj.full_url === "string") return resolvePublicImage(obj.full_url);
    if (typeof obj.url === "string") return resolvePublicImage(obj.url);

    // fallback لأي أسماء محتملة
    if (typeof (obj as any).path === "string") return resolvePublicImage((obj as any).path);
    if (typeof (obj as any).src === "string") return resolvePublicImage((obj as any).src);
  }

  return "";
}