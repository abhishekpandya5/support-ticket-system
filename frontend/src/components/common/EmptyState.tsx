import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  message?: string;
  action?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  title,
  message,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`min-w-0 rounded-lg border border-slate-200 bg-white text-center ${
        compact ? 'px-4 py-8' : 'px-4 py-12'
      }`}
      role="status"
    >
      <p
        className={`font-medium text-slate-900 ${
          compact ? 'text-base' : 'text-lg'
        }`}
      >
        {title}
      </p>
      {message ? (
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
