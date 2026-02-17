import { Button } from "./Button";

export function EmptyState({
  title = "لا توجد بيانات",
  description,
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-zinc-100" />
      <div className="text-lg font-semibold text-zinc-900">{title}</div>
      {description ? <div className="mt-2 text-sm text-zinc-600">{description}</div> : null}
      {actionLabel && onAction ? (
        <div className="mt-5 flex justify-center">
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
