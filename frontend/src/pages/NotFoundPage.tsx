import { Link } from 'react-router-dom';

import { ROUTES } from '../routes/paths';

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-start gap-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="text-slate-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to={ROUTES.dashboard}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
