import { Link, useParams } from 'react-router-dom';

import { ErrorState, PageHeader } from '../../components/common';
import {
  CommentForm,
  CommentList,
  TicketDetailSkeleton,
  TicketDetailsCard,
  TicketMetadata,
} from '../../components/tickets';
import { useTicket } from '../../hooks/tickets';
import { ROUTES } from '../../routes/paths';
import { getTicketErrorTitle, isNotFoundError } from '../../utils/ticketErrors';

export default function TicketDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { ticket, comments, queryState, refetch } = useTicket(id);

  return (
    <section>
      <PageHeader
        title="Ticket Details"
        action={
          <div className="flex items-center gap-4">
            {ticket ? (
              <Link
                to={ROUTES.ticketEdit(ticket.id)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
              >
                Edit
              </Link>
            ) : null}
            <Link
              to={ROUTES.tickets}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
            >
              Back to tickets
            </Link>
          </div>
        }
      />

      {queryState.isLoading ? <TicketDetailSkeleton /> : null}

      {queryState.error ? (
        <ErrorState
          error={queryState.error}
          title={getTicketErrorTitle(queryState.error)}
          onRetry={
            isNotFoundError(queryState.error) ? undefined : () => refetch()
          }
        />
      ) : null}

      {!queryState.isLoading && !queryState.error && ticket ? (
        <div className="space-y-6">
          <TicketDetailsCard ticket={ticket} />
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Details
            </h3>
            <TicketMetadata ticket={ticket} />
          </section>
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Comments</h3>
            <CommentForm
              ticketId={ticket.id}
              createdById={ticket.createdBy.id}
            />
            <CommentList comments={comments ?? []} />
          </section>
        </div>
      ) : null}
    </section>
  );
}
