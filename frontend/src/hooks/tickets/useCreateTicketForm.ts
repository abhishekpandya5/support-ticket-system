import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  CREATE_TICKET_DEFAULT_VALUES,
  createTicketFormSchema,
  type CreateTicketFormValues,
} from '../../schemas/createTicketFormSchema';
import { ROUTES } from '../../routes/paths';
import { getActingAsUser, getActingAsUserId } from '../../utils/actingAs';
import { toCreateTicketRequest } from '../../utils/createTicket';
import { useUsers } from '../users';
import { useCreateTicket } from './useTicketMutations';

export function useCreateTicketForm() {
  const navigate = useNavigate();
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const users = usersData?.users ?? [];

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

  const actingAsUser = getActingAsUser(users);
  const actingAsWarning =
    !usersLoading && users.length > 0 && !actingAsUser
      ? 'Unable to determine the acting user. Refresh the page and try again.'
      : !usersLoading && users.length === 0
        ? 'No users are available. Tickets cannot be created until users exist.'
        : null;

  const handleSubmit = (values: CreateTicketFormValues) => {
    const createdBy = getActingAsUserId(users);

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
