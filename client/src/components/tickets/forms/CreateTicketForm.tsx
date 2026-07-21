import type { UseFormReturn } from 'react-hook-form';

import type { ApiError } from '../../../api/errors';
import type { UserSummary } from '../../../api/types';
import type { CreateTicketFormValues } from '../../../schemas/createTicketFormSchema';
import { Card } from '../../common/Card';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from '../../common/FormField';
import { AssignedUserField } from './AssignedUserField';
import { FormActions } from './FormActions';
import { FormApiError } from './FormApiError';
import { PriorityField } from './PriorityField';

type CreateTicketFormProps = {
  form: UseFormReturn<CreateTicketFormValues>;
  users: UserSummary[];
  onSubmit: (values: CreateTicketFormValues) => void;
  isSubmitting?: boolean;
  usersLoading?: boolean;
  apiError?: ApiError | null;
  actingAsWarning?: string | null;
  onCancel?: () => void;
};

const TITLE_ID = 'create-ticket-title';
const DESCRIPTION_ID = 'create-ticket-description';
const PRIORITY_ID = 'create-ticket-priority';
const ASSIGNED_TO_ID = 'create-ticket-assigned-to';

export function CreateTicketForm({
  form,
  users,
  onSubmit,
  isSubmitting = false,
  usersLoading = false,
  apiError = null,
  actingAsWarning = null,
  onCancel,
}: CreateTicketFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const fieldErrors = apiError?.fieldErrors;
  const isDisabled = isSubmitting || usersLoading || Boolean(actingAsWarning);

  return (
    <Card
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-2xl space-y-5"
      noValidate
    >
      {actingAsWarning ? (
        <p
          className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          role="alert"
        >
          {actingAsWarning}
        </p>
      ) : null}

      <FormField
        label="Title"
        htmlFor={TITLE_ID}
        required
        error={errors.title?.message ?? fieldErrors?.title}
      >
        <input
          id={TITLE_ID}
          type="text"
          disabled={isDisabled}
          className={formInputClassName}
          {...register('title')}
          {...getFieldErrorProps(
            TITLE_ID,
            errors.title?.message ?? fieldErrors?.title,
            true,
          )}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor={DESCRIPTION_ID}
        required
        error={errors.description?.message ?? fieldErrors?.description}
      >
        <textarea
          id={DESCRIPTION_ID}
          rows={6}
          disabled={isDisabled}
          className={formInputClassName}
          {...register('description')}
          {...getFieldErrorProps(
            DESCRIPTION_ID,
            errors.description?.message ?? fieldErrors?.description,
            true,
          )}
        />
      </FormField>

      <PriorityField
        register={register}
        name="priority"
        fieldId={PRIORITY_ID}
        error={errors.priority?.message ?? fieldErrors?.priority}
        required
        disabled={isDisabled}
      />

      <AssignedUserField
        register={register}
        name="assignedTo"
        fieldId={ASSIGNED_TO_ID}
        users={users}
        error={errors.assignedTo?.message ?? fieldErrors?.assignedTo}
        required
        disabled={isDisabled}
        isLoading={usersLoading}
        emptyOptionLabel="Select a user"
      />

      <FormApiError error={apiError} fieldErrors={fieldErrors} />

      <FormActions
        submitLabel="Create Ticket"
        pendingLabel="Creating..."
        pendingSpinnerLabel="Creating ticket"
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        onCancel={onCancel}
      />
    </Card>
  );
}
