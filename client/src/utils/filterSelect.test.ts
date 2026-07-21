import { describe, expect, it } from 'vitest';

import {
  parsePriorityFilterValue,
  parseStatusFilterValue,
} from './filterSelect';

describe('filterSelect', () => {
  it('parses known status values', () => {
    expect(parseStatusFilterValue('open')).toBe('open');
    expect(parseStatusFilterValue('bad')).toBe('');
  });

  it('parses known priority values', () => {
    expect(parsePriorityFilterValue('critical')).toBe('critical');
    expect(parsePriorityFilterValue('urgent')).toBe('');
  });
});
