/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Supplier } from "../types";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Supplier | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function SupplierFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const isEdit = mode === "edit";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [total, setTotal] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;

    setFullName(initial?.full_name ?? "");
    setPhone(initial?.phone ?? "");
    setAltPhone(initial?.alternate_phone ?? "");
    setTotal(initial?.total?.toString?.() ?? "");
    setCountry(initial?.country ?? "");
    setAddress(initial?.address ?? "");
    setNote(initial?.note ?? "");
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim()) return alert("اسم المورد مطلوب");

    const payload: any = {
      full_name: fullName.trim(),
      phone: phone.trim() ? phone.trim() : null,
      alternate_phone: altPhone.trim() ? altPhone.trim() : null,
      total: total.trim() ? Number(total) : null,
      country: country.trim() ? country.trim() : null,
      address: address.trim() ? address.trim() : null,
      note: note.trim() ? note.trim() : null,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      // لو في error من الباك سيب المودال مفتوح
    }
  }

  return (
    <Modal open={open} title={isEdit ? "تعديل مورد" : "إضافة مورد"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">الاسم بالكامل *</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="مثال: Ahmed Supplier"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">الهاتف</label>
            <input
              className="mt-1 w-full border rounded-lg p-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">هاتف بديل</label>
            <input
              className="mt-1 w-full border rounded-lg p-2"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
              placeholder="011..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">الإجمالي (Total)</label>
            <input
              type="number"
              step="0.01"
              className="mt-1 w-full border rounded-lg p-2"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">الدولة</label>
            <input
              className="mt-1 w-full border rounded-lg p-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Egypt"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">العنوان</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="القاهرة..."
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">ملاحظة</label>
          <textarea
            className="mt-1 w-full border rounded-lg p-2 min-h-[90px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="..."
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
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