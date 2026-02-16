/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Brand } from "../types";
import { slugify } from "../../../shared/utils/slug";

const BACKEND_URL = "http://127.0.0.1:8000";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Brand | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function BrandFormModal({ open, mode, initial, onClose, onSubmit, loading }: Props) {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const existingLogoUrl = useMemo(() => {
    if (!initial?.logo) return "";
    return `${BACKEND_URL}/${initial.logo}`;
  }, [initial?.logo]);

  useEffect(() => {
    if (!open) return;

    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setDescription(initial?.description ?? "");

    setLogoFile(null);
    setPreview("");
  }, [open, initial]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function autoSlug() {
    setSlug(slugify(name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return alert("اسم البراند مطلوب");
    if (!slug.trim()) return alert("Slug مطلوب (Unique)");

    const payload: any = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() ? description.trim() : null,
      logo: logoFile ?? null, // File
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      // لو فيه errors من الباك، سيب المودال مفتوح
    }
  }

  return (
    <Modal open={open} title={isEdit ? "تعديل براند" : "إضافة براند"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Name *</label>
          <input className="mt-1 w-full border rounded-lg p-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-gray-600">Slug *</label>
          <div className="mt-1 flex gap-2">
            <input className="w-full border rounded-lg p-2" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <button type="button" onClick={autoSlug} className="px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm">
              Auto
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            className="mt-1 w-full border rounded-lg p-2 min-h-[90px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Logo (Upload)</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setLogoFile(f);
              if (preview) URL.revokeObjectURL(preview);
              setPreview(f ? URL.createObjectURL(f) : "");
              e.currentTarget.value = "";
            }}
          />

          <div className="mt-2 flex items-center gap-3">
            {preview ? (
              <img src={preview} className="h-16 w-16 rounded-lg object-cover border" alt="preview" />
            ) : existingLogoUrl ? (
              <img src={existingLogoUrl} className="h-16 w-16 rounded-lg object-cover border" alt="current" />
            ) : (
              <div className="h-16 w-16 rounded-lg border bg-slate-50 grid place-items-center text-xs text-slate-400">
                No Logo
              </div>
            )}
            <p className="text-xs text-slate-500">الحد الأقصى 2MB - صيغ صور معروفة.</p>
          </div>
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