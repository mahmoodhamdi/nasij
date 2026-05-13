import { notFound } from 'next/navigation';

import { Badge, Button, Input, Label } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { findAdminProductById } from '~/data/products.js';
import { formatPriceEgp } from '~/lib/format.js';

interface PageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const product = findAdminProductById(id);
  if (!product) {
    notFound();
  }

  return (
    <AdminShell
      title={product.titleEn}
      description={`${product.sku} · ${product.variantCount} variants · ${product.totalStock} in stock`}
      actions={
        <>
          <Badge tone={product.status === 'active' ? 'success' : 'warning'}>{product.status}</Badge>
          <Button>Save</Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-6 rounded-lg border border-border bg-surface-raised p-6 lg:grid-cols-2">
        <fieldset className="flex flex-col gap-3 lg:col-span-2">
          <legend className="font-display-latin text-lg text-text">Titles</legend>
          <div>
            <Label htmlFor="titleEn">Title (English)</Label>
            <Input id="titleEn" defaultValue={product.titleEn} />
          </div>
          <div>
            <Label htmlFor="titleAr">Title (Arabic)</Label>
            <Input id="titleAr" defaultValue={product.titleAr} dir="rtl" />
          </div>
        </fieldset>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" defaultValue={product.slug} />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" defaultValue={product.sku} />
        </div>

        <div>
          <Label htmlFor="basePrice">Base price (EGP)</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            defaultValue={(product.basePriceMinor / 100).toFixed(2)}
          />
          <p className="mt-2 text-xs text-text-subtle">
            Current: {formatPriceEgp(product.basePriceMinor)}
          </p>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            defaultValue={product.category}
            className="block h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-sm"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </form>
    </AdminShell>
  );
};

export default ProductDetailPage;
