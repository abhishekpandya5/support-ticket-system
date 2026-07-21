import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { ApiError } from '../../api/errors';
import type { UserSummary } from '../../api/types';
import {
  ticketFormSchema,
  type TicketFormValues,
} from '../../schemas/ticketFormSchema';
import { Card } from '../common/Card';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from '../common/FormField';
import {
  AssignedUserField,
  FormActions,
  FormApiError,
  PriorityField,
} from './forms';

const TITLE_ID = 'ticket-title';
const DESCRIPTION_ID = 'ticket-description';
const PRIORITY_ID = 'ticket-priority';
const ASSIGNED_TO_ID = 'ticket-assigned-to';

type TicketFormProps = {
  defaultValues: TicketFormValues;
  users: UserSummary[];
  onSubmit: (values: TicketFormValues) => void;
  isSubmitting?: boolean;
  apiError?: ApiError | null;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  usersLoading?: boolean;
};

export function TicketForm({
  defaultValues,
  users,
  onSubmit,
  isSubmitting = false,
  apiError = null,
  submitLabel = 'Save changes',
  onCancel,
  cancelLabel = 'Cancel',
  usersLoading = false,
}: TicketFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
    values: defaultValues,
  });

  const fieldErrors = apiError?.fieldErrors;
  const isDisabled = isSubmitting || usersLoading;

  return (
    <Card
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <FormField
        label="Title"
        htmlFor={TITLE_ID}
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
          )}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor={DESCRIPTION_ID}
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
          )}
        />
      </FormField>

      <PriorityField
        register={register}
        name="priority"
        fieldId={PRIORITY_ID}
        error={errors.priority?.message ?? fieldErrors?.priority}
        disabled={isDisabled}
      />

      <AssignedUserField
        register={register}
        name="assignedTo"
        fieldId={ASSIGNED_TO_ID}
        users={users}
        error={errors.assignedTo?.message ?? fieldErrors?.assignedTo}
        disabled={isDisabled}
        isLoading={usersLoading}
        label="Assigned To"
        emptyOptionLabel="Unassigned"
      />

      <FormApiError error={apiError} fieldErrors={fieldErrors} />

      <FormActions
        submitLabel={submitLabel}
        pendingLabel="Saving..."
        pendingSpinnerLabel="Saving ticket"
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        onCancel={onCancel}
        cancelLabel={cancelLabel}
      />
    </Card>
  );
}
