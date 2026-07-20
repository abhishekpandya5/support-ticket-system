import type { UseFormRegister } from 'react-hook-form';

import type { UserSummary } from '../../api/types';
import type { CreateTicketFormValues } from '../../schemas/createTicketFormSchema';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from '../common/FormField';

type AssignedUserSelectProps = {
  register: UseFormRegister<CreateTicketFormValues>;
  users: UserSummary[];
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
};

export function AssignedUserSelect({
  register,
  users,
  error,
  disabled = false,
  isLoading = false,
}: AssignedUserSelectProps) {
  const fieldId = 'create-ticket-assigned-to';
  const isDisabled = disabled || isLoading;

  return (
    <FormField
      label="Assigned User"
      htmlFor={fieldId}
      required
      error={error}
    >
      <select
        id={fieldId}
        disabled={isDisabled}
        className={formInputClassName}
        {...register('assignedTo')}
        {...getFieldErrorProps(fieldId, error, true)}
        aria-busy={isLoading}
      >
        <option value="">
          {isLoading ? 'Loading users...' : 'Select a user'}
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}
