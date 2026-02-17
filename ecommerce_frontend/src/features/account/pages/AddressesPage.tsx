/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from "react";
import { Loader } from "../../../shared/components/ui/Loader";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import Modal from "../../../shared/components/ui/Modal";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";

import { useAuthStore } from "../../../store/auth.store";
import { useAddresses } from "../hooks/useAddresses";
import { useCreateAddress, useUpdateAddress, useDeleteAddress } from "../hooks/useAddressMutations";
import type { Address } from "../api/account.api";

type FormState = {
  label: string;
  city: string;
  street: string;
  notes: string;
};

const emptyForm: FormState = { label: "", city: "", street: "", notes: "" };

export default function AddressesPage() {
  const token = useAuthStore((s) => s.token);

  const q = useAddresses(Boolean(token));
  const createMut = useCreateAddress();
  const updateMut = useUpdateAddress();
  const deleteMut = useDeleteAddress();

  const list = q.data ?? [];

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // modal (add/edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const isBusy = createMut.isPending || updateMut.isPending;

  const canSubmit = useMemo(() => {
    return form.label.trim() && form.city.trim() && form.street.trim();
  }, [form]);

  useEffect(() => {
    if (!modalOpen) return;
    if (mode === "create") {
      setEditing(null);
      setForm(emptyForm);
    } else if (editing) {
      setForm({
        label: editing.label ?? "",
        city: editing.city ?? "",
        street: editing.street ?? "",
        notes: (editing.notes ?? "") as string,
      });
    }
  }, [modalOpen, mode, editing]);

  if (q.isLoading) return <Loader label="جاري تحميل العناوين..." />;

  function openCreate() {
    setMode("create");
    setModalOpen(true);
  }

  function openEdit(a: Address) {
    setMode("edit");
    setEditing(a);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function askDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  function confirmDelete() {
    if (!deleteId) return;
    deleteMut.mutate(deleteId);
    setConfirmOpen(false);
    setDeleteId(null);
  }

  function submit() {
    if (!canSubmit) return;

    if (mode === "create") {
      createMut.mutate({
        label: form.label,
        city: form.city,
        street: form.street,
        notes: form.notes ? form.notes : null,
      } as any);
      closeModal();
      return;
    }

    if (mode === "edit" && editing) {
      updateMut.mutate({
        id: editing.id,
        payload: {
          label: form.label,
          city: form.city,
          street: form.street,
          notes: form.notes ? form.notes : null,
        },
      });
      closeModal();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">العناوين</h1>
          <p className="text-sm text-gray-500">إدارة عناوين الشحن الخاصة بك.</p>
        </div>

        <Button onClick={openCreate}>+ إضافة عنوان</Button>
      </div>

      {!list.length ? (
        <EmptyState title="لا توجد عناوين" description="أضف عنوانك الأول." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((a: any) => (
            <div key={a.id} className="rounded-2xl border bg-white p-4">
              <div className="font-semibold text-gray-900">{a.label}</div>
              <div className="mt-1 text-sm text-gray-600">
                {a.city} — {a.street}
              </div>
              {a.notes ? <div className="mt-1 text-xs text-gray-500">{a.notes}</div> : null}

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => openEdit(a)}>
                  تعديل
                </Button>
                <Button variant="danger" size="sm" onClick={() => askDelete(a.id)}>
                  حذف
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      <Modal
        open={modalOpen}
        title={mode === "create" ? "إضافة عنوان" : "تعديل عنوان"}
        onClose={closeModal}
      >
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="تسمية"
              placeholder="المنزل"
              value={form.label}
              onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))}
            />
            <Input
              label="المدينة"
              placeholder="القاهرة"
              value={form.city}
              onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
            />
            <Input
              label="الشارع"
              placeholder="شارع ..."
              value={form.street}
              onChange={(e) => setForm((s) => ({ ...s, street: e.target.value }))}
              className="sm:col-span-2"
            />
            <Input
              label="ملاحظات (اختياري)"
              placeholder="الدور/الشقة"
              value={form.notes}
              onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              className="sm:col-span-2"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={closeModal}>
              إلغاء
            </Button>
            <Button isLoading={isBusy} onClick={submit} disabled={!canSubmit}>
              حفظ
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="حذف العنوان"
        message="هل أنت متأكد من حذف هذا العنوان؟"
        confirmText="حذف"
        loading={deleteMut.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}