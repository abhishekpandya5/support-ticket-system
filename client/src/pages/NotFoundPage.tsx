import { ButtonLink, EmptyState } from '../components/common';
import { ROUTES } from '../routes/paths';

export default function NotFoundPage() {
  return (
    <section className="py-12">
      <EmptyState
        title="Page not found"
        message="The page you are looking for does not exist or has been moved."
        action={
          <ButtonLink to={ROUTES.dashboard}>Back to dashboard</ButtonLink>
        }
      />
    </section>
  );
}
