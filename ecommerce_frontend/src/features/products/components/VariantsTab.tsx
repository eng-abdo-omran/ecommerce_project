/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useUpdateProductVariants } from "../hooks/useUpdateProductVariants";
import type { VariantPayload } from "../api/products.api";

type BackendVariantValue = {
  id?: number;
  value: string;
  color_name?: string | null;
  image_name?: string | null;
};

type BackendVariant = {
  id?: number;
  name: string;
  type: number; // 0 fixed / 1 percentage
  values?: BackendVariantValue[];
};

type VariantMode = "option" | "pricing";

type VariantState = {
  key: string;
  name: string;
  mode: VariantMode; //  option | pricing
  type: number; //  0 fixed / 1 percentage (used mainly for pricing)
  values: {
    key: string;
    value: string;
    color_name: string;
    image_name: string;
  }[];
};

function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function detectMode(v: BackendVariant): VariantMode {
  const values = v.values ?? [];

  // لو فيه metadata (color/image) => غالبًا Option
  const hasSwatch = values.some(
    (x) => (x.color_name ?? "").trim() || (x.image_name ?? "").trim(),
  );
  if (hasSwatch) return "option";

  // لو كل القيم أرقام => غالبًا Pricing
  const allNumeric =
    values.length > 0 &&
    values.every((x) => !Number.isNaN(Number(String(x.value).trim())));
  if (allNumeric) return "pricing";

  // default
  return "option";
}

