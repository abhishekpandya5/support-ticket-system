export function TicketDetailSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading ticket details"
    >
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="h-7 w-80 max-w-full animate-pulse rounded bg-slate-200" />
          <div className="flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-48 max-w-full animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
