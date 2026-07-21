import type { TicketStatus } from '../api/types';

/** Display order for the lifecycle timeline (visual only — not transition rules). */
export const STATUS_TIMELINE_STEPS: TicketStatus[] = [
  'open',
  'in_progress',
  'resolved',
  'closed',
];

export type TimelineStepState = 'complete' | 'current' | 'upcoming';

export function getTimelineStepState(
  step: TicketStatus,
  currentStatus: TicketStatus,
): TimelineStepState {
  const currentIndex = STATUS_TIMELINE_STEPS.indexOf(currentStatus);
  const stepIndex = STATUS_TIMELINE_STEPS.indexOf(step);

  if (currentIndex === -1 || stepIndex === -1) {
    return 'upcoming';
  }

  if (stepIndex < currentIndex) {
    return 'complete';
  }

  if (stepIndex === currentIndex) {
    return 'current';
  }

  return 'upcoming';
}
