/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImagesTab from "../components/ImagesTab";
import { useProduct } from "../hooks/useProduct";
import ProductFormModal from "../components/ProductFormModal";
import { useUpdateProduct } from "../hooks/useProductMutations";
import { useQueryClient } from "@tanstack/react-query";
import VariantsTab from "../components/VariantsTab";

const BACKEND_URL = "http://127.0.0.1:8000";

type TabKey = "overview" | "images" | "variants";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const productId = Number(id);

  const { data, isLoading, isError } = useProduct(productId);
  const product = data?.data; // لأن response: {status,message,data}

  const [tab, setTab] = useState<TabKey>("overview");

  const [editOpen, setEditOpen] = useState(false);

  const updateMut = useUpdateProduct();
  const qc = useQueryClient();

  const mainImageUrl = useMemo(() => {
    if (!product?.images) return "";
    return `${BACKEND_URL}/${product.images}`;
  }, [product?.images]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !product)
    return <div className="p-6 text-red-600">Failed to load product</div>;

  async function handleEditSubmit(payload: any) {
    await updateMut.mutateAsync({ id: productId, payload });

    // اقفل المودال
    setEditOpen(false);

    //  refresh لبيانات صفحة التفاصيل
    await qc.invalidateQueries({
      queryKey: ["products", "details", productId],
    });

    // (اختياري) refresh للّست
    await qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">{product.name}</h1>
          <p className="text-sm text-slate-500">
            SKU: {product.sku ?? "—"} • Price: {product.price} • Qty:{" "}
            {product.quantity ?? "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            Back
          </Link>
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Edit
          </button>{" "}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow p-4 flex gap-4 items-center">
        <div className="h-20 w-20 rounded-xl overflow-hidden border bg-slate-50 grid place-items-center">
          {mainImageUrl ? (
            <img
              src={mainImageUrl}
              className="h-full w-full object-cover"
              alt={product.name}
            />
          ) : (
            <span className="text-xs text-slate-400">No Image</span>
          )}
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-slate-500">Category</div>
            <div className="font-medium">{product.category_id ?? "—"}</div>
          </div>
          <div>
            <div className="text-slate-500">Brand</div>
            <div className="font-medium">{product.brand_id ?? "—"}</div>
          </div>
          <div>
            <div className="text-slate-500">Compare</div>
            <div className="font-medium">{product.compare_price ?? "—"}</div>
          </div>
          <div>
            <div className="text-slate-500">Cost</div>
            <div className="font-medium">{product.cost_price ?? "—"}</div>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow">
        {/* Tabs Header */}
        <div className="px-4 pt-3 border-b border-slate-200 flex gap-2">
          <TabButton
            active={tab === "overview"}
            onClick={() => setTab("overview")}
          >
            Overview
          </TabButton>

          <TabButton active={tab === "images"} onClick={() => setTab("images")}>
            Images
          </TabButton>

          <TabButton
            active={tab === "variants"}
            onClick={() => setTab("variants")}
          >
            Variants
          </TabButton>
        </div>

        {/* Tabs Content */}
        <div className="p-4">
          {tab === "overview" && <OverviewTab product={product} />}
          {/* هنا المكان بالظبط اللي تستدعي فيه ImagesTab */}
          {tab === "images" && (
            <ImagesTab
              productId={productId}
              images={product.product_images ?? []}
              productName={product.name}
              productPrice={product.price}
            />
          )}

          {tab === "variants" && (
            <VariantsTab
              productId={productId}
              variants={product.variants ?? []}
              productName={product.name}
              productPrice={product.price}
            />
          )}{" "}
        </div>
      </div>
      <ProductFormModal
        open={editOpen}
        mode="edit"
        initial={product}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        loading={updateMut.isPending}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm rounded-t-lg transition ${
        active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function OverviewTab({ product }: { product: any }) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <div className="text-slate-500">Description</div>
        <div className="mt-1 text-slate-800">{product.description ?? "—"}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-slate-500">Details</div>
          <div className="mt-1 text-slate-800 whitespace-pre-wrap">
            {product.details ?? "—"}
          </div>
        </div>
        <div>
          <div className="text-slate-500">Features</div>
          <div className="mt-1 text-slate-800 whitespace-pre-wrap">
            {product.features ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

