import type { ReactNode } from 'react';

type SkeletonLoaderProps = {
  className?: string;
};

export function SkeletonLoader({ className = '' }: SkeletonLoaderProps) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

type SkeletonContainerProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function SkeletonContainer({
  label,
  children,
  className = '',
}: SkeletonContainerProps) {
  return (
    <div
      className={className}
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
    >
      {children}
    </div>
  );
}
