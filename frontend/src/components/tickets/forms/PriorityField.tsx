import type { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';

import { TICKET_PRIORITIES } from '../../../utils/ticketListFilters';
import { formatTicketPriority } from '../../../utils/ticketDisplay';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from '../../common/FormField';

type PriorityFieldProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: FieldPath<T>;
  fieldId: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
};

export function PriorityField<T extends FieldValues>({
  register,
  name,
  fieldId,
  error,
  required = false,
  disabled = false,
  label = 'Priority',
}: PriorityFieldProps<T>) {
  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      required={required}
      error={error}
    >
      <select
        id={fieldId}
        disabled={disabled}
        className={formInputClassName}
        {...register(name)}
        {...getFieldErrorProps(fieldId, error, required)}
      >
        {TICKET_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {formatTicketPriority(priority)}
          </option>
        ))}
      </select>
    </FormField>
  );
}
