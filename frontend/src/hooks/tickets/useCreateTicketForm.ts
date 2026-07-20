import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  CREATE_TICKET_DEFAULT_VALUES,
  createTicketFormSchema,
  type CreateTicketFormValues,
} from '../../schemas/createTicketFormSchema';
import { ROUTES } from '../../routes/paths';
import { getActingAsUserIdOrNull } from '../../utils/actingAsMessages';
import { toCreateTicketRequest } from '../../utils/createTicket';
import { useActingAsUser } from '../users';
import { useCreateTicket } from './useTicketMutations';

export function useCreateTicketForm() {
  const navigate = useNavigate();
  const {
    users,
    usersLoading,
    actingAsUser,
    actingAsWarning,
  } = useActingAsUser();

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketFormSchema),
    defaultValues: CREATE_TICKET_DEFAULT_VALUES,
    mode: 'onSubmit',
  });

  const { mutate, mutationState, isPending } = useCreateTicket({
    onSuccess: () => {
      form.reset(CREATE_TICKET_DEFAULT_VALUES);
      navigate(ROUTES.tickets);
    },
  });

  const handleSubmit = (values: CreateTicketFormValues) => {
    const createdBy = getActingAsUserIdOrNull(users);

    if (!createdBy) {
      return;
    }

    mutate(toCreateTicketRequest(values, createdBy));
  };

  return {
    form,
    users,
    usersLoading,
    isSubmitting: isPending,
    apiError: mutationState.error,
    actingAsUser,
    actingAsWarning,
    handleSubmit,
    handleCancel: () => navigate(ROUTES.tickets),
  };
}
