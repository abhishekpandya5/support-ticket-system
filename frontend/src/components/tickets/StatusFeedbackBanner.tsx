import type { StatusFeedback } from '../../hooks/tickets/useTicketStatusWorkflow';

type StatusFeedbackBannerProps = {
  feedback: StatusFeedback | null;
  onDismiss?: () => void;
};

export function StatusFeedbackBanner({
  feedback,
  onDismiss,
}: StatusFeedbackBannerProps) {
  if (!feedback) {
    return null;
  }

  const isSuccess = feedback.type === 'success';

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className={`rounded-lg border p-3 text-sm ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p>{feedback.message}</p>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-xs font-medium underline hover:no-underline"
          >
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}
