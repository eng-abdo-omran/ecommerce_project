/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Customer } from "../types";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Customer | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function CustomerFormModal({ open, mode, initial, onClose, onSubmit, loading }: Props) {
  const isEdit = mode === "edit";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;

    setFullName(initial?.full_name ?? "");
    setPhone(initial?.phone ?? "");
    setAltPhone(initial?.alternate_phone ?? "");
    setCountry(initial?.country ?? "");
    setAddress(initial?.address ?? "");
    setNote(initial?.note ?? "");
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim()) return alert("اسم العميل مطلوب");
    if (!phone.trim()) return alert("رقم الهاتف مطلوب");
    if (!country.trim()) return alert("الدولة مطلوبة");
    if (!address.trim()) return alert("العنوان مطلوب");

    const payload: any = {
      full_name: fullName.trim(),
      phone: phone.trim(),
      alternate_phone: altPhone.trim() ? altPhone.trim() : null,
      country: country.trim(),
      address: address.trim(),
      note: note.trim() ? note.trim() : null,
      // user_id optional (لو عايز تربط بيوزر من users لاحقًا)
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      // سيب المودال مفتوح لو فيه errors
    }
  }

  return (
    <Modal open={open} title={isEdit ? "تعديل عميل" : "إضافة عميل"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">الاسم الكامل *</label>
          <input className="mt-1 w-full border rounded-lg p-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">رقم الهاتف *</label>
            <input className="mt-1 w-full border rounded-lg p-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
          </div>
          <div>
            <label className="text-sm text-gray-600">هاتف بديل</label>
            <input className="mt-1 w-full border rounded-lg p-2" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">الدولة *</label>
          <input className="mt-1 w-full border rounded-lg p-2" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Egypt" />
        </div>

        <div>
          <label className="text-sm text-gray-600">العنوان *</label>
          <textarea className="mt-1 w-full border rounded-lg p-2 min-h-[90px]" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-gray-600">ملاحظات</label>
          <textarea className="mt-1 w-full border rounded-lg p-2 min-h-[90px]" value={note} onChange={(e) => setNote(e.target.value)} />
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