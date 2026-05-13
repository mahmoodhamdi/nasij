import { describe, it, expect } from 'vitest';

import { can, hasAnyOf, isAtLeast, rolePermissions, roles } from './rbac.js';

describe('rolePermissions table', () => {
  it('lists all 6 roles', () => {
    expect(roles).toHaveLength(6);
  });

  it('owner has the most permissions', () => {
    const sizes = roles.map((r) => rolePermissions[r].size);
    expect(rolePermissions['owner'].size).toBe(Math.max(...sizes));
  });

  it('customer has no admin-style permissions', () => {
    expect(rolePermissions['customer'].size).toBe(0);
  });
});

describe('can', () => {
  it('lets owner refund orders', () => {
    expect(can('owner', 'orders:refund')).toBe(true);
  });

  it('does not let staff refund orders', () => {
    expect(can('staff', 'orders:refund')).toBe(false);
  });

  it('does not let support write products', () => {
    expect(can('support', 'products:write')).toBe(false);
  });

  it('lets manager open the register', () => {
    expect(can('manager', 'pos:open-register')).toBe(true);
  });
});

describe('isAtLeast', () => {
  it('owner is at least admin', () => {
    expect(isAtLeast('owner', 'admin')).toBe(true);
  });

  it('staff is not at least manager', () => {
    expect(isAtLeast('staff', 'manager')).toBe(false);
  });

  it('manager is at least staff', () => {
    expect(isAtLeast('manager', 'staff')).toBe(true);
  });

  it('customer is the floor', () => {
    expect(isAtLeast('customer', 'customer')).toBe(true);
    expect(isAtLeast('customer', 'support')).toBe(false);
  });
});

describe('hasAnyOf', () => {
  it('returns true if any permission is granted', () => {
    expect(hasAnyOf('support', ['products:write', 'orders:read'])).toBe(true);
  });

  it('returns false if none are granted', () => {
    expect(hasAnyOf('customer', ['products:write', 'orders:refund'])).toBe(false);
  });
});
