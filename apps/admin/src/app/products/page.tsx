import Link from 'next/link';

import { Badge, Button } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { adminProducts } from '~/data/products.js';
import { formatDateShort, formatPriceEgp } from '~/lib/format.js';

const statusTone = (status: string) => {
  if (status === 'active') return 'success' as const;
  if (status === 'draft') return 'warning' as const;
  return 'neutral' as const;
};

const ProductsListPage = () => (
  <AdminShell
    title="Products"
    description="Create, edit, and publish."
    actions={
      <Button asChild>
        <Link href="/products/new">New product</Link>
      </Button>
    }
  >
    <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
      <table className="w-full text-sm">
        <thead className="bg-surface-sunken text-text-muted">
          <tr>
            <th className="px-4 py-3 text-start font-medium">Product</th>
            <th className="px-4 py-3 text-start font-medium">SKU</th>
            <th className="px-4 py-3 text-start font-medium">Status</th>
            <th className="px-4 py-3 text-start font-medium">Price</th>
            <th className="px-4 py-3 text-start font-medium">Stock</th>
            <th className="px-4 py-3 text-start font-medium">Updated</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {adminProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3">
                <div className="font-medium text-text">{product.titleEn}</div>
                <div className="text-xs text-text-subtle">{product.titleAr}</div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-text-muted">{product.sku}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(product.status)}>{product.status}</Badge>
              </td>
              <td className="px-4 py-3 tabular-nums text-text">
                {formatPriceEgp(product.basePriceMinor)}
              </td>
              <td className="px-4 py-3 tabular-nums text-text">{product.totalStock}</td>
              <td className="px-4 py-3 text-text-muted">{formatDateShort(product.updatedAt)}</td>
              <td className="px-4 py-3 text-end">
                <Link
                  href={`/products/${product.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminShell>
);

export default ProductsListPage;
