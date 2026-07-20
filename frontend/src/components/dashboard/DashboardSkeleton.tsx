function SkeletonBar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <SkeletonBar className="h-4 w-24" />
            <SkeletonBar className="mt-3 h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <SkeletonBar className="h-6 w-36" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <SkeletonBar className="h-4 w-2/3 max-w-md" />
              <SkeletonBar className="mt-3 h-4 w-1/3 max-w-xs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
