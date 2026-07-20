const SKELETON_ROWS = 5;

const COLUMNS = ['Title', 'Priority', 'Status', 'Assigned To', 'Created'] as const;

const headerCellClass =
  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600';
const bodyCellClass = 'px-4 py-3';

function SkeletonBar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

export function TicketTableSkeleton() {
  return (
    <div
      className="overflow-x-auto rounded-lg border border-slate-200 bg-white"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading tickets"
    >
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} className={headerCellClass}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <tr key={index}>
              <td className={bodyCellClass}>
                <SkeletonBar className="h-4 w-48 max-w-full" />
              </td>
              <td className={bodyCellClass}>
                <SkeletonBar className="h-6 w-16 rounded-full" />
              </td>
              <td className={bodyCellClass}>
                <SkeletonBar className="h-6 w-24 rounded-full" />
              </td>
              <td className={bodyCellClass}>
                <SkeletonBar className="h-4 w-32 max-w-full" />
              </td>
              <td className={bodyCellClass}>
                <SkeletonBar className="h-4 w-36 max-w-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
