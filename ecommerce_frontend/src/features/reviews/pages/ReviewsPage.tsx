/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import ReviewFormModal from "../components/ReviewFormModal";
import { useReviews } from "../hooks/useReviews";
import { useCreateReview, useUpdateReview, useDeleteReview } from "../hooks/useReviewMutations";
import type { Review } from "../types";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isPending, isFetching } = useReviews({ page, perPage: 10, search: debouncedSearch });

  const createMut = useCreateReview();
  const updateMut = useUpdateReview();
  const deleteMut = useDeleteReview();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Review | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pagination = data?.data;
  const reviews = pagination?.data ?? [];

  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext = (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const header = useMemo(() => `${pagination?.total ?? 0} تقييم`, [pagination?.total]);

  function openCreate() {
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  }

  function openEdit(r: Review) {
    setFormMode("edit");
    setSelected(r);
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
          <h1 className="text-xl font-bold">Reviews</h1>
          <p className="text-sm text-gray-500">
            {header} {isFetching && "— تحديث..."}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm w-64"
            placeholder="بحث بالمنتج أو العميل..."
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
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-left p-3">Comment</th>
                <th className="text-left p-3">Created At</th>
                <th className="text-right p-3">إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {isPending && !data ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    جاري التحميل...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    لا يوجد تقييمات حالياً.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-3">{r.id}</td>
                    <td className="p-3 font-medium">{r.product?.name ?? "-"}</td>
                    <td className="p-3 text-slate-600">{r.customer?.full_name ?? "-"}</td>
                    <td className="p-3">{r.rating}</td>
                    <td className="p-3 text-slate-600 line-clamp-2 max-w-[360px]">{r.comment ?? "-"}</td>
                    <td className="p-3 text-slate-600">{r.created_at ?? "-"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEdit(r)}
                        className="mr-2 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => askDelete(r.id)}
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
          صفحة {pagination?.current_page ?? 1} من {pagination?.last_page ?? 1}
        </p>
        <div className="flex gap-2">
          <button disabled={!canPrev} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50" type="button">
            السابق
          </button>
          <button disabled={!canNext} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50" type="button">
            التالي
          </button>
        </div>
      </div>

      {/* Modal */}
      <ReviewFormModal
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
        title="حذف التقييم"
        message="هل أنت متأكد أنك تريد حذف هذا التقييم؟"
        confirmText="حذف"
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}