import { Link } from 'react-router-dom';

type StatCardTone = 'default' | 'info' | 'primary' | 'success' | 'muted';

type StatCardProps = {
  label: string;
  value: number;
  to?: string;
  tone?: StatCardTone;
};

const TONE_CLASSES: Record<StatCardTone, string> = {
  default: 'border-slate-200 bg-white',
  info: 'border-sky-200 bg-sky-50',
  primary: 'border-blue-200 bg-blue-50',
  success: 'border-emerald-200 bg-emerald-50',
  muted: 'border-slate-300 bg-slate-50',
};

const VALUE_TONE_CLASSES: Record<StatCardTone, string> = {
  default: 'text-slate-900',
  info: 'text-sky-900',
  primary: 'text-blue-900',
  success: 'text-emerald-900',
  muted: 'text-slate-700',
};

function StatCardContent({
  label,
  value,
  tone = 'default',
}: StatCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${TONE_CLASSES[tone]}`}
    >
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p
        className={`mt-2 text-3xl font-semibold tabular-nums ${VALUE_TONE_CLASSES[tone]}`}
      >
        {value}
      </p>
    </div>
  );
}

export function StatCard({ label, value, to, tone = 'default' }: StatCardProps) {
  if (!to) {
    return <StatCardContent label={label} value={value} tone={tone} />;
  }

  return (
    <Link
      to={to}
      className="block rounded-lg transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      <StatCardContent label={label} value={value} tone={tone} />
    </Link>
  );
}
