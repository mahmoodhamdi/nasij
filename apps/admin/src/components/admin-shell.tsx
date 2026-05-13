import Link from 'next/link';
import type { ReactNode } from 'react';

interface AdminShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const NAV = [
  { href: '/', label: 'Dashboard' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' },
  { href: '/customers', label: 'Customers' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/discounts', label: 'Discounts' },
  { href: '/staff', label: 'Staff' },
] as const;

export const AdminShell = ({ title, description, children, actions }: AdminShellProps) => (
  <div className="grid min-h-dvh grid-cols-1 bg-surface-sunken lg:grid-cols-[240px_1fr]">
    <aside className="border-e border-border bg-surface-raised py-6">
      <Link
        href="/"
        className="block px-6 font-display-latin text-xl font-medium text-text"
      >
        Nasij admin
      </Link>
      <nav aria-label="Primary" className="mt-6 flex flex-col">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-6 py-2 text-sm text-text-muted hover:bg-surface-sunken hover:text-text"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
    <main className="flex flex-col">
      <header className="flex items-end justify-between border-b border-border bg-surface-raised px-8 py-6">
        <div>
          <h1 className="font-display-latin text-3xl font-medium text-text">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </header>
      <section className="flex-1 px-8 py-6">{children}</section>
    </main>
  </div>
);
