
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import type { Store } from "../types";

type Props = {
	open: boolean;
	mode: "create" | "edit";
	initial?: Store | null;
	onClose: () => void;
	onSubmit: (payload: any) => Promise<void>;
	loading?: boolean;
};

export default function StoreFormModal({ open, mode, initial, onClose, onSubmit, loading }: Props) {
	const isEdit = mode === "edit";

	const [name, setName] = useState("");
	const [domain, setDomain] = useState("");
	const [techStack, setTechStack] = useState(""); // comma-separated string

	useEffect(() => {
		if (!open) return;

		setName(initial?.name ?? "");
		setDomain(initial?.domain ?? "");
		setTechStack((initial?.tech_stack && initial.tech_stack.length ? initial.tech_stack.join(", ") : "") ?? "");
	}, [open, initial]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!name.trim()) return alert("اسم المتجر مطلوب");
		if (!domain.trim()) return alert("الدومين مطلوب");

		const techArray = techStack
			.split(",")
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		const payload: any = {
			name: name.trim(),
			domain: domain.trim(),
			tech_stack: techArray.length ? techArray : null,
		};

		try {
			await onSubmit(payload);
			onClose();
		} catch {
			// keep modal open on validation errors
		}
	}

	return (
		<Modal open={open} title={isEdit ? "تعديل متجر" : "إضافة متجر"} onClose={onClose}>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div>
					<label className="text-sm text-gray-600">الاسم *</label>
					<input className="mt-1 w-full border rounded-lg p-2" value={name} onChange={(e) => setName(e.target.value)} />
				</div>

				<div>
					<label className="text-sm text-gray-600">الدومين *</label>
					<input className="mt-1 w-full border rounded-lg p-2" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
				</div>

				<div>
					<label className="text-sm text-gray-600">Tech Stack (comma separated)</label>
					<input
						className="mt-1 w-full border rounded-lg p-2"
						value={techStack}
						onChange={(e) => setTechStack(e.target.value)}
						placeholder="React, Node.js, MySQL"
					/>
					<p className="text-xs text-slate-500 mt-1">Separate items with commas. Empty items are ignored.</p>
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
