import React, { useEffect } from "react";

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Center */}
      <div className="absolute inset-0 grid place-items-center p-4">
        {/* Panel */}
        <div
          className="
            w-full max-w-lg bg-white rounded-xl shadow
            max-h-[calc(100vh-2rem)] 
            flex flex-col overflow-hidden
          "
          role="dialog"
          aria-modal="true"
        >
          {/* Header ثابت */}
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <h2 className="font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="px-2 py-1 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body قابل للسكرول */}
          <div className="p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
