import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  action?: ReactNode;
};

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="min-w-0 text-2xl font-semibold break-words text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {action ? (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 [&>*]:w-full [&>*]:sm:w-auto">
          {action}
        </div>
      ) : null}
    </div>
  );
}
