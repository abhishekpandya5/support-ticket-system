import type { ReactNode } from 'react';

export const formInputClassName =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50';

export const formLabelClassName = 'block text-sm font-medium text-slate-700';

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
          <span className="text-red-600" aria-hidden="true">
            {' '}
            *
          </span>
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

export function getFieldErrorProps(fieldId: string, error?: string) {
  const errorId = error ? `${fieldId}-error` : undefined;

  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': errorId,
  } as const;
}
