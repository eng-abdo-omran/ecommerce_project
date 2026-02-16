/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { useUsers } from "../hooks/useUsers";
import { useCreateUser, useUpdateUser, useDeleteUser } from "../hooks/useUserMutations";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import UserFormModal from "../components/UserFormModal";
import type { User } from "../types";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useUsers({ page, search: debouncedSearch });

  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const deleteMut = useDeleteUser();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<User | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pagination = data?.data; // UsersListResponse.data
  const users = pagination?.data ?? [];

  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext = (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const header = useMemo(() => {
    const total = pagination?.total ?? 0;
    return `${total} مستخدم`;
  }, [pagination?.total]);

  function openCreate() {
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  }

  function openEdit(u: User) {
    setFormMode("edit");
    setSelected(u);
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

  // Keep header and search input mounted even while data is loading/refetching.

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Users</h1>
          <p className="text-sm text-gray-500">
            {header}
            {isFetching && (
              <span className="ml-2 text-xs text-gray-400">Updating…</span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm w-56"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to first page when typing a new search
            }}
          />
          <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            + New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-sm text-slate-600">Users list</div>
          {isFetching && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FaSpinner className="animate-spin" />
              <span>Updating…</span>
            </div>
          )}
        </div>

        <table className="w-full text-sm table-auto">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              // Skeleton rows while initial loading
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-3">
                    <div className="h-4 bg-slate-200 rounded w-12 animate-pulse" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-slate-200 rounded w-40 animate-pulse" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-slate-200 rounded w-56 animate-pulse" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse" />
                      <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              users.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`border-t transition-colors duration-150 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-slate-100`}
                >
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role === 1 ? "Admin" : "User"}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(u)}
                      className="mr-2 inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      aria-label={`Edit ${u.name}`}
                    >
                      <FaEdit />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => askDelete(u.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      aria-label={`Delete ${u.name}`}
                    >
                      <FaTrash />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}

            {!isLoading && users.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={5}>
                  لا يوجد مستخدمين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          صفحة {pagination?.current_page ?? 1} من {pagination?.last_page ?? 1}
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

      {/* Create/Edit Modal */}
      <UserFormModal
        open={formOpen}
        mode={formMode}
        initial={selected}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={confirmOpen}
        title="حذف المستخدم"
        message="هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
        confirmText="حذف"
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}