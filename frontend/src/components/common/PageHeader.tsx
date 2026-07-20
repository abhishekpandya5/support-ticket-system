import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  action?: ReactNode;
};

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
      {action}
    </div>
  );
}
