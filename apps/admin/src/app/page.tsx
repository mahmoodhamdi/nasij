import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@nasij/ui';

const navCards = [
  { title: 'Orders', description: 'Process, fulfill, and refund.' },
  { title: 'Products', description: 'Create, edit, and publish.' },
  { title: 'Customers', description: 'Lifetime value, segments, GDPR.' },
  { title: 'Inventory', description: 'Stock per variant, per location.' },
  { title: 'Discounts', description: 'Codes, BOGO, free shipping, gift cards.' },
  { title: 'Staff', description: 'Invite team, assign roles, revoke sessions.' },
];

const DashboardPage = () => (
  <main className="mx-auto max-w-6xl px-6 py-12">
    <header className="mb-10">
      <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">Nasij admin</p>
      <h1 className="font-display-latin text-4xl font-medium text-text">Dashboard</h1>
    </header>
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {navCards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardBody />
        </Card>
      ))}
    </section>
  </main>
);

export default DashboardPage;
