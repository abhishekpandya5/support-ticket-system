import type { UseFormReturn } from 'react-hook-form';

import type { ApiError } from '../../api/errors';
import type { UserSummary } from '../../api/types';
import type { CreateTicketFormValues } from '../../schemas/createTicketFormSchema';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from '../common/FormField';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AssignedUserSelect } from './AssignedUserSelect';
import { PrioritySelect } from './PrioritySelect';

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
  const titleId = 'create-ticket-title';
  const descriptionId = 'create-ticket-description';

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
        htmlFor={titleId}
        required
        error={errors.title?.message ?? fieldErrors?.title}
      >
        <input
          id={titleId}
          type="text"
          disabled={isDisabled}
          className={formInputClassName}
          {...register('title')}
          {...getFieldErrorProps(
            titleId,
            errors.title?.message ?? fieldErrors?.title,
            true,
          )}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor={descriptionId}
        required
        error={errors.description?.message ?? fieldErrors?.description}
      >
        <textarea
          id={descriptionId}
          rows={6}
          disabled={isDisabled}
          className={formInputClassName}
          {...register('description')}
          {...getFieldErrorProps(
            descriptionId,
            errors.description?.message ?? fieldErrors?.description,
            true,
          )}
        />
      </FormField>

      <PrioritySelect
        register={register}
        error={errors.priority?.message ?? fieldErrors?.priority}
        disabled={isDisabled}
      />

      <AssignedUserSelect
        register={register}
        users={users}
        error={errors.assignedTo?.message ?? fieldErrors?.assignedTo}
        disabled={isDisabled}
        isLoading={usersLoading}
      />

      {apiError &&
      (!fieldErrors || Object.keys(fieldErrors).length === 0) ? (
        <p className="text-sm text-red-600" role="alert">
          {apiError.message}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isDisabled}
          aria-busy={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner
                size="sm"
                tone="inverted"
                label="Creating ticket"
                decorative
              />
              Creating...
            </>
          ) : (
            'Create Ticket'
          )}
        </Button>
      </div>
    </Card>
  );
}
