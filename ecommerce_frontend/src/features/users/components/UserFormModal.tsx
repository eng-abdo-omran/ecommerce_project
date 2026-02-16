/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { User } from "../types";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: User | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function UserFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [role, setRole] = useState<number>(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setPhone(initial?.phone ?? "");
    setAddress(initial?.address ?? "");
    setRole(initial?.role ?? 1);
    setPassword("");
    setConfirmPassword("");
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return alert("الاسم مطلوب");
    if (!email.trim()) return alert("الإيميل مطلوب");

    if (mode === "create") {
      if (!password) return alert("كلمة المرور مطلوبة");
      if (password.length < 8)
        return alert("كلمة المرور يجب ألا تقل عن 8 أحرف");
      if (password !== confirmPassword)
        return alert("تأكيد كلمة المرور غير متطابق");
    }

    const payload: any = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() ? phone.trim() : null,
      address: address?.trim() ? address.trim() : null,
      role,
    };

    if (mode === "create") {
      payload.password = password;
      payload.password_confirmation = confirmPassword; // مهم جدًا للباك
    }

    try {
      await onSubmit(payload);
      onClose(); // يقفل بس في حالة النجاح
    } catch (e) {
      // سيب المودال مفتوح لو فيه validation error
    }
  }
  return (
    <Modal
      open={open}
      title={mode === "create" ? "إضافة مستخدم" : "تعديل مستخدم"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              className="mt-1 w-full border rounded-lg p-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              className="mt-1 w-full border rounded-lg p-2"
              value={role}
              onChange={(e) => setRole(Number(e.target.value))}
            >
              <option value={1}>Admin</option>
              <option value={0}>User</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Address</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {mode === "create" && (
          <>
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                className="mt-1 w-full border rounded-lg p-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Confirm Password</label>
              <input
                className="mt-1 w-full border rounded-lg p-2"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
              />
            </div>
          </>
        )}

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
