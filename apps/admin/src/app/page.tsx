import Link from 'next/link';

import { Badge, Card, CardBody, CardHeader, CardTitle } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { adminCustomers } from '~/data/customers.js';
import { adminDiscounts } from '~/data/discounts.js';
import { adminInventory } from '~/data/inventory.js';
import { adminOrders } from '~/data/orders.js';
import { adminProducts } from '~/data/products.js';
import { adminStaff } from '~/data/staff.js';
import { formatDateShort, formatPriceEgp } from '~/lib/format.js';

const statusTone = (status: string) => {
  if (status === 'paid' || status === 'fulfilled' || status === 'delivered') return 'success' as const;
  if (status === 'pending') return 'warning' as const;
  if (status === 'cancelled' || status === 'refunded') return 'danger' as const;
  return 'neutral' as const;
};

const DashboardPage = () => {
  const revenueMinor = adminOrders
    .filter((o) => o.paymentStatus === 'captured')
    .reduce((acc, o) => acc + o.totalMinor, 0);
  const pendingCount = adminOrders.filter((o) => o.status === 'pending').length;
  const lowStock = adminInventory.filter((i) => i.available <= i.reorderPoint).length;
  const activeDiscounts = adminDiscounts.filter((d) => d.isActive).length;
  const totalCustomers = adminCustomers.length;
  const repeatBuyers = adminCustomers.filter((c) => c.ordersCount > 1).length;
  const avgOrderMinor = adminOrders.length > 0 ? Math.round(revenueMinor / adminOrders.length) : 0;
  const recentOrders = [...adminOrders]
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
    .slice(0, 5);
  const topDiscounts = [...adminDiscounts].sort((a, b) => b.usageCount - a.usageCount).slice(0, 4);
  const lowStockRows = adminInventory
    .filter((i) => i.available <= i.reorderPoint)
    .slice(0, 6);

  const stats = [
    {
      label: 'Revenue (captured)',
      value: formatPriceEgp(revenueMinor),
      hint: `${adminOrders.length} orders`,
      href: '/orders',
    },
    {
      label: 'Pending orders',
      value: pendingCount.toString(),
      hint: pendingCount > 0 ? 'Action required' : 'All clear',
      href: '/orders',
      tone: pendingCount > 0 ? ('warning' as const) : ('success' as const),
    },
    {
      label: 'Low stock',
      value: lowStock.toString(),
      hint: lowStock > 0 ? 'Reorder soon' : 'Healthy',
      href: '/inventory',
      tone: lowStock > 0 ? ('warning' as const) : ('success' as const),
    },
    {
      label: 'Average order value',
      value: formatPriceEgp(avgOrderMinor),
      hint: 'Across all channels',
      href: '/orders',
    },
    {
      label: 'Customers',
      value: totalCustomers.toString(),
      hint: `${repeatBuyers} repeat`,
      href: '/customers',
    },
    {
      label: 'Active discounts',
      value: activeDiscounts.toString(),
      hint: `${adminDiscounts.reduce((a, d) => a + d.usageCount, 0)} uses total`,
      href: '/discounts',
    },
    {
      label: 'Products',
      value: adminProducts.length.toString(),
      hint: 'Published',
      href: '/products',
    },
    {
      label: 'Staff',
      value: adminStaff.length.toString(),
      hint: `${adminStaff.filter((s) => s.twoFactor).length} with 2FA`,
      href: '/staff',
    },
  ];

  return (
    <AdminShell title="Dashboard" description="Today at a glance.">
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardBody className="flex flex-col gap-2">
                <div className="text-xs uppercase tracking-wide text-text-subtle">
                  {stat.label}
                </div>
                <div className="font-display-latin text-3xl font-medium text-text">
                  {stat.value}
                </div>
                <div className="text-xs text-text-muted">{stat.hint}</div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent orders</CardTitle>
            <Link href="/orders" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-surface-sunken text-text-muted">
                <tr>
                  <th className="px-4 py-2 text-start font-medium">Order</th>
                  <th className="px-4 py-2 text-start font-medium">Customer</th>
                  <th className="px-4 py-2 text-start font-medium">Status</th>
                  <th className="px-4 py-2 text-end font-medium">Total</th>
                  <th className="px-4 py-2 text-end font-medium">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2 font-mono text-xs">
                      <Link href={`/orders/${order.id}`} className="hover:text-accent">
                        {order.number}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-text">{order.customerName}</td>
                    <td className="px-4 py-2">
                      <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-2 text-end tabular-nums">
                      {formatPriceEgp(order.totalMinor)}
                    </td>
                    <td className="px-4 py-2 text-end text-text-muted">
                      {formatDateShort(order.placedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low-stock items</CardTitle>
            <Link href="/inventory" className="text-sm text-accent hover:underline">
              Inventory
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {lowStockRows.length === 0 ? (
              <p className="px-4 py-6 text-sm text-text-muted">All variants healthy.</p>
            ) : (
              <ul className="divide-y divide-border">
                {lowStockRows.map((row) => (
                  <li key={`${row.variantId}-${row.locationName}`} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-text">{row.productTitle}</div>
                      <div className="text-xs text-text-muted">
                        {row.size ? `${row.size} · ` : ''}
                        <span className="capitalize">{row.color}</span> · {row.locationName}
                      </div>
                    </div>
                    <Badge tone={row.available === 0 ? 'danger' : 'warning'}>
                      {row.available === 0 ? 'Out' : `${row.available} left`}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>

      <section className="mt-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top discount codes</CardTitle>
            <Link href="/discounts" className="text-sm text-accent hover:underline">
              All codes
            </Link>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topDiscounts.map((d) => (
                <div key={d.id} className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium text-text">{d.code}</span>
                    <Badge tone={d.isActive ? 'success' : 'neutral'}>
                      {d.isActive ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-text-muted">{d.name}</div>
                  <div className="mt-3 text-sm">
                    <span className="font-medium text-text">{d.usageCount}</span>
                    <span className="text-text-muted"> uses</span>
                    {d.usageLimit ? (
                      <span className="text-text-subtle"> / {d.usageLimit}</span>
                    ) : null}
                  </div>
                  {d.usageLimit ? (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width: `${Math.min(100, Math.round((d.usageCount / d.usageLimit) * 100))}%`,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </AdminShell>
  );
};

export default DashboardPage;
