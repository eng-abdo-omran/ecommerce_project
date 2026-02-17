export function required(v: string, msg = "هذا الحقل مطلوب") {
  return v.trim().length ? null : msg;
}

export function minLen(v: string, len: number, msg?: string) {
  return v.trim().length >= len ? null : (msg ?? `الحد الأدنى ${len} حروف`);
}

export function isPhone(v: string, msg = "رقم هاتف غير صحيح") {
  const cleaned = v.replace(/\s+/g, "");
  return /^(\+?\d{10,15})$/.test(cleaned) ? null : msg;
}

export function isEmail(v: string, msg = "بريد إلكتروني غير صحيح") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : msg;
}