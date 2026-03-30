import { describe, it, expect } from 'vitest';
import { resolveRole } from '@/lib/roles';

describe('resolveRole', () => {
  it('returns admin for paysdoc@gmail.com', () => {
    expect(resolveRole('paysdoc@gmail.com')).toBe('admin');
  });

  it('returns admin for martin@paysdoc.nl', () => {
    expect(resolveRole('martin@paysdoc.nl')).toBe('admin');
  });

  it('returns client for a non-admin email', () => {
    expect(resolveRole('jane@example.com')).toBe('client');
  });

  it('is case-insensitive: PAYSDOC@GMAIL.COM resolves to admin', () => {
    expect(resolveRole('PAYSDOC@GMAIL.COM')).toBe('admin');
  });

  it('is case-insensitive: Martin@Paysdoc.NL resolves to admin', () => {
    expect(resolveRole('Martin@Paysdoc.NL')).toBe('admin');
  });

  it('returns client for null', () => {
    expect(resolveRole(null)).toBe('client');
  });

  it('returns client for undefined', () => {
    expect(resolveRole(undefined)).toBe('client');
  });
});
