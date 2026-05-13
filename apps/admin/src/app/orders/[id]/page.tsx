import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge, Button, Card, CardBody, CardHeader, CardTitle } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { findAdminOrderById } from '~/data/orders.js';
import { formatDateShort, formatPriceEgp } from '~/lib/format.js';

interface PageProps {
  params: Promise<{ id: string }>;
}

const OrderDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const order = findAdminOrderById(id);
  if (!order) {
    notFound();
  }

  const subtotal = order.lines.reduce((s, l) => s + l.unitPriceMinor * l.quantity, 0);

  return (
    <AdminShell
      title={order.number}
      description={`Placed ${formatDateShort(order.placedAt)} · ${order.itemCount} item${order.itemCount > 1 ? 's' : ''}`}
      actions={
        <>
          <Badge tone={order.status === 'paid' || order.status === 'delivered' ? 'success' : 'warning'}>
            {order.status}
          </Badge>
          <Button variant="outline">Refund</Button>
          <Button>Fulfill</Button>
        </>
      }
    >
      <Link href="/orders" className="mb-6 inline-block text-sm text-text-muted hover:text-text">
        ← Back to orders
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="flex flex-col divide-y divide-border">
              {order.lines.map((line) => (
                <li key={line.sku} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-text">{line.titleEn}</p>
                    <p className="mt-1 font-mono text-xs text-text-subtle">{line.sku}</p>
                    <p className="mt-1 text-sm text-text-muted">Quantity: {line.quantity}</p>
                  </div>
                  <span className="tabular-nums text-text">
                    {formatPriceEgp(line.unitPriceMinor * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardBody>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatPriceEgp(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Total</dt>
                <dd className="font-medium tabular-nums">{formatPriceEgp(order.totalMinor)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Payment</dt>
                <dd>
                  <Badge tone={order.paymentStatus === 'captured' ? 'success' : 'warning'}>
                    {order.paymentStatus}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        {order.shippingAddress ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardBody>
              <address className="not-italic text-sm text-text">
                {order.customerName}<br />
                {order.shippingAddress.line1}<br />
                {order.shippingAddress.city}
              </address>
            </CardBody>
          </Card>
        ) : null}
      </div>
    </AdminShell>
  );
};

export default OrderDetailPage;
