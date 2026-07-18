export type NavItem = {
  label: string;
  href: string;
};

export const PLACEHOLDER_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', href: '#' },
  { label: 'Tickets', href: '#' },
  { label: 'Create Ticket', href: '#' },
] as const;

type AppNavigationProps = {
  items?: readonly NavItem[];
  onNavigate?: () => void;
  className?: string;
};

export function AppNavigation({
  items = PLACEHOLDER_NAV_ITEMS,
  onNavigate,
  className = '',
}: AppNavigationProps) {
  return (
    <nav aria-label="Main navigation" className={className}>
      <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              onClick={onNavigate}
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
