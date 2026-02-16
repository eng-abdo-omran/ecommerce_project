import { useEffect, useState } from "react";
import { useUpdateProductImages } from "../hooks/useUpdateProductImages";
import type { GalleryItemPayload } from "../api/products.api";

const BACKEND_URL = "http://127.0.0.1:8000";

// النوع اللي راجع من الباك
type ProductImage = {
  id: number;
  url: string; // path string مثل product_images/xxx.jpg
  alt_text: string | null;
  sort_order: number;
};

type GalleryItem =
  | {
      kind: "existing";
      id: number;
      url: string; // path
      alt_text: string;
      sort_order: number;
    }
  | {
      kind: "new";
      tempId: string;
      file: File;
      preview: string; // object url
      alt_text: string;
      sort_order: number;
    };

function ImagesTab({
  productId,
  images,
  productName,
  productPrice,
}: {
  productId: number;
  images: ProductImage[];
  productName: string;
  productPrice: string | number;
}) {
  const saveMut = useUpdateProductImages(productId);

  //  نحول بيانات الباك لشكل UI
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // عند تحميل المنتج/تغيير الصور من الباك (بعد save/invalidate)
  useEffect(() => {
    // نظّف previews القديمة قبل ما نبدّل
    setGallery((prev) => {
      prev.forEach((it) => {
        if (it.kind === "new") URL.revokeObjectURL(it.preview);
      });
      return [];
    });

    const mapped: GalleryItem[] = (images ?? [])
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img, idx) => ({
        kind: "existing",
        id: img.id,
        url: img.url,
        alt_text: img.alt_text ?? "",
        sort_order: img.sort_order ?? idx,
      }));

    setGallery(mapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, JSON.stringify(images)]);

  // تنظيف previews عند unmount
  useEffect(() => {
    return () => {
      gallery.forEach((it) => {
        if (it.kind === "new") URL.revokeObjectURL(it.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const startOrder = gallery.length;

    const newItems: GalleryItem[] = Array.from(files).map((file, i) => {
      const preview = URL.createObjectURL(file);
      return {
        kind: "new",
        tempId: `${Date.now()}_${i}_${Math.random().toString(16).slice(2)}`,
        file,
        preview,
        alt_text: "",
        sort_order: startOrder + i,
      };
    });

    setGallery((g) => [...g, ...newItems]);
  }

  function removeItem(idx: number) {
    setGallery((g) => {
      const copy = [...g];
      const item = copy[idx];
      if (item?.kind === "new") URL.revokeObjectURL(item.preview);
      copy.splice(idx, 1);

      // reassign sort_order
      return copy.map((it, i) => ({ ...it, sort_order: i }) as GalleryItem);
    });
  }

  function move(idx: number, dir: -1 | 1) {
    setGallery((g) => {
      const next = [...g];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return g;

      const tmp = next[idx];
      next[idx] = next[target];
      next[target] = tmp;

      return next.map((it, i) => ({ ...it, sort_order: i }) as GalleryItem);
    });
  }

  function setAlt(idx: number, val: string) {
    setGallery((g) => {
      const next = [...g];
      const item = next[idx];
      if (!item) return g;
      next[idx] = { ...item, alt_text: val } as GalleryItem;
      return next;
    });
  }

  async function onSave() {
    // build payload: keep current order
    const payload: GalleryItemPayload[] = gallery.map((it, i) => {
      if (it.kind === "new") {
        return {
          file: it.file,
          alt_text: it.alt_text || null,
          sort_order: i,
        };
      }
      return {
        url: it.url,
        alt_text: it.alt_text || null,
        sort_order: i,
      };
    });

    await saveMut.mutateAsync({
      base: { name: productName, price: productPrice },
      items: payload,
    });
    // بعد النجاح react-query هيعمل invalidate ويجيب صور جديدة
  }

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-600">
            Gallery Images:{" "}
            <span className="font-medium">{gallery.length}</span>
            {saveMut.isPending && (
              <span className="ml-2 text-xs text-slate-500">— Saving...</span>
            )}
          </p>
          <p className="text-xs text-slate-500">
           "يمكنك إضافة صور جديدة، حذف صور، أو تغيير الترتيب ثم حفظ"
          </p>
        </div>

        <div className="flex gap-2">
          <label className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm cursor-pointer">
            + Add Images
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.currentTarget.value = "";
              }}
            />
          </label>

          <button
            disabled={saveMut.isPending}
            onClick={onSave}
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm disabled:opacity-60"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Empty */}
      {gallery.length === 0 ? (
        <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border">
          No gallery images yet. Click <b>Add Images</b> to upload.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gallery.map((it, idx) => (
            <div
              key={it.kind === "existing" ? `ex_${it.id}` : `nw_${it.tempId}`}
              className="rounded-2xl border bg-white overflow-hidden shadow-sm"
            >
              <div className="flex">
                {/* image */}
                <div className="w-32 h-32 bg-slate-50 border-r overflow-hidden grid place-items-center">
                  {it.kind === "new" ? (
                    <img
                      src={it.preview}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                  ) : it.url ? (
                    <img
                      src={`${BACKEND_URL}/${it.url}`}
                      className="w-full h-full object-cover"
                      alt={it.alt_text || "image"}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Image</span>
                  )}
                </div>

                {/* controls */}
                <div className="flex-1 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">
                      #{idx + 1}{" "}
                      <span className="text-xs text-slate-500">
                        (order: {it.sort_order})
                      </span>
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => move(idx, -1)}
                        disabled={idx === 0}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(idx, 1)}
                        disabled={idx === gallery.length - 1}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeItem(idx)}
                        className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500">Alt text</label>
                    <input
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      value={it.alt_text}
                      onChange={(e) => setAlt(idx, e.target.value)}
                      placeholder="مثال: Front view"
                    />
                  </div>

                  {it.kind === "existing" && (
                    <p className="text-[11px] text-slate-500 truncate">
                      Path: {it.url}
                    </p>
                  )}

                  {it.kind === "new" && (
                    <p className="text-[11px] text-slate-500 truncate">
                      File: {it.file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error inline */}
      {saveMut.isError && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          حدث خطأ أثناء حفظ الصور. حاول مرة أخرى.
        </div>
      )}
    </div>
  );
}

export default ImagesTab;
