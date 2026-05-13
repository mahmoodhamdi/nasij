import { roles } from '@nasij/auth';
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Input, Label } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { adminStaff } from '~/data/staff.js';
import { formatDateShort } from '~/lib/format.js';

const statusTone = (status: string) => {
  if (status === 'active') return 'success' as const;
  if (status === 'invited') return 'warning' as const;
  return 'danger' as const;
};

const StaffPage = () => (
  <AdminShell
    title="Staff"
    description="Invite team members, assign roles, manage sessions."
  >
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
        <table className="w-full text-sm">
          <thead className="bg-surface-sunken text-text-muted">
            <tr>
              <th className="px-4 py-3 text-start font-medium">Name</th>
              <th className="px-4 py-3 text-start font-medium">Role</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-start font-medium">2FA</th>
              <th className="px-4 py-3 text-start font-medium">Sessions</th>
              <th className="px-4 py-3 text-start font-medium">Last seen</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {adminStaff.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-text">{member.name}</div>
                  <div className="text-xs text-text-subtle">{member.email}</div>
                </td>
                <td className="px-4 py-3 capitalize text-text">{member.role}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(member.status)}>{member.status}</Badge>
                </td>
                <td className="px-4 py-3 text-text-muted">{member.twoFactor ? 'On' : 'Off'}</td>
                <td className="px-4 py-3 tabular-nums text-text">{member.activeSessions}</td>
                <td className="px-4 py-3 text-text-muted">
                  {member.lastSeenAt ? formatDateShort(member.lastSeenAt) : '—'}
                </td>
                <td className="px-4 py-3 text-end">
                  <button
                    type="button"
                    className="text-sm text-text-muted hover:text-danger"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invite teammate</CardTitle>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-3">
            <div>
              <Label htmlFor="inviteName">Name</Label>
              <Input id="inviteName" />
            </div>
            <div>
              <Label htmlFor="inviteEmail">Email</Label>
              <Input id="inviteEmail" type="email" />
            </div>
            <div>
              <Label htmlFor="inviteRole">Role</Label>
              <select
                id="inviteRole"
                defaultValue="staff"
                className="block h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-sm"
              >
                {roles
                  .filter((r) => r !== 'customer')
                  .map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
              </select>
            </div>
            <Button type="submit" className="mt-2 w-full">
              Send invite
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  </AdminShell>
);

export default StaffPage;
