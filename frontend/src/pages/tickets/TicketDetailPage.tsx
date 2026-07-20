import { useParams } from 'react-router-dom';

import { Card, ErrorState, PageHeader, TextLink } from '../../components/common';
import {
  CommentForm,
  CommentList,
  StatusActions,
  StatusFeedbackBanner,
  StatusTimeline,
  TicketDetailSkeleton,
  TicketDetailsCard,
  TicketMetadata,
} from '../../components/tickets';
import { useTicket, useTicketStatusWorkflow } from '../../hooks/tickets';
import { ROUTES } from '../../routes/paths';
import { getAllowedTransitionsFromError } from '../../utils/statusErrors';
import { getTicketErrorTitle, isNotFoundError } from '../../utils/ticketErrors';

export default function TicketDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { ticket, comments, allowedTransitions, queryState, refetch } =
    useTicket(id);
  const workflow = useTicketStatusWorkflow(id);

  const transitionsFromError = workflow.error
    ? getAllowedTransitionsFromError(workflow.error)
    : null;
  const availableTransitions =
    transitionsFromError ?? allowedTransitions ?? [];

  return (
    <section className="min-w-0">
      <PageHeader
        title="Ticket Details"
        action={
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {ticket ? (
              <TextLink to={ROUTES.ticketEdit(ticket.id)}>Edit</TextLink>
            ) : null}
            <TextLink to={ROUTES.tickets}>Back to tickets</TextLink>
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
          <Card as="section" aria-labelledby="status-workflow-heading" className="space-y-4">
            <h3
              id="status-workflow-heading"
              className="text-sm font-semibold uppercase tracking-wide text-slate-600"
            >
              Status Workflow
            </h3>
            <StatusTimeline currentStatus={ticket.status} />
            <StatusActions
              allowedTransitions={availableTransitions}
              pendingStatus={workflow.pendingStatus}
              isPending={workflow.isPending}
              onTransition={workflow.changeStatus}
            />
            <StatusFeedbackBanner
              feedback={workflow.feedback}
              onDismiss={workflow.clearFeedback}
            />
          </Card>
          <Card as="section" aria-labelledby="ticket-metadata-heading">
            <h3
              id="ticket-metadata-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600"
            >
              Details
            </h3>
            <TicketMetadata ticket={ticket} />
          </Card>
          <section className="space-y-4" aria-labelledby="comments-heading">
            <h3 id="comments-heading" className="text-lg font-semibold text-slate-900">
              Comments
            </h3>
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
