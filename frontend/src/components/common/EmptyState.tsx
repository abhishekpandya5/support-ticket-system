type EmptyStateProps = {
  title: string;
  message?: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div
      className="rounded-lg border border-slate-200 bg-white px-4 py-12 text-center"
      role="status"
    >
      <p className="text-lg font-medium text-slate-900">{title}</p>
      {message ? (
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      ) : null}
    </div>
  );
}
