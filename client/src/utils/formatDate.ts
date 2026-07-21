export function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

export function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const updatedAt = new Date(isoDate).getTime();
  const elapsedSeconds = Math.round((updatedAt - now) / 1000);
  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: 'auto',
  });

  const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> =
    [
      { amount: 60, unit: 'second' },
      { amount: 60, unit: 'minute' },
      { amount: 24, unit: 'hour' },
      { amount: 7, unit: 'day' },
      { amount: 4.34524, unit: 'week' },
      { amount: 12, unit: 'month' },
      { amount: Number.POSITIVE_INFINITY, unit: 'year' },
    ];

  let duration = elapsedSeconds;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }

    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), 'year');
}
