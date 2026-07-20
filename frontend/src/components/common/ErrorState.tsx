import type { ApiError } from '../../api/errors';

type ErrorStateProps = {
  error: ApiError;
  onRetry?: () => void;
  title?: string;
};

export function ErrorState({
  error,
  onRetry,
  title = 'Unable to load tickets',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-800">{title}</p>
          <p className="mt-1 text-sm text-red-700">{error.message}</p>
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}
