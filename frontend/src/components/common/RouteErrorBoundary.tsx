import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { ApiError } from '../../api/errors';
import { ROUTES } from '../../routes/paths';
import { ButtonLink } from './Button';
import { ErrorState } from './ErrorState';

export function RouteErrorBoundary() {
  const error = useRouteError();
  const message =
    error instanceof Error
      ? error.message
      : isRouteErrorResponse(error)
        ? error.statusText || 'Something went wrong'
        : 'Something went wrong';

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <ErrorState
        error={
          new ApiError(500, {
            code: 'INTERNAL_ERROR',
            message,
          })
        }
        title="Unexpected error"
      />
      <div className="mt-4">
        <ButtonLink to={ROUTES.dashboard}>Go to dashboard</ButtonLink>
      </div>
    </div>
  );
}
