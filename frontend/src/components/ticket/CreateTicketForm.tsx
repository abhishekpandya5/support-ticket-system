import type { UseFormReturn } from 'react-hook-form';

import type { ApiError } from '../../api/errors';
import type { UserSummary } from '../../api/types';
import type { CreateTicketFormValues } from '../../schemas/createTicketFormSchema';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AssignedUserSelect } from './AssignedUserSelect';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from './FormField';
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
      noValidate
    >
      {actingAsWarning ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
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

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isDisabled}
          aria-busy={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" tone="inverted" label="Creating ticket" />
              Creating...
            </>
          ) : (
            'Create Ticket'
          )}
        </button>
      </div>
    </form>
  );
}
