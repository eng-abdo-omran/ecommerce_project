/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import SupplierFormModal from "../components/SupplierFormModal";
import { useSuppliers } from "../hooks/useSuppliers";
import {
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "../hooks/useSupplierMutations";
import type { Supplier } from "../types";

export default function SuppliersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isPending, isFetching } = useSuppliers({
    page,
    search: debouncedSearch,
    perPage: 10,
  });

  const createMut = useCreateSupplier();
  const updateMut = useUpdateSupplier();
  const deleteMut = useDeleteSupplier();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Supplier | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pagination = data?.data;
  const suppliers: Supplier[] = pagination?.data ?? [];

  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext = (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const header = useMemo(
    () => `${pagination?.total ?? 0} Suppliers`,
    [pagination?.total]
  );

  function openCreate() {
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  }

  function openEdit(s: Supplier) {
    setFormMode("edit");
    setSelected(s);
    setFormOpen(true);
  }

  function askDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  async function handleSubmit(payload: any) {
    if (formMode === "create") {
      await createMut.mutateAsync(payload);
    } else if (selected) {
      await updateMut.mutateAsync({ id: selected.id, payload });
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await deleteMut.mutateAsync(deleteId);
    setConfirmOpen(false);
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Suppliers</h1>
          <p className="text-sm text-gray-500">
            {header} {isFetching && "— تحديث..."}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm w-64"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (page !== 1) setPage(1);
            }}
          />
          <button
            onClick={openCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Country</th>
                <th className="text-left p-3">All</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isPending && !data ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    لا يوجد موردين
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-3">{s.id}</td>
                    <td className="p-3 font-medium">{s.full_name}</td>
                    <td className="p-3 text-slate-600">{s.phone ?? "—"}</td>
                    <td className="p-3 text-slate-600">{s.country ?? "—"}</td>
                    <td className="p-3 text-slate-700">{s.total ?? "—"}</td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEdit(s)}
                        className="mr-2 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"
                        type="button"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => askDelete(s.id)}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {pagination?.current_page ?? 1} of {pagination?.last_page ?? 1}
        </p>
        <div className="flex gap-2">
          <button
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            type="button"
          >
            Prev
          </button>
          <button
            disabled={!canNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            type="button"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <SupplierFormModal
        open={formOpen}
        mode={formMode}
        initial={selected}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="حذف المورد"
        message="هل أنت متأكد أنك تريد حذف هذا المورد؟"
        confirmText="حذف"
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
