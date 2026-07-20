import { Link } from 'react-router-dom';

import { EmptyState } from '../components/common';
import { ROUTES } from '../routes/paths';

export default function NotFoundPage() {
  return (
    <section className="py-12">
      <EmptyState
        title="Page not found"
        message="The page you are looking for does not exist or has been moved."
        action={
          <Link
            to={ROUTES.dashboard}
            className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Back to dashboard
          </Link>
        }
      />
    </section>
  );
}
