type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerTone = 'default' | 'inverted';

type LoadingSpinnerProps = {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  label?: string;
  className?: string;
  /** Use inside buttons or when parent already announces loading state. */
  decorative?: boolean;
};

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

const TONE_CLASSES: Record<SpinnerTone, string> = {
  default: 'border-slate-300 border-t-slate-700',
  inverted: 'border-white/30 border-t-white',
};

export function LoadingSpinner({
  size = 'md',
  tone = 'default',
  label = 'Loading',
  className = '',
  decorative = false,
}: LoadingSpinnerProps) {
  if (decorative) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center ${className}`.trim()}
      >
        <span
          className={`animate-spin rounded-full ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]}`}
        />
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`.trim()}
    >
      <span
        className={`animate-spin rounded-full ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
