import type { ReactNode } from 'react';

export const tableHeaderCellClass =
  'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-4 sm:py-3';

export const tableBodyCellClass =
  'px-3 py-2 text-sm text-slate-700 sm:px-4 sm:py-3';

type TableProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className = '' }: TableProps) {
  return (
    <div
      className={`max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-slate-200 bg-white ${className}`.trim()}
    >
      <table className="min-w-full divide-y divide-slate-200">{children}</table>
    </div>
  );
}

type TableSectionProps = {
  children: ReactNode;
};

export function TableHeader({ children }: TableSectionProps) {
  return <thead className="bg-slate-50">{children}</thead>;
}

export function TableBody({ children }: TableSectionProps) {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>;
}

type TableRowProps = {
  children: ReactNode;
  className?: string;
};

export function TableRow({ children, className = '' }: TableRowProps) {
  return <tr className={className}>{children}</tr>;
}

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

export function TableHead({ children, className = '' }: TableCellProps) {
  return (
    <th className={`${tableHeaderCellClass} ${className}`.trim()}>{children}</th>
  );
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return (
    <td className={`${tableBodyCellClass} ${className}`.trim()}>{children}</td>
  );
}
