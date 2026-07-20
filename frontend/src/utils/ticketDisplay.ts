import type { TicketPriority, TicketStatus } from '../api/types';

export type BadgeTone =
  | 'default'
  | 'info'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error';

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

const TONE_CLASSES: Record<BadgeTone, string> = {
  default: 'bg-slate-100 text-slate-700',
  info: 'bg-sky-100 text-sky-800',
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
};

const STATUS_TONES: Record<TicketStatus, BadgeTone> = {
  open: 'info',
  in_progress: 'primary',
  resolved: 'success',
  closed: 'default',
  cancelled: 'default',
};

const PRIORITY_TONES: Record<TicketPriority, BadgeTone> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  critical: 'error',
};

export function formatTicketStatus(status: TicketStatus): string {
  return STATUS_LABELS[status];
}

export function formatTicketPriority(priority: TicketPriority): string {
  return PRIORITY_LABELS[priority];
}

export function getTicketStatusClassName(status: TicketStatus): string {
  return TONE_CLASSES[STATUS_TONES[status]];
}

export function getTicketPriorityClassName(priority: TicketPriority): string {
  return TONE_CLASSES[PRIORITY_TONES[priority]];
}
