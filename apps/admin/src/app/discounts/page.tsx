import { Badge } from '@nasij/ui';

import { AdminShell } from '~/components/admin-shell.js';
import { adminDiscounts, formatDiscountValue } from '~/data/discounts.js';
import { formatDateShort } from '~/lib/format.js';

const DiscountsPage = () => (
  <AdminShell title="Discounts" description="Codes, BOGO, free shipping, gift cards.">
    <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
      <table className="w-full text-sm">
        <thead className="bg-surface-sunken text-text-muted">
          <tr>
            <th className="px-4 py-3 text-start font-medium">Code</th>
            <th className="px-4 py-3 text-start font-medium">Name</th>
            <th className="px-4 py-3 text-start font-medium">Type</th>
            <th className="px-4 py-3 text-start font-medium">Value</th>
            <th className="px-4 py-3 text-end font-medium">Used</th>
            <th className="px-4 py-3 text-end font-medium">Limit</th>
            <th className="px-4 py-3 text-start font-medium">Ends</th>
            <th className="px-4 py-3 text-start font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {adminDiscounts.map((d) => (
            <tr key={d.id}>
              <td className="px-4 py-3 font-mono text-sm font-medium text-text">{d.code}</td>
              <td className="px-4 py-3 text-text-muted">{d.name}</td>
              <td className="px-4 py-3 capitalize text-text-muted">{d.type.replaceAll('-', ' ')}</td>
              <td className="px-4 py-3 text-text">{formatDiscountValue(d)}</td>
              <td className="px-4 py-3 text-end tabular-nums text-text">{d.usageCount}</td>
              <td className="px-4 py-3 text-end tabular-nums text-text-muted">
                {d.usageLimit ?? '∞'}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {d.endsAt ? formatDateShort(d.endsAt) : '—'}
              </td>
              <td className="px-4 py-3">
                <Badge tone={d.isActive ? 'success' : 'neutral'}>
                  {d.isActive ? 'Active' : 'Paused'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminShell>
);

export default DiscountsPage;
