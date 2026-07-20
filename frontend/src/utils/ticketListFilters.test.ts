import { describe, expect, it } from 'vitest';

import {
  buildTicketListSearchParams,
  hasActiveTicketListFilters,
  parseTicketListFilters,
  toListTicketsParams,
} from './ticketListFilters';

describe('ticketListFilters', () => {
  it('parses valid filter params from the URL', () => {
    const params = new URLSearchParams(
      'search=login&status=open&priority=high&assignedTo=user-1',
    );

    expect(parseTicketListFilters(params)).toEqual({
      search: 'login',
      status: 'open',
      priority: 'high',
      assignedTo: 'user-1',
    });
  });

  it('ignores invalid enum values in the URL', () => {
    const params = new URLSearchParams('status=invalid&priority=urgent');

    expect(parseTicketListFilters(params)).toEqual({
      search: '',
      status: '',
      priority: '',
      assignedTo: '',
    });
  });

  it('maps filters to API params', () => {
    expect(
      toListTicketsParams({
        search: '  outage ',
        status: 'open',
        priority: '',
        assignedTo: 'user-1',
      }),
    ).toEqual({
      search: 'outage',
      status: 'open',
      assignedTo: 'user-1',
    });
  });

  it('detects active filters', () => {
    expect(
      hasActiveTicketListFilters({
        search: '',
        status: 'open',
        priority: '',
        assignedTo: '',
      }),
    ).toBe(true);

    expect(
      hasActiveTicketListFilters({
        search: '',
        status: '',
        priority: '',
        assignedTo: '',
      }),
    ).toBe(false);
  });

  it('round-trips filters through search params', () => {
    const filters = {
      search: 'billing',
      status: 'in_progress' as const,
      priority: 'medium' as const,
      assignedTo: 'unassigned',
    };

    const rebuilt = parseTicketListFilters(buildTicketListSearchParams(filters));
    expect(rebuilt).toEqual(filters);
  });
});
