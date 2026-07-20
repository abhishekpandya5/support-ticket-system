import type { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';

import type { UserSummary } from '../../../api/types';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from '../../common/FormField';

type AssignedUserFieldProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: FieldPath<T>;
  fieldId: string;
  users: UserSummary[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  label?: string;
  emptyOptionLabel: string;
  loadingOptionLabel?: string;
};

export function AssignedUserField<T extends FieldValues>({
  register,
  name,
  fieldId,
  users,
  error,
  required = false,
  disabled = false,
  isLoading = false,
  label = 'Assigned User',
  emptyOptionLabel,
  loadingOptionLabel = 'Loading users...',
}: AssignedUserFieldProps<T>) {
  const isDisabled = disabled || isLoading;

  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      required={required}
      error={error}
    >
      <select
        id={fieldId}
        disabled={isDisabled}
        className={formInputClassName}
        {...register(name)}
        {...getFieldErrorProps(fieldId, error, required)}
        aria-busy={isLoading}
      >
        <option value="">
          {isLoading ? loadingOptionLabel : emptyOptionLabel}
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
