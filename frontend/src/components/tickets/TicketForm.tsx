import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { ApiError } from '../../api/errors';
import type { TicketPriority, UserSummary } from '../../api/types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from '../common/FormField';
import { LoadingSpinner } from '../common/LoadingSpinner';
import {
  ticketFormSchema,
  type TicketFormValues,
} from '../../schemas/ticketFormSchema';
import { formatTicketPriority } from '../../utils/ticketDisplay';

const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'critical'];

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
        htmlFor="ticket-title"
        error={errors.title?.message ?? fieldErrors?.title}
      >
        <input
          id="ticket-title"
          type="text"
          disabled={isDisabled}
          className={formInputClassName}
          {...register('title')}
          {...getFieldErrorProps(
            'ticket-title',
            errors.title?.message ?? fieldErrors?.title,
          )}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="ticket-description"
        error={errors.description?.message ?? fieldErrors?.description}
      >
        <textarea
          id="ticket-description"
          rows={6}
          disabled={isDisabled}
          className={formInputClassName}
          {...register('description')}
          {...getFieldErrorProps(
            'ticket-description',
            errors.description?.message ?? fieldErrors?.description,
          )}
        />
      </FormField>

      <FormField
        label="Priority"
        htmlFor="ticket-priority"
        error={errors.priority?.message ?? fieldErrors?.priority}
      >
        <select
          id="ticket-priority"
          disabled={isDisabled}
          className={formInputClassName}
          {...register('priority')}
          {...getFieldErrorProps(
            'ticket-priority',
            errors.priority?.message ?? fieldErrors?.priority,
          )}
        >
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {formatTicketPriority(priority)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Assigned To"
        htmlFor="ticket-assigned-to"
        error={errors.assignedTo?.message ?? fieldErrors?.assignedTo}
      >
        <select
          id="ticket-assigned-to"
          disabled={isDisabled}
          className={formInputClassName}
          {...register('assignedTo')}
          {...getFieldErrorProps(
            'ticket-assigned-to',
            errors.assignedTo?.message ?? fieldErrors?.assignedTo,
          )}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </FormField>

      {apiError &&
      (!fieldErrors || Object.keys(fieldErrors).length === 0) ? (
        <p className="text-sm text-red-600" role="alert">
          {apiError.message}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        {onCancel ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isDisabled}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" tone="inverted" label="Saving ticket" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </Card>
  );
}
