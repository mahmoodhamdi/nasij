import { Badge } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { adminInventory } from '~/data/inventory.js';

const stockTone = (available: number, reorderPoint: number) => {
  if (available === 0) return 'danger' as const;
  if (available <= reorderPoint) return 'warning' as const;
  return 'success' as const;
};

const stockLabel = (available: number, reorderPoint: number) => {
  if (available === 0) return 'Out of stock';
  if (available <= reorderPoint) return 'Low';
  return 'OK';
};

const InventoryPage = () => (
  <AdminShell title="Inventory" description="Stock per variant, per location.">
    <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
      <table className="w-full text-sm">
        <thead className="bg-surface-sunken text-text-muted">
          <tr>
            <th className="px-4 py-3 text-start font-medium">Product</th>
            <th className="px-4 py-3 text-start font-medium">SKU</th>
            <th className="px-4 py-3 text-start font-medium">Size</th>
            <th className="px-4 py-3 text-start font-medium">Color</th>
            <th className="px-4 py-3 text-start font-medium">Location</th>
            <th className="px-4 py-3 text-end font-medium">Available</th>
            <th className="px-4 py-3 text-end font-medium">Reserved</th>
            <th className="px-4 py-3 text-end font-medium">Reorder at</th>
            <th className="px-4 py-3 text-start font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {adminInventory.map((row) => (
            <tr key={`${row.variantId}-${row.locationName}`}>
              <td className="px-4 py-3 font-medium text-text">{row.productTitle}</td>
              <td className="px-4 py-3 font-mono text-xs text-text-muted">{row.sku}</td>
              <td className="px-4 py-3 text-text-muted">{row.size ?? '—'}</td>
              <td className="px-4 py-3 capitalize text-text-muted">{row.color}</td>
              <td className="px-4 py-3 text-text-muted">{row.locationName}</td>
              <td className="px-4 py-3 text-end tabular-nums text-text">{row.available}</td>
              <td className="px-4 py-3 text-end tabular-nums text-text-muted">{row.reserved}</td>
              <td className="px-4 py-3 text-end tabular-nums text-text-muted">{row.reorderPoint}</td>
              <td className="px-4 py-3">
                <Badge tone={stockTone(row.available, row.reorderPoint)}>
                  {stockLabel(row.available, row.reorderPoint)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminShell>
);

export default InventoryPage;
