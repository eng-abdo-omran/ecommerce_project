import { useEffect, useMemo, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Category } from "../types";
import { slugify } from "../../../shared/utils/slug";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Category | null;
  parents?: Category[]; // عشان parent dropdown (اختياري)
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function CategoryFormModal({
  open,
  mode,
  initial,
  parents = [],
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setNote(initial?.note ?? "");
    setCategoryId(initial?.category_id ?? null);
    setImageFile(null);
    setPreviewUrl("");
  }, [open, initial]);

  // parents options: استبعد نفسه لو edit
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const parentOptions = useMemo(() => {
    if (!parents?.length) return [];
    if (!initial?.id) return parents;
    return parents.filter((p) => p.id !== initial.id);
  }, [parents, initial?.id]);

  function handleAutoSlug() {
    setSlug(slugify(name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return alert("اسم القسم مطلوب");
    if (!slug.trim()) return alert("Slug مطلوب (لازم يكون unique)");

    const payload: any = {
      name: name.trim(),
      slug: slug.trim(),
      note: note.trim() ? note.trim() : null,
      category_id: categoryId ?? null,
      image: imageFile, // لو File هيتبعت multipart
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      // سيب المودال مفتوح لو فيه error
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "تعديل قسم" : "إضافة قسم"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: Electronics"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Slug</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full border rounded-lg p-2"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="electronics"
            />
            <button
              type="button"
              onClick={handleAutoSlug}
              className="px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm"
              title="Generate from name"
            >
              Auto
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            لازم يكون unique ويفضل يكون حروف صغيرة وشرطات.
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Parent Category (اختياري)
          </label>
          <select
            className="mt-1 w-full border rounded-lg p-2"
            value={categoryId ?? ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">— None —</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Note (اختياري)</label>
          <textarea
            className="mt-1 w-full border rounded-lg p-2 min-h-[90px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ملاحظة..."
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Image (Upload)</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setImageFile(f);
              setPreviewUrl(f ? URL.createObjectURL(f) : "");
            }}
          />

          {/* Preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              className="mt-2 h-24 w-24 object-cover rounded-lg border"
              alt="preview"
            />
          )}

          {/* Existing image (edit) */}
          {!previewUrl && initial?.image && (
            <p className="text-xs text-gray-500 mt-2">
              Current: {initial.image}
            </p>
          )}
        </div>
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
