import { LoadingSpinner } from './LoadingSpinner';

export function RouteFallback() {
  return (
    <div className="flex min-h-32 items-center justify-center">
      <LoadingSpinner label="Loading page" />
    </div>
  );
}
