import type { UseFormRegister } from 'react-hook-form';

import type { TicketPriority } from '../../api/types';
import type { CreateTicketFormValues } from '../../schemas/createTicketFormSchema';
import { formatTicketPriority } from '../../utils/ticketDisplay';
import {
  FormField,
  formInputClassName,
  getFieldErrorProps,
} from './FormField';

const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'critical'];

type PrioritySelectProps = {
  register: UseFormRegister<CreateTicketFormValues>;
  error?: string;
  disabled?: boolean;
};

export function PrioritySelect({
  register,
  error,
  disabled = false,
}: PrioritySelectProps) {
  const fieldId = 'create-ticket-priority';

  return (
    <FormField
      label="Priority"
      htmlFor={fieldId}
      required
      error={error}
    >
      <select
        id={fieldId}
        disabled={disabled}
        className={formInputClassName}
        {...register('priority')}
        {...getFieldErrorProps(fieldId, error)}
      >
        {PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {formatTicketPriority(priority)}
          </option>
        ))}
      </select>
    </FormField>
  );
}
