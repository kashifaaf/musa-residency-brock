export function HomesListSkeleton() {
  return (
    <div>
      <div className="mb-6 h-6 w-32 animate-pulse rounded bg-gray-200" />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white">
            <div className="aspect-[4/3] animate-pulse bg-gray-200" />
            <div className="p-4">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex gap-4">
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}