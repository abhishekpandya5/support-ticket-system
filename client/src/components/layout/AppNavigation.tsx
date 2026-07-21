import { NavLink } from 'react-router-dom';

import { NAV_ITEMS } from '../../routes/paths';

type AppNavigationProps = {
  onNavigate?: () => void;
  className?: string;
};

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400',
    isActive
      ? 'bg-slate-100 text-slate-900'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ');

export function AppNavigation({
  onNavigate,
  className = '',
}: AppNavigationProps) {
  return (
    <nav aria-label="Main navigation" className={className}>
      <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={linkClassName}
              onClick={onNavigate}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
