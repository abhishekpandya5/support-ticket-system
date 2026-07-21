import { LoadingSpinner, PageHeader, TextLink } from '../../components/common';
import { CreateTicketForm } from '../../components/tickets';
import { useCreateTicketForm } from '../../hooks/tickets';
import { ROUTES } from '../../routes/paths';

export default function CreateTicketPage() {
  const {
    form,
    users,
    usersLoading,
    isSubmitting,
    apiError,
    actingAsWarning,
    handleSubmit,
    handleCancel,
  } = useCreateTicketForm();

  return (
    <section className="min-w-0">
      <PageHeader
        title="Create Ticket"
        action={<TextLink to={ROUTES.tickets}>Back to Tickets</TextLink>}
      />

      {usersLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner label="Loading users" />
        </div>
      ) : (
        <CreateTicketForm
          form={form}
          users={users}
          usersLoading={usersLoading}
          isSubmitting={isSubmitting}
          apiError={apiError}
          actingAsWarning={actingAsWarning}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </section>
  );
}
