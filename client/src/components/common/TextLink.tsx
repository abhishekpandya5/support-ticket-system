import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { AppRoutePath } from '../../routes/paths';

type TextLinkProps = {
  to: AppRoutePath | string;
  children: ReactNode;
  className?: string;
};

const BASE_CLASSES =
  'text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400';

export function TextLink({ to, children, className = '' }: TextLinkProps) {
  return (
    <Link to={to} className={`${BASE_CLASSES} ${className}`.trim()}>
      {children}
    </Link>
  );
}
