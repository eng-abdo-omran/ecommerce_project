import { useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import type { Category } from "../types";
import CategoryFormModal from "../components/CategoryFormModal";
import { useCategories } from "../hooks/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategoryMutations";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isPending, isFetching } = useCategories({
    page,
    search: debouncedSearch,
  });

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Category | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pagination = data?.data;
  const categories = pagination?.data ?? [];

  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext =
    (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const header = useMemo(
    () => `${pagination?.total ?? 0} Category`,
    [pagination?.total],
  );

  function openCreate() {
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  }
  function openEdit(c: Category) {
    setFormMode("edit");
    setSelected(c);
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
          <h1 className="text-xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500">
            {header} {isFetching && "— تحديث..."}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm w-56"
            placeholder="Search by name/slug"
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

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Slug</th>
                <th className="text-left p-3">Parent</th>
                <th className="text-left p-3">Image</th>
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
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="p-3">{c.id}</td>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 text-slate-600">{c.slug}</td>
                    <td className="p-3 text-slate-600">
                      {c.category_id ?? "—"}
                    </td>
                    <td className="p-3 text-slate-600">
                      {c.image ? (
                        <img
                          src={`http://127.0.0.1:8000/${c.image}`}
                          className="h-10 w-10 rounded object-cover border"
                          alt={c.name}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEdit(c)}
                        className="mr-2 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => askDelete(c.id)}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
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
          >
            Prev
          </button>
          <button
            disabled={!canNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <CategoryFormModal
        open={formOpen}
        mode={formMode}
        initial={selected}
        parents={categories} // بسيطة كبداية، لو عايز كل الأقسام نعمل endpoint lite
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="حذف القسم"
        message="هل أنت متأكد أنك تريد حذف هذا القسم؟"
        confirmText="حذف"
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
