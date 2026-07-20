import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  commentFormSchema,
  type CommentFormValues,
} from '../../schemas/commentFormSchema';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { formInputClassName } from '../common/FormField';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAddComment } from '../../hooks/tickets';

type CommentFormProps = {
  ticketId: string;
  createdById: string;
};

export function CommentForm({ ticketId, createdById }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { message: '' },
  });

  const { mutate, mutationState, isPending } = useAddComment({
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (values: CommentFormValues) => {
    mutate({
      ticketId,
      body: {
        message: values.message,
        createdBy: createdById,
      },
    });
  };

  const apiFieldError = mutationState.error?.fieldErrors?.message;
  const isDisabled = isPending || !createdById;

  return (
    <Card
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      padding="sm"
      noValidate
    >
      <label htmlFor="comment-message" className="sr-only">
        Comment
      </label>
      <textarea
        id="comment-message"
        rows={4}
        placeholder="Write a comment..."
        disabled={isDisabled}
        className={formInputClassName}
        {...register('message')}
      />

      {errors.message ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {errors.message.message}
        </p>
      ) : null}

      {apiFieldError ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {apiFieldError}
        </p>
      ) : null}

      {mutationState.error && !apiFieldError ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {mutationState.error.message}
        </p>
      ) : null}

      <div className="mt-3 flex justify-end">
        <Button
          type="submit"
          disabled={isDisabled}
          aria-busy={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <>
              <LoadingSpinner size="sm" tone="inverted" label="Posting comment" />
              Posting...
            </>
          ) : (
            'Post comment'
          )}
        </Button>
      </div>
    </Card>
  );
}
