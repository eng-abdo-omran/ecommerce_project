/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import BrandFormModal from "../components/BrandFormModal";
import { useBrands } from "../hooks/useBrands";
import { useCreateBrand, useUpdateBrand, useDeleteBrand } from "../hooks/useBrandMutations";
import type { Brand } from "../types";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function BrandsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 2000);

  const { data, isPending, isFetching } = useBrands({ page, search: debouncedSearch, perPage: 10 });

  const createMut = useCreateBrand();
  const updateMut = useUpdateBrand();
  const deleteMut = useDeleteBrand();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Brand | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pagination = data?.data;
  const brands = pagination?.data ?? [];

  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext = (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const header = useMemo(() => `${pagination?.total ?? 0} Brands`, [pagination?.total]);

  function openCreate() {
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  }

  function openEdit(b: Brand) {
    setFormMode("edit");
    setSelected(b);
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
          <h1 className="text-xl font-bold">Brands</h1>
          <p className="text-sm text-gray-500">
            {header} {isFetching && "— تحديث..."}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm w-64"
            placeholder="Search by name or slug"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (page !== 1) setPage(1);
            }}
          />
          <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
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
                <th className="text-left p-3">Logo</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Slug</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isPending && !data ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    No brands found
                  </td>
                </tr>
              ) : (
                brands.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-3">{b.id}</td>

                    <td className="p-3">
                      {b.logo ? (
                        <img
                          src={`${BACKEND_URL}/${b.logo}`}
                          className="h-10 w-10 rounded object-cover border"
                          alt={b.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded border bg-slate-50 grid place-items-center text-[10px] text-slate-400">
                          —
                        </div>
                      )}
                    </td>

                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3 text-slate-600">{b.slug}</td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEdit(b)}
                        className="mr-2 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"
                        type="button"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => askDelete(b.id)}
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
      <BrandFormModal
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
        title="حذف البراند"
        message="هل أنت متأكد أنك تريد حذف هذا البراند؟"
        confirmText="حذف"
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}