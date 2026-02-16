/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Favorite } from "../types";
import { useUsersLite } from "../hooks/useUsersLite";
import { useProductsLite } from "../hooks/useProductsLite";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Favorite | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function FavoriteFormModal({ open, mode, initial, onClose, onSubmit, loading }: Props) {
  const isEdit = mode === "edit";
  const { data: users = [] } = useUsersLite();
  const { data: products = [] } = useProductsLite();

  const [userId, setUserId] = useState<number | "">("");
  const [productId, setProductId] = useState<number | "">("");

  useEffect(() => {
    if (!open) return;
    setUserId(initial?.user_id ?? "");
    setProductId(initial?.product_id ?? "");
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (userId === "" || userId === null) return alert("المستخدم مطلوب");
    if (productId === "" || productId === null) return alert("المنتج مطلوب");

    const payload = {
      user_id: Number(userId),
      product_id: Number(productId),
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      // keep modal open on backend validation errors
    }
  }

  return (
    <Modal open={open} title={isEdit ? "تعديل مفضلة" : "إضافة إلى المفضلات"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">المستخدم *</label>
          <select className="mt-1 w-full border rounded-lg p-2" value={userId} onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">— اختر مستخدم —</option>
            {users.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">المنتج *</label>
          <select className="mt-1 w-full border rounded-lg p-2" value={productId} onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">— اختر منتج —</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
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
 