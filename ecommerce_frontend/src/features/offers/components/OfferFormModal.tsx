/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Offer, DiscountType, ProductLite } from "../types";
import { useProductsLite } from "../hooks/useProductsLite";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Offer | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function OfferFormModal({ open, mode, initial, onClose, onSubmit, loading }: Props) {
  const isEdit = mode === "edit";
  const { data: products = [] } = useProductsLite();

  const [productId, setProductId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percent");
  const [value, setValue] = useState<string>("");
  const [startAt, setStartAt] = useState<string>(""); // datetime-local
  const [endAt, setEndAt] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    setProductId(initial?.product_id ?? "");
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setDiscountType((initial?.discount_type as DiscountType) ?? "percent");
    setValue(initial?.value ?? "");

    // datetime-local expects: YYYY-MM-DDTHH:mm
    setStartAt(initial?.start_at ? toDateTimeLocal(initial.start_at) : "");
    setEndAt(initial?.end_at ? toDateTimeLocal(initial.end_at) : "");
  }, [open, initial]);

  function toDateTimeLocal(dt: string) {
    // لو dt جاي ISO من لارافيل: 2026-02-14T12:00:00.000000Z
    // نحوله لأقرب format مناسب
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return alert("عنوان العرض مطلوب");
    if (!discountType) return alert("نوع الخصم مطلوب");
    if (value.trim() === "") return alert("قيمة الخصم مطلوبة");

    const payload: any = {
      product_id: productId === "" ? null : Number(productId),
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      discount_type: discountType,
      value: value,
      start_at: startAt ? new Date(startAt).toISOString() : null,
      end_at: endAt ? new Date(endAt).toISOString() : null,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      // سيب المودال مفتوح لو فيه error
    }
  }

  return (
    <Modal open={open} title={isEdit ? "تعديل عرض" : "إضافة عرض"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">المنتج (اختياري)</label>
          <select
            className="mt-1 w-full border rounded-lg p-2"
            value={productId}
            onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">— بدون منتج —</option>
            {products.map((p: ProductLite) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.sku ? `(${p.sku})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">عنوان العرض *</label>
          <input className="mt-1 w-full border rounded-lg p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-gray-600">الوصف</label>
          <textarea className="mt-1 w-full border rounded-lg p-2 min-h-[90px]" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-600">نوع الخصم *</label>
            <select className="mt-1 w-full border rounded-lg p-2" value={discountType} onChange={(e) => setDiscountType(e.target.value as DiscountType)}>
              <option value="percent">نسبة مئوية</option>
              <option value="fixed">قيمة ثابتة</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">القيمة *</label>
            <input type="number" step="0.01" min="0" className="mt-1 w-full border rounded-lg p-2" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>

          <div className="flex items-end">
            <p className="text-xs text-slate-500">
              {discountType === "percent" ? "مثال: 10 يعني خصم 10%" : "مثال: 50 يعني خصم 50 جنيه"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">بداية العرض</label>
            <input type="datetime-local" className="mt-1 w-full border rounded-lg p-2" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">نهاية العرض</label>
            <input type="datetime-local" className="mt-1 w-full border rounded-lg p-2" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
            إلغاء
          </button>
          <button disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
            {loading ? "..." : "حفظ"}
          </button>
        </div>
      </form>
    </Modal>
  );
}