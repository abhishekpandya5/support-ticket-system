import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

type CardProps<T extends ElementType = 'div'> = {
  as?: T;
  padding?: CardPadding;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'padding' | 'className' | 'children'>;

export function Card<T extends ElementType = 'div'>({
  as,
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps<T>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={`min-w-0 rounded-lg border border-slate-200 bg-white ${PADDING_CLASSES[padding]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
