export function ListingsGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-muted-foreground/20" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-muted-foreground/20 rounded w-3/4" />
              <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
              <div className="flex justify-between items-baseline">
                <div className="h-5 bg-muted-foreground/20 rounded w-1/4" />
                <div className="h-4 bg-muted-foreground/20 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}