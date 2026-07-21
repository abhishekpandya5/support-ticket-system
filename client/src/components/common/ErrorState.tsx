import type { ApiError } from '../../api/errors';
import { Button } from './Button';

type ErrorStateProps = {
  error: ApiError;
  onRetry?: () => void;
  title?: string;
};

export function ErrorState({
  error,
  onRetry,
  title = 'Something went wrong',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-red-200 bg-red-50 p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-800">{title}</p>
          <p className="mt-1 break-words text-sm text-red-700">{error.message}</p>
        </div>
        {onRetry ? (
          <Button type="button" variant="danger" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
