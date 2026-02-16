import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title = "تأكيد",
  message = "هل أنت متأكد؟",
  confirmText = "نعم",
  cancelText = "إلغاء",
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-slate-700">{message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-slate-100 text-slate-800 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {cancelText}
        </button>
        <button
          disabled={loading}
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          {loading ? "..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}
