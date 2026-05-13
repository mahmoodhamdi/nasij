import Link from 'next/link';

import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';

const navCards = [
  { href: '/orders', title: 'Orders', description: 'Process, fulfill, and refund.', metric: '128 pending' },
  { href: '/products', title: 'Products', description: 'Create, edit, and publish.', metric: '5 published' },
  { href: '/customers', title: 'Customers', description: 'Lifetime value, segments, GDPR.', metric: '1,243 total' },
  { href: '/inventory', title: 'Inventory', description: 'Stock per variant, per location.', metric: '2 low-stock' },
  { href: '/discounts', title: 'Discounts', description: 'Codes, BOGO, free shipping, gift cards.', metric: '4 active' },
  { href: '/staff', title: 'Staff', description: 'Invite team, assign roles, revoke sessions.', metric: '3 members' },
];

const DashboardPage = () => (
  <AdminShell title="Dashboard" description="Today at a glance.">
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {navCards.map((card) => (
        <Link key={card.title} href={card.href} className="block">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-text-subtle">{card.metric}</p>
            </CardBody>
          </Card>
        </Link>
      ))}
    </section>
  </AdminShell>
);

export default DashboardPage;
