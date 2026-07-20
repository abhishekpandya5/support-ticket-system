import { Button } from '../../common/Button';
import { LoadingSpinner } from '../../common/LoadingSpinner';

type FormActionsProps = {
  submitLabel: string;
  pendingLabel: string;
  pendingSpinnerLabel: string;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
};

export function FormActions({
  submitLabel,
  pendingLabel,
  pendingSpinnerLabel,
  isSubmitting = false,
  isDisabled = false,
  onCancel,
  cancelLabel = 'Cancel',
}: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
      {onCancel ? (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>
      ) : null}
      <Button
        type="submit"
        disabled={isDisabled}
        aria-busy={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner
              size="sm"
              tone="inverted"
              label={pendingSpinnerLabel}
              decorative
            />
            {pendingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
