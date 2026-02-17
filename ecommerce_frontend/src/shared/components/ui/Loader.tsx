export function Loader({ label = "جاري التحميل..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-zinc-700">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      <span className="text-sm">{label}</span>
    </div>
  );
}