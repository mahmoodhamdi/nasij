import { Badge } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { adminCustomers } from '~/data/customers.js';
import { formatDateShort, formatPriceEgp } from '~/lib/format.js';

const CustomersPage = () => (
  <AdminShell
    title="Customers"
    description="Lifetime value, order history, marketing opt-in."
  >
    <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
      <table className="w-full text-sm">
        <thead className="bg-surface-sunken text-text-muted">
          <tr>
            <th className="px-4 py-3 text-start font-medium">Name</th>
            <th className="px-4 py-3 text-start font-medium">Email</th>
            <th className="px-4 py-3 text-start font-medium">Phone</th>
            <th className="px-4 py-3 text-start font-medium">Locale</th>
            <th className="px-4 py-3 text-start font-medium">Orders</th>
            <th className="px-4 py-3 text-start font-medium">Lifetime</th>
            <th className="px-4 py-3 text-start font-medium">Last order</th>
            <th className="px-4 py-3 text-start font-medium">Marketing</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {adminCustomers.map((customer) => (
            <tr key={customer.id}>
              <td className="px-4 py-3 font-medium text-text">
                {customer.firstName} {customer.lastName}
              </td>
              <td className="px-4 py-3 text-text-muted">{customer.email}</td>
              <td className="px-4 py-3 font-mono text-xs text-text-muted">{customer.phone}</td>
              <td className="px-4 py-3 uppercase text-text-muted">{customer.locale}</td>
              <td className="px-4 py-3 tabular-nums text-text">{customer.ordersCount}</td>
              <td className="px-4 py-3 tabular-nums text-text">
                {formatPriceEgp(customer.lifetimeValueMinor)}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {customer.lastOrderAt ? formatDateShort(customer.lastOrderAt) : '—'}
              </td>
              <td className="px-4 py-3">
                <Badge tone={customer.marketingOptIn ? 'success' : 'neutral'}>
                  {customer.marketingOptIn ? 'Opted in' : 'Not subscribed'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminShell>
);

export default CustomersPage;
