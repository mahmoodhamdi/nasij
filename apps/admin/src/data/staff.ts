import type { Role } from '@nasij/auth';

export interface AdminStaffMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'invited' | 'suspended';
  twoFactor: boolean;
  lastSeenAt?: string;
  activeSessions: number;
}

export const adminStaff: readonly AdminStaffMember[] = [
  {
    id: 'usr_owner',
    name: 'Mahmoud Hamdy',
    email: 'owner@nasij.local',
    role: 'owner',
    status: 'active',
    twoFactor: true,
    lastSeenAt: '2026-05-13T08:00:00Z',
    activeSessions: 2,
  },
  {
    id: 'usr_manager',
    name: 'Manager One',
    email: 'manager@nasij.local',
    role: 'manager',
    status: 'active',
    twoFactor: true,
    lastSeenAt: '2026-05-12T18:30:00Z',
    activeSessions: 1,
  },
  {
    id: 'usr_staff',
    name: 'Sales Staff',
    email: 'staff@nasij.local',
    role: 'staff',
    status: 'active',
    twoFactor: false,
    lastSeenAt: '2026-05-13T10:15:00Z',
    activeSessions: 1,
  },
];

export const findStaffById = (id: string): AdminStaffMember | undefined =>
  adminStaff.find((s) => s.id === id);
