import type { ApiError } from '../../../api/errors';

type FormApiErrorProps = {
  error: ApiError | null | undefined;
  fieldErrors?: Record<string, string> | undefined;
};

export function FormApiError({ error, fieldErrors }: FormApiErrorProps) {
  if (!error) {
    return null;
  }

  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    return null;
  }

  return (
    <p className="text-sm text-red-600" role="alert">
      {error.message}
    </p>
  );
}
