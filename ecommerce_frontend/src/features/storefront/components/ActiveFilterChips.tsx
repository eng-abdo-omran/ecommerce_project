import { Button } from "../../../shared/components/ui/Button";

type Chip = {
  key: string;
  label: string;
  onRemove: () => void;
};

export function ActiveFilterChips({
  chips,
  onClearAll,
}: {
  chips: Chip[];
  onClearAll: () => void;
}) {
  if (!chips.length) return null;

  return (
    <div className="relative">
      {/* Gradient edges (nice on mobile) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-gray-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-gray-50 to-transparent" />

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={c.onRemove}
            className="shrink-0 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 transition"
            title="إزالة الفلتر"
          >
            <span className="font-medium whitespace-nowrap">{c.label}</span>
            <span className="text-gray-400">✕</span>
          </button>
        ))}

        <Button variant="secondary" size="sm" onClick={onClearAll} className="shrink-0">
          مسح الكل
        </Button>
      </div>
    </div>
  );
}

/* ضع هذا في index.css مرة واحدة لو عايز اخفاء scrollbar بشكل أنيق
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/