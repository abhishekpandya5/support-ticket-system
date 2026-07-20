import { Link } from 'react-router-dom';

import { PageHeader } from '../../components/common';
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
        action={
          <Link
            to={ROUTES.tickets}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
          >
            Back to Tickets
          </Link>
        }
      />

      {actingAsUser ? (
        <p className="mb-4 text-sm text-slate-600">
          Creating as:{' '}
          <span className="font-medium text-slate-900">{actingAsUser.name}</span>
        </p>
      ) : null}

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
    </section>
  );
}
