import type { ReactNode } from 'react';

export const formInputClassName =
  'min-w-0 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50';

export const formLabelClassName = 'block text-sm font-medium text-slate-700';

export const filterLabelClassName =
  'mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  error,
  required = false,
  children,
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div>
      <label htmlFor={htmlFor} className={formLabelClassName}>
        {label}
        {required ? (
          <>
            <span className="text-red-600" aria-hidden="true">
              {' '}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function getFieldErrorProps(
  fieldId: string,
  error?: string,
  required = false,
) {
  const errorId = error ? `${fieldId}-error` : undefined;

  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': errorId,
    'aria-required': required || undefined,
  } as const;
}
