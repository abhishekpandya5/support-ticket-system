import { LoadingSpinner, PageHeader, TextLink } from '../../components/common';
import { CreateTicketForm } from '../../components/ticket';
import { useCreateTicketForm } from '../../hooks/tickets/useCreateTicketForm';
import { ROUTES } from '../../routes/paths';

export default function CreateTicketPage() {
  const {
    form,
    users,
    usersLoading,
    isSubmitting,
    apiError,
    actingAsUser,
    actingAsWarning,
    handleSubmit,
    handleCancel,
  } = useCreateTicketForm();

  return (
    <section>
      <PageHeader
        title="Create Ticket"
        action={<TextLink to={ROUTES.tickets}>Back to Tickets</TextLink>}
      />

      {actingAsUser ? (
        <p className="mb-4 text-sm text-slate-600">
          Creating as:{' '}
          <span className="font-medium text-slate-900">{actingAsUser.name}</span>
        </p>
      ) : null}

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
