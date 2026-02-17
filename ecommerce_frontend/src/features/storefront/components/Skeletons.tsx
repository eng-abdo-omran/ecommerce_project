export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl border bg-white p-3 shadow-sm">
      <div className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
      <div className="p-2">
        <div className="mt-3 h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
        <div className="mt-2 h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-9 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-9 rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border bg-white p-4">
          <div className="h-10 w-10 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="mt-3 h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
          <div className="mt-2 h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}