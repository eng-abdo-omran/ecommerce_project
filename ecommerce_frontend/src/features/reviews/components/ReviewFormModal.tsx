
	/* eslint-disable react-hooks/set-state-in-effect */
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { useEffect, useState } from "react";
	import Modal from "../../../shared/components/ui/Modal";
	import type { Review, ProductLite, CustomerLite } from "../types";
	import { useProductsLite } from "../hooks/useProductsLite";
	import { useCustomersLite } from "../hooks/useCustomersLite";

	type Props = {
		open: boolean;
		mode: "create" | "edit";
		initial?: Review | null;
		onClose: () => void;
		onSubmit: (payload: any) => Promise<void>;
		loading?: boolean;
	};

	export default function ReviewFormModal({ open, mode, initial, onClose, onSubmit, loading }: Props) {
		const isEdit = mode === "edit";
		const { data: products = [] } = useProductsLite();
		const { data: customers = [] } = useCustomersLite();

		const [productId, setProductId] = useState<number | "">("");
		const [customerId, setCustomerId] = useState<number | "">("");
		const [rating, setRating] = useState<number | "">("");
		const [comment, setComment] = useState<string>("");

		useEffect(() => {
			if (!open) return;

			setProductId(initial?.product_id ?? "");
			setCustomerId(initial?.customer_id ?? "");
			setRating(initial?.rating ?? "");
			setComment(initial?.comment ?? "");
		}, [open, initial]);

		async function handleSubmit(e: React.FormEvent) {
			e.preventDefault();

			if (productId === "" || productId === null) return alert("المنتج مطلوب");
			if (customerId === "" || customerId === null) return alert("العميل مطلوب");
			if (rating === "" || rating === null) return alert("التقييم مطلوب");

			const ratingNum = Number(rating);
			if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) return alert("قيمة التقييم يجب أن تكون بين 1 و 5");

			const payload: any = {
				product_id: Number(productId),
				customer_id: Number(customerId),
				rating: ratingNum,
				comment: comment.trim() ? comment.trim() : null,
			};

			try {
				await onSubmit(payload);
				onClose();
			} catch {
				// keep modal open on validation errors
			}
		}

		return (
			<Modal open={open} title={isEdit ? "تعديل تقييم" : "إضافة تقييم"} onClose={onClose}>
				<form onSubmit={handleSubmit} className="space-y-3">
					<div>
						<label className="text-sm text-gray-600">المنتج *</label>
						<select className="mt-1 w-full border rounded-lg p-2" value={productId} onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : "")}>
							<option value="">— اختر منتج —</option>
							{products.map((p: ProductLite) => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="text-sm text-gray-600">العميل *</label>
						<select className="mt-1 w-full border rounded-lg p-2" value={customerId} onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : "")}>
							<option value="">— اختر عميل —</option>
							{customers.map((c: CustomerLite) => (
								<option key={c.id} value={c.id}>
									{c.full_name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="text-sm text-gray-600">التقييم *</label>
						<select className="mt-1 w-full border rounded-lg p-2" value={rating} onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}>
							<option value="">— اختر تقييم —</option>
							<option value={1}>1</option>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={4}>4</option>
							<option value={5}>5</option>
						</select>
					</div>

					<div>
						<label className="text-sm text-gray-600">التعليق (اختياري)</label>
						<textarea className="mt-1 w-full border rounded-lg p-2 min-h-[90px]" value={comment} onChange={(e) => setComment(e.target.value)} />
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
