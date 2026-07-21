import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

const baseClasses =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

export function Badge({ children, className = '' }: BadgeProps) {
  return <span className={`${baseClasses} ${className}`.trim()}>{children}</span>;
}
