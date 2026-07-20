import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  commentFormSchema,
  type CommentFormValues,
} from '../../schemas/commentFormSchema';
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-slate-200 bg-white p-4"
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
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50"
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
        <button
          type="submit"
          disabled={isDisabled}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isPending ? 'Posting...' : 'Post comment'}
        </button>
      </div>
    </form>
  );
}
