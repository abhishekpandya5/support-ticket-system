import { useNavigate, useParams } from 'react-router-dom';

import { ErrorState, PageHeader, TextLink } from '../../components/common';
import { TicketDetailSkeleton, TicketForm } from '../../components/tickets';
import { useUsers } from '../../hooks/users';
import { useTicket, useUpdateTicket } from '../../hooks/tickets';
import { ROUTES } from '../../routes/paths';
import type { TicketFormValues } from '../../schemas/ticketFormSchema';
import {
  mapTicketToFormValues,
  toUpdateTicketRequest,
} from '../../utils/ticketForm';
import { getTicketErrorTitle, isNotFoundError } from '../../utils/ticketErrors';

export default function EditTicketPage() {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const { ticket, queryState, refetch } = useTicket(id);
  const { data: usersData, isLoading: usersLoading } = useUsers();

  const { mutate, mutationState, isPending } = useUpdateTicket({
    onSuccess: () => {
      navigate(ROUTES.ticketDetail(id));
    },
  });

  const handleSubmit = (values: TicketFormValues) => {
    mutate({
      id,
      body: toUpdateTicketRequest(values),
    });
  };

  return (
    <section className="min-w-0">
      <PageHeader
        title="Edit Ticket"
        action={<TextLink to={ROUTES.ticketDetail(id)}>Cancel</TextLink>}
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
        <TicketForm
          defaultValues={mapTicketToFormValues(ticket)}
          users={usersData?.users ?? []}
          usersLoading={usersLoading}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          apiError={mutationState.error}
          submitLabel="Save changes"
          onCancel={() => navigate(ROUTES.ticketDetail(id))}
        />
      ) : null}
    </section>
  );
}
