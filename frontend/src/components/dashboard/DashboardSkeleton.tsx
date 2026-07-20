import { Card } from '../common/Card';
import { SkeletonContainer, SkeletonLoader } from '../common/SkeletonLoader';

export function DashboardSkeleton() {
  return (
    <SkeletonContainer label="Loading dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Card key={index} padding="sm">
            <SkeletonLoader className="h-4 w-24" />
            <SkeletonLoader className="mt-3 h-8 w-16" />
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <SkeletonLoader className="h-6 w-36" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={index} padding="sm">
              <SkeletonLoader className="h-4 w-2/3 max-w-md" />
              <SkeletonLoader className="mt-3 h-4 w-1/3 max-w-xs" />
            </Card>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}
