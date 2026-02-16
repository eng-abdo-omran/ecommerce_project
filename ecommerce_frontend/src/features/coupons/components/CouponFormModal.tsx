/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Coupon } from "../types";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Coupon | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function CouponFormModal({ open, mode, initial, onClose, onSubmit, loading }: Props) {
  const isEdit = mode === "edit";

  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState<string>("");
  const [discountType, setDiscountType] = useState<0 | 1>(0);
  const [usageLimit, setUsageLimit] = useState<string>("1");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    setCode(initial?.code ?? "");
    setDiscountValue(initial?.discount_value ?? "");
    setDiscountType((initial?.discount_type ?? 0) as 0 | 1);
    setUsageLimit(initial?.usage_limit?.toString() ?? "1");
    setStartDate(initial?.start_date ?? "");
    setEndDate(initial?.end_date ?? "");
    setDescription(initial?.description ?? "");
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!code.trim()) return alert("كود الكوبون مطلوب");
    if (!discountValue.trim()) return alert("قيمة الخصم مطلوبة");
    if (!startDate) return alert("تاريخ البداية مطلوب");
    if (!endDate) return alert("تاريخ النهاية مطلوب");

    const payload: any = {
      code: code.trim(),
      discount_value: discountValue,
      discount_type: discountType,
      usage_limit: Number(usageLimit || 1),
      start_date: startDate,
      end_date: endDate,
      description: description.trim() ? description.trim() : null,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      // سيب المودال مفتوح لو فيه errors
    }
  }

  return (
    <Modal open={open} title={isEdit ? "تعديل كوبون" : "إضافة كوبون"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Code *</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="مثال: SAVE10"
          />
          <p className="text-xs text-slate-500 mt-1">نصيحة: خلي الكود Capital لتقليل الأخطاء.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-600">نوع الخصم *</label>
            <select
              className="mt-1 w-full border rounded-lg p-2"
              value={discountType}
              onChange={(e) => setDiscountType(Number(e.target.value) as 0 | 1)}
            >
              <option value={0}>قيمة ثابتة</option>
              <option value={1}>نسبة مئوية</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">قيمة الخصم *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="mt-1 w-full border rounded-lg p-2"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">حد الاستخدام *</label>
            <input
              type="number"
              min="1"
              className="mt-1 w-full border rounded-lg p-2"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">تاريخ البداية *</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-lg p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">تاريخ النهاية *</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-lg p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">وصف (اختياري)</label>
          <textarea
            className="mt-1 w-full border rounded-lg p-2 min-h-[90px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ملاحظات عن الكوبون..."
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
            إلغاء
          </button>
          <button
            disabled={loading}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "..." : "حفظ"}
          </button>
        </div>
      </form>
    </Modal>
  );
}