/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Product } from "../types";
import { slugify } from "../../../shared/utils/slug";
import { useCategoriesLite } from "../hooks/useCategoriesLite";
import { useBrandsLite } from "../hooks/useBrandsLite";
import { useSuppliersLite } from "../hooks/useSuppliersLite";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  loading?: boolean;
};

export default function ProductFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const isEdit = mode === "edit";

  const { data: categories = [] } = useCategoriesLite();
  const { data: brands = [] } = useBrandsLite();
  const { data: suppliers = [] } = useSuppliersLite();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [price, setPrice] = useState<string>(""); // required
  const [comparePrice, setComparePrice] = useState<string>("");
  const [costPrice, setCostPrice] = useState<string>("");

  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [features, setFeatures] = useState("");

  const [weight, setWeight] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("");

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [supplierId, setSupplierId] = useState<number | null>(null);

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const MAX_PRICE = 99999999.99;

  function validate(payload: any) {
    const e: Record<string, string> = {};

    if (!payload.name?.trim()) e.name = "اسم المنتج مطلوب";
    const priceNum = Number(payload.price);
    if (!payload.price || Number.isNaN(priceNum))
      e.price = "السعر لازم يكون رقم";
    else if (priceNum < 0) e.price = "السعر لا يمكن أن يكون أقل من 0";
    else if (priceNum > MAX_PRICE)
      e.price = `السعر لا يمكن أن يتعدى ${MAX_PRICE}`;

    const cp =
      payload.compare_price !== null ? Number(payload.compare_price) : null;
    if (payload.compare_price !== null && Number.isNaN(cp as any))
      e.compare_price = "سعر المقارنة لازم يكون رقم";
    else if (cp !== null && cp > MAX_PRICE)
      e.compare_price = `سعر المقارنة لا يمكن أن يتعدى ${MAX_PRICE}`;

    const cost =
      payload.cost_price !== null ? Number(payload.cost_price) : null;
    if (payload.cost_price !== null && Number.isNaN(cost as any))
      e.cost_price = "سعر التكلفة لازم يكون رقم";
    else if (cost !== null && cost > MAX_PRICE)
      e.cost_price = `سعر التكلفة لا يمكن أن يتعدى ${MAX_PRICE}`;

    return e;
  }

  const existingImageUrl = useMemo(() => {
    if (!initial?.images) return "";
    // الصور محفوظة في public/product/xxx.jpg => تتفتح على /product/xxx.jpg
    return `http://127.0.0.1:8000/${initial.images}`;
  }, [initial?.images]);

  useEffect(() => {
    if (!open) return;
    setErrors({});

    setSku(initial?.sku ?? "");
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setPrice(initial?.price ?? "");
    setComparePrice(initial?.compare_price ?? "");
    setCostPrice(initial?.cost_price ?? "");

    setDescription(initial?.description ?? "");
    setDetails(initial?.details ?? "");
    setFeatures(initial?.features ?? "");

    setWeight(initial?.weight?.toString() ?? "");
    setQuantity(initial?.quantity?.toString() ?? "");
    setDimensions(initial?.dimensions ?? "");

    setCategoryId(initial?.category_id ?? null);
    setBrandId(initial?.brand_id ?? null);
    setSupplierId(initial?.supplier_id ?? null);

    setMainImage(null);
    setPreviewUrl("");
  }, [open, initial]);

  function autoSlug() {
    setSlug(slugify(name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    if (!name.trim()) return alert("اسم المنتج مطلوب");
    if (!price.trim()) return alert("سعر المنتج مطلوب");

    const payload: any = {
      sku: sku.trim() ? sku.trim() : null,
      name: name.trim(),
      slug: slug.trim() ? slug.trim() : null,

      price: price,
      compare_price: comparePrice.trim() ? comparePrice : null,
      cost_price: costPrice.trim() ? costPrice : null,

      description: description.trim() ? description.trim() : null,
      details: details.trim() ? details.trim() : null,
      features: features.trim() ? features.trim() : null,

      weight: weight.trim() ? Number(weight) : null,
      quantity: quantity.trim() ? Number(quantity) : null,
      dimensions: dimensions.trim() ? dimensions.trim() : null,

      category_id: categoryId ?? null,
      brand_id: brandId ?? null,
      supplier_id: supplierId ?? null,

      // main image file field name in API = images
      images: mainImage ?? null,
    };

    const v = validate(payload);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    try {
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      // لو الباك رجّع 422 errors
      const data = err?.response?.data;
      if (err?.response?.status === 422 && data?.errors) {
        const mapped: Record<string, string> = {};
        Object.keys(data.errors).forEach((k) => {
          mapped[k] = data.errors[k]?.[0]; // أول رسالة لكل field
        });
        setErrors(mapped);
        return;
      }
      // أي error تاني سيبه للـ toast العام (عندك already)
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "تعديل منتج" : "إضافة منتج"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Name *</label>
            <input
              className={`mt-1 w-full border rounded-lg p-2 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">SKU</label>
            <input
              className={`mt-1 w-full border rounded-lg p-2 ${errors.sku ? "border-red-500 focus:ring-red-500" : ""}`}
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            {errors.sku && (
              <p className="mt-1 text-xs text-red-600">{errors.sku}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Slug</label>
            <div className="mt-1 flex gap-2">
              <input
                className={`mt-1 w-full border rounded-lg p-2 ${errors.slug ? "border-red-500 focus:ring-red-500" : ""}`}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              {errors.slug && (
                <p className="mt-1 text-xs text-red-600">{errors.slug}</p>
              )}
              <button
                type="button"
                onClick={autoSlug}
                className="px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm"
              >
                Auto
              </button>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-600">Price *</label>
            <input
              className={`mt-1 w-full border rounded-lg p-2 ${errors.price ? "border-red-500 focus:ring-red-500" : ""}`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              step={"0.01"}
              min={"0"}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-600">Compare Price</label>
            <input
              className={`mt-1 w-full border rounded-lg p-2 ${errors.compare_price ? "border-red-500 focus:ring-red-500" : ""}`}
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              type="number"
              step={"0.01"}
              min={"0"}
            />
            {errors.compare_price && (
              <p className="mt-1 text-xs text-red-600">
                {errors.compare_price}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-600">Cost Price</label>
            <input
              className={`mt-1 w-full border rounded-lg p-2 ${errors.cost_price ? "border-red-500 focus:ring-red-500" : ""}`}
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              type="number"
              step={"0.01"}
              min={"0"}
            />
            {errors.cost_price && (
              <p className="mt-1 text-xs text-red-600">{errors.cost_price}</p>
            )}
          </div>
        </div>

        {/* Category/Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Category</label>
            <select
              className="mt-1 w-full border rounded-lg p-2"
              value={categoryId ?? ""}
              onChange={(e) =>
                setCategoryId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Brand</label>
            <select
              className="mt-1 w-full border rounded-lg p-2"
              value={brandId ?? ""}
              onChange={(e) =>
                setBrandId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">— None —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Supplier</label>
            <select
              className="mt-1 w-full border rounded-lg p-2"
              value={supplierId ?? ""}
              onChange={(e) =>
                setSupplierId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">— None —</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                  {s.phone ? ` — ${s.phone}` : ""}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-600">Quantity</label>
            <input
              className="mt-1 w-full border rounded-lg p-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              step={"1"}
              min={"0"}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Weight</label>
            <input
              className="mt-1 w-full border rounded-lg p-2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              type="number"
              step={"0.01"}
              min={"0"}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Dimensions</label>
            <input
              className="mt-1 w-full border rounded-lg p-2"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="مثال: 10x20x30"
            />
          </div>
        </div>

        {/* Text Areas */}
        <div>
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            className="mt-1 w-full border rounded-lg p-2 min-h-[90px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Details</label>
          <textarea
            className="mt-1 w-full border rounded-lg p-2 min-h-[90px]"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Features</label>
          <textarea
            className="mt-1 w-full border rounded-lg p-2 min-h-[90px]"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="text-sm text-gray-600">Main Image (Upload)</label>
          <input
            className="mt-1 w-full border rounded-lg p-2"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setMainImage(f);
              setPreviewUrl(f ? URL.createObjectURL(f) : "");
            }}
          />

          <div className="mt-2 flex items-center gap-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                className="h-16 w-16 rounded-lg object-cover border"
                alt="preview"
              />
            ) : existingImageUrl ? (
              <img
                src={existingImageUrl}
                className="h-16 w-16 rounded-lg object-cover border"
                alt="current"
              />
            ) : (
              <div className="h-16 w-16 rounded-lg border bg-slate-50 grid place-items-center text-xs text-slate-400">
                No Image
              </div>
            )}
            <p className="text-xs text-slate-500">
              Allowed: jpeg/png/jpg/gif/svg — Max 2MB
            </p>
          </div>
        </div>

        {/* Actions */}
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
