import { describe, expect, it } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('đổi ngày YYYY-MM-DD sang dd/mm/yyyy', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
  });
});
