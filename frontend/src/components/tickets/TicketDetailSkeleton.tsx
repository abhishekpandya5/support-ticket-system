import { SkeletonContainer, SkeletonLoader } from '../common/SkeletonLoader';

export function TicketDetailSkeleton() {
  return (
    <SkeletonContainer label="Loading ticket details" className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SkeletonLoader className="h-7 w-80 max-w-full" />
          <div className="flex gap-2">
            <SkeletonLoader className="h-6 w-20 rounded-full" />
            <SkeletonLoader className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-48 max-w-full" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <SkeletonLoader className="h-3 w-20" />
            <SkeletonLoader className="mt-2 h-4 w-32" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SkeletonLoader className="h-5 w-24" />
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <SkeletonLoader className="h-4 w-28" />
          <SkeletonLoader className="mt-3 h-4 w-full" />
        </div>
      </div>
    </SkeletonContainer>
  );
}
