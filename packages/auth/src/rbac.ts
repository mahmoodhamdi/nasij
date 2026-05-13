export const roles = ['owner', 'admin', 'manager', 'staff', 'support', 'customer'] as const;
export type Role = (typeof roles)[number];

const roleRank: Record<Role, number> = {
  owner: 100,
  admin: 80,
  manager: 60,
  staff: 40,
  support: 30,
  customer: 0,
};

export type Permission =
  | 'products:read'
  | 'products:write'
  | 'orders:read'
  | 'orders:write'
  | 'orders:refund'
  | 'customers:read'
  | 'customers:write'
  | 'staff:read'
  | 'staff:write'
  | 'discounts:read'
  | 'discounts:write'
  | 'inventory:read'
  | 'inventory:write'
  | 'pos:operate'
  | 'pos:open-register'
  | 'pos:close-register'
  | 'settings:write'
  | 'analytics:read'
  | 'audit:read';

export const rolePermissions: Record<Role, ReadonlySet<Permission>> = {
  owner: new Set<Permission>([
    'products:read', 'products:write',
    'orders:read', 'orders:write', 'orders:refund',
    'customers:read', 'customers:write',
    'staff:read', 'staff:write',
    'discounts:read', 'discounts:write',
    'inventory:read', 'inventory:write',
    'pos:operate', 'pos:open-register', 'pos:close-register',
    'settings:write',
    'analytics:read',
    'audit:read',
  ]),
  admin: new Set<Permission>([
    'products:read', 'products:write',
    'orders:read', 'orders:write', 'orders:refund',
    'customers:read', 'customers:write',
    'staff:read', 'staff:write',
    'discounts:read', 'discounts:write',
    'inventory:read', 'inventory:write',
    'pos:operate', 'pos:open-register', 'pos:close-register',
    'settings:write',
    'analytics:read',
    'audit:read',
  ]),
  manager: new Set<Permission>([
    'products:read', 'products:write',
    'orders:read', 'orders:write', 'orders:refund',
    'customers:read', 'customers:write',
    'staff:read',
    'discounts:read', 'discounts:write',
    'inventory:read', 'inventory:write',
    'pos:operate', 'pos:open-register', 'pos:close-register',
    'analytics:read',
  ]),
  staff: new Set<Permission>([
    'products:read',
    'orders:read',
    'customers:read',
    'inventory:read',
    'pos:operate',
  ]),
  support: new Set<Permission>([
    'products:read',
    'orders:read',
    'customers:read',
    'inventory:read',
  ]),
  customer: new Set<Permission>([]),
};

export const can = (role: Role, permission: Permission): boolean =>
  rolePermissions[role].has(permission);

export const isAtLeast = (role: Role, minimum: Role): boolean => roleRank[role] >= roleRank[minimum];

export const hasAnyOf = (role: Role, permissions: readonly Permission[]): boolean =>
  permissions.some((p) => can(role, p));
