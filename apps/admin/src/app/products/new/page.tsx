import { Button, Input, Label } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';

const NewProductPage = () => (
  <AdminShell title="New product" description="Create a draft, add variants, publish when ready.">
    <form
      action="/products"
      method="post"
      className="grid grid-cols-1 gap-6 rounded-lg border border-border bg-surface-raised p-6 lg:grid-cols-2"
    >
      <fieldset className="flex flex-col gap-3 lg:col-span-2">
        <legend className="font-display-latin text-lg text-text">Titles</legend>
        <div>
          <Label htmlFor="titleEn">Title (English)</Label>
          <Input id="titleEn" name="titleEn" required />
        </div>
        <div>
          <Label htmlFor="titleAr">Title (Arabic)</Label>
          <Input id="titleAr" name="titleAr" required dir="rtl" />
        </div>
      </fieldset>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required placeholder="kaftan-amber" />
      </div>
      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" name="sku" required placeholder="NSJ-KFT-AMB" />
      </div>

      <div>
        <Label htmlFor="basePrice">Base price (EGP)</Label>
        <Input id="basePrice" name="basePrice" type="number" min={0} step="0.01" required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          className="block h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-sm"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <fieldset className="flex flex-col gap-3 lg:col-span-2">
        <legend className="font-display-latin text-lg text-text">Descriptions</legend>
        <div>
          <Label htmlFor="descriptionEn">Description (English)</Label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            rows={4}
            className="block w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="descriptionAr">Description (Arabic)</Label>
          <textarea
            id="descriptionAr"
            name="descriptionAr"
            rows={4}
            dir="rtl"
            className="block w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm"
          />
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 lg:col-span-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save draft</Button>
      </div>
    </form>
  </AdminShell>
);

export default NewProductPage;
