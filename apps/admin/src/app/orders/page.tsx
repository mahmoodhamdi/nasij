import Link from 'next/link';

import { Badge } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { adminOrders } from '~/data/orders.js';
import { formatDateShort, formatPriceEgp } from '~/lib/format.js';

const statusTone = (status: string) => {
  if (status === 'paid' || status === 'fulfilled' || status === 'delivered') return 'success' as const;
  if (status === 'pending') return 'warning' as const;
  if (status === 'cancelled' || status === 'refunded') return 'danger' as const;
  return 'neutral' as const;
};

const OrdersPage = () => (
  <AdminShell title="Orders" description="Process, fulfill, and refund.">
    <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
      <table className="w-full text-sm">
        <thead className="bg-surface-sunken text-text-muted">
          <tr>
            <th className="px-4 py-3 text-start font-medium">Order</th>
            <th className="px-4 py-3 text-start font-medium">Customer</th>
            <th className="px-4 py-3 text-start font-medium">Channel</th>
            <th className="px-4 py-3 text-start font-medium">Status</th>
            <th className="px-4 py-3 text-start font-medium">Total</th>
            <th className="px-4 py-3 text-start font-medium">Placed</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {adminOrders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3 font-mono text-xs text-text">{order.number}</td>
              <td className="px-4 py-3">
                <div className="text-text">{order.customerName}</div>
                {order.customerEmail ? (
                  <div className="text-xs text-text-subtle">{order.customerEmail}</div>
                ) : null}
              </td>
              <td className="px-4 py-3 capitalize text-text-muted">{order.channel}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(order.status)}>{order.status}</Badge>
              </td>
              <td className="px-4 py-3 tabular-nums text-text">{formatPriceEgp(order.totalMinor)}</td>
              <td className="px-4 py-3 text-text-muted">{formatDateShort(order.placedAt)}</td>
              <td className="px-4 py-3 text-end">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminShell>
);

export default OrdersPage;
