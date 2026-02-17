import { Button } from "./Button";

export function Pagination({
  page,
  lastPage,
  onPageChange,
}: {
  page: number;
  lastPage: number;
  onPageChange: (p: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < lastPage;

  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="secondary" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
        السابق
      </Button>

      <div className="text-sm text-zinc-700">
        صفحة <span className="font-semibold text-zinc-900">{page}</span> من{" "}
        <span className="font-semibold text-zinc-900">{lastPage}</span>
      </div>

      <Button variant="secondary" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
        التالي
      </Button>
    </div>
  );
}