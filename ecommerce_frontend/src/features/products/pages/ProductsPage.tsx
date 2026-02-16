/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import ProductFormModal from "../components/ProductFormModal";
import { useProducts } from "../hooks/useProducts";
import { useCreateProduct, useDeleteProduct } from "../hooks/useProductMutations";
import type { Product } from "../types";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isPending, isFetching } = useProducts({
    page,
    search: debouncedSearch,
    perPage: 10,
  });

  const createMut = useCreateProduct();
  const deleteMut = useDeleteProduct();

  // ✅ Create Modal فقط
  const [formOpen, setFormOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pagination = data?.data;
  const products: Product[] = pagination?.data ?? [];

  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext = (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const header = useMemo(
    () => `${pagination?.total ?? 0} Products`,
    [pagination?.total]
  );

  function openCreate() {
    setFormOpen(true);
  }

  function askDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  async function handleSubmit(payload: any) {
    // ✅ Create فقط
    await createMut.mutateAsync(payload);
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
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            {header} {isFetching && "— تحديث..."}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm w-64"
            placeholder="Search by name or sku"
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
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">SKU</th>
                <th className="text-left p-3">Price</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-3">{p.id}</td>

                    <td className="p-3">
                      {p.images ? (
                        <img
                          src={`${BACKEND_URL}/${p.images}`}
                          className="h-10 w-10 rounded object-cover border"
                          alt={p.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded border bg-slate-50 grid place-items-center text-[10px] text-slate-400">
                          —
                        </div>
                      )}
                    </td>

                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-slate-600">{p.sku ?? "—"}</td>
                    <td className="p-3 text-slate-700">{p.price}</td>

                    <td className="p-3 text-right">
                      {/* ✅ Details */}
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="mr-2 px-3 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        Details
                      </Link>

                      {/* ✅ Delete */}
                      <button
                        onClick={() => askDelete(p.id)}
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

      {/* Modal (Create فقط) */}
      <ProductFormModal
        open={formOpen}
        mode="create"
        initial={null}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="حذف المنتج"
        message="هل أنت متأكد أنك تريد حذف هذا المنتج؟"
        confirmText="حذف"
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}