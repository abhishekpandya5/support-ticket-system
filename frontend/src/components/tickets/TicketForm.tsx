import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import type { ApiError } from '../../api/errors';
import type { TicketPriority, UserSummary } from '../../api/types';
import {
  ticketFormSchema,
  type TicketFormValues,
} from '../../schemas/ticketFormSchema';
import { formatTicketPriority } from '../../utils/ticketDisplay';

const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'critical'];

const inputClassName =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50';

const labelClassName = 'block text-sm font-medium text-slate-700';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
};

function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
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
          className={inputClassName}
          {...register('title')}
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
          className={inputClassName}
          {...register('description')}
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
          className={inputClassName}
          {...register('priority')}
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
          className={inputClassName}
          {...register('assignedTo')}
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
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isDisabled}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