export default function VariantsTab({
  productId,
  variants,
  productName,
  productPrice,
}: {
  productId: number;
  variants: BackendVariant[];
  productName: string;
  productPrice: string | number;
}) {
  const saveMut = useUpdateProductVariants(productId);
  const [items, setItems] = useState<VariantState[]>([]);
  const [formError, setFormError] = useState<string>("");

  // type options (DB comment: 0 fixed / 1 percentage)
  const typeOptions = useMemo(
    () => [
      { value: 0, label: "Fixed Amount" },
      { value: 1, label: "Percentage (%)" },
    ],
    [],
  );

  // map backend -> UI state
  useEffect(() => {
    const mapped: VariantState[] = (variants ?? []).map((v) => {
      const mode = detectMode(v);
      const lockedType = mode === "option" ? 0 : Number(v.type ?? 0);

      return {
        key: uid("v"),
        name: v.name ?? "",
        mode,
        type: lockedType,
        values: (v.values ?? []).map((val) => ({
          key: uid("val"),
          value: val.value ?? "",
          color_name: val.color_name ?? "",
          image_name: val.image_name ?? "",
        })),
      };
    });

    setItems(mapped);
    setFormError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, JSON.stringify(variants)]);

  function addVariant() {
    setItems((prev) => [
      ...prev,
      {
        key: uid("v"),
        name: "",
        mode: "option",
        type: 0, // locked for option
        values: [],
      },
    ]);
  }

  function removeVariant(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateVariant(idx: number, patch: Partial<VariantState>) {
    setItems((prev) => {
      const next = [...prev];
      const current = next[idx];
      if (!current) return prev;

      const merged = { ...current, ...patch };

      // لو mode = option اقفل type على 0
      if (merged.mode === "option") merged.type = 0;

      next[idx] = merged;
      return next;
    });
  }

  function addValue(variantIdx: number) {
    setItems((prev) =>
      prev.map((variant, i) => {
        if (i !== variantIdx) return variant;

        return {
          ...variant,
          values: [
            ...variant.values,
            { key: uid("val"), value: "", color_name: "", image_name: "" },
          ],
        };
      }),
    );
  }

  function removeValue(variantIdx: number, valueIdx: number) {
    setItems((prev) => {
      const next = [...prev];
      const v = next[variantIdx];
      if (!v) return prev;

      v.values = v.values.filter((_, i) => i !== valueIdx);
      next[variantIdx] = { ...v };
      return next;
    });
  }

  function updateValue(
    variantIdx: number,
    valueIdx: number,
    patch: Partial<VariantState["values"][number]>,
  ) {
    setItems((prev) => {
      const next = [...prev];
      const v = next[variantIdx];
      if (!v) return prev;

      const values = [...v.values];
      values[valueIdx] = { ...values[valueIdx], ...patch };
      next[variantIdx] = { ...v, values };
      return next;
    });
  }

  function validateBeforeSave() {
    for (let i = 0; i < items.length; i++) {
      const v = items[i];

      if (!v.name.trim()) return `Variant #${i + 1}: الاسم مطلوب`;

      // type only meaningful in pricing
      if (v.mode === "pricing" && v.type !== 0 && v.type !== 1) {
        return `Variant #${i + 1}: النوع غير صحيح`;
      }

      for (let j = 0; j < v.values.length; j++) {
        const raw = v.values[j].value?.trim();
        if (!raw) return `Variant #${i + 1} - Value #${j + 1}: القيمة مطلوبة`;

        if (v.mode === "pricing") {
          const num = Number(raw);
          if (Number.isNaN(num)) {
            return `Variant #${i + 1} - Value #${j + 1}: لازم تكون رقم`;
          }
          if (num < 0) {
            return `Variant #${i + 1} - Value #${j + 1}: لا يمكن أن تكون أقل من 0`;
          }
          if (v.type === 1 && num > 100) {
            return `Variant #${i + 1} - Value #${j + 1}: النسبة لازم تكون بين 0 و 100`;
          }
        }
      }
    }
    return "";
  }

  async function onSave() {
    setFormError("");

    const err = validateBeforeSave();
    if (err) {
      setFormError(err);
      return;
    }

    const payload: VariantPayload[] = items.map((v) => ({
      name: v.name.trim(),
      //  option => lock type = 0
      type: v.mode === "pricing" ? Number(v.type) : 0,
      values:
        v.values.length > 0
          ? v.values.map((val) => ({
              value: val.value.trim(),
              // metadata only meaningful for option mode
              color_name:
                v.mode === "option" && val.color_name.trim()
                  ? val.color_name.trim()
                  : null,
              image_name:
                v.mode === "option" && val.image_name.trim()
                  ? val.image_name.trim()
                  : null,
            }))
          : undefined,
    }));

    await saveMut.mutateAsync({
      base: { name: productName, price: productPrice },
      variants: payload,
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-600">
            Variants: <span className="font-medium">{items.length}</span>
            {saveMut.isPending && (
              <span className="ml-2 text-xs text-slate-500">— Saving...</span>
            )}
          </p>
          <p className="text-xs text-slate-500">
            "أضف خيارات مثل اللون/المقاس أو خصم/زيادة بالسعر بقيمة ثابتة أو نسبة
            مئوية"
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={addVariant}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm"
          >
            + Add Variant
          </button>

          <button
            disabled={saveMut.isPending}
            onClick={onSave}
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm disabled:opacity-60"
          >
            Save Changes
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          {formError}
        </div>
      )}

      {/* Empty */}
      {items.length === 0 ? (
        <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border">
          No variants yet. Click <b>Add Variant</b>.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((v, idx) => (
            <div
              key={v.key}
              className="rounded-2xl border bg-white shadow-sm overflow-hidden"
            >
              {/* Variant header */}
              <div className="p-3 border-b bg-slate-50">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Name */}
                    <div>
                      <label className="text-xs text-slate-500">
                        Variant Name
                      </label>
                      <input
                        className="mt-1 w-full border rounded-lg p-2 text-sm"
                        value={v.name}
                        onChange={(e) =>
                          updateVariant(idx, { name: e.target.value })
                        }
                        placeholder="مثال: Color أو Size أو Discount"
                      />
                    </div>

                    {/* Mode */}
                    <div>
                      <label className="text-xs text-slate-500">Mode</label>
                      <select
                        className="mt-1 w-full border rounded-lg p-2 text-sm"
                        value={v.mode}
                        onChange={(e) => {
                          const nextMode = e.target.value as VariantMode;
                          updateVariant(idx, {
                            mode: nextMode,
                            type: nextMode === "option" ? 0 : v.type,
                          });
                        }}
                      >
                        <option value="option">Option (Color/Size)</option>
                        <option value="pricing">Price Modifier</option>
                      </select>
                    </div>

                    {/* Type (only for pricing) */}
                    <div>
                      <label className="text-xs text-slate-500">Type</label>
                      {v.mode === "pricing" ? (
                        <select
                          className="mt-1 w-full border rounded-lg p-2 text-sm"
                          value={v.type}
                          onChange={(e) =>
                            updateVariant(idx, { type: Number(e.target.value) })
                          }
                        >
                          {typeOptions.map((op) => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="mt-2 text-xs text-slate-500">
                          Locked to <b>Fixed</b> for options
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => addValue(idx)}
                      className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm"
                    >
                      + Add Value
                    </button>

                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                      Delete Variant
                    </button>
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="p-3 space-y-2">
                {v.values.length === 0 ? (
                  <div className="text-sm text-slate-500">
                    No values. Click <b>Add Value</b>.
                  </div>
                ) : (
                  v.values.map((val, j) => (
                    <div
                      key={val.key}
                      className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start"
                    >
                      {/* VALUE */}
                      <div className="md:col-span-2">
                        <label className="text-xs text-slate-500">
                          {v.mode === "pricing"
                            ? "Amount/Percent *"
                            : "Label *"}
                        </label>

                        {v.mode === "pricing" ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={v.type === 1 ? 100 : undefined}
                            className="mt-1 w-full border rounded-lg p-2 text-sm"
                            value={val.value}
                            onChange={(e) =>
                              updateValue(idx, j, { value: e.target.value })
                            }
                            placeholder={
                              v.type === 1
                                ? "مثال: 10 (يعني 10%)"
                                : "مثال: 50 (قيمة ثابتة)"
                            }
                          />
                        ) : (
                          <input
                            className="mt-1 w-full border rounded-lg p-2 text-sm"
                            value={val.value}
                            onChange={(e) =>
                              updateValue(idx, j, { value: e.target.value })
                            }
                            placeholder="مثال: Red / Blue / XL"
                          />
                        )}
                      </div>

                      {/* COLOR (only option) */}
                      <div>
                        <label className="text-xs text-slate-500">
                          Color Name (optional)
                        </label>
                        <input
                          disabled={v.mode !== "option"}
                          className={`mt-1 w-full border rounded-lg p-2 text-sm ${
                            v.mode !== "option"
                              ? "bg-slate-50 text-slate-400"
                              : ""
                          }`}
                          value={val.color_name}
                          onChange={(e) =>
                            updateValue(idx, j, { color_name: e.target.value })
                          }
                          placeholder="#ff0000 أو Red"
                        />
                      </div>

                      {/* IMAGE NAME + REMOVE */}
                      <div>
                        <label className="text-xs text-slate-500">
                          Image Name (optional)
                        </label>
                        <div className="mt-1 flex gap-2">
                          <input
                            disabled={v.mode !== "option"}
                            className={`w-full border rounded-lg p-2 text-sm ${
                              v.mode !== "option"
                                ? "bg-slate-50 text-slate-400"
                                : ""
                            }`}
                            value={val.image_name}
                            onChange={(e) =>
                              updateValue(idx, j, {
                                image_name: e.target.value,
                              })
                            }
                            placeholder="swatch.png"
                          />

                          <button
                            onClick={() => removeValue(idx, j)}
                            className="px-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm"
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {saveMut.isError && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          حدث خطأ أثناء حفظ الفاريانت. حاول مرة أخرى.
        </div>
      )}
    </div>
  );
}
