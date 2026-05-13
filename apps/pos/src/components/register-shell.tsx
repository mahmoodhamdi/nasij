import { useState } from 'react';

import { Button } from '@nasij/ui';

import { addLine, removeLine, type Line, summarize } from '../lib/cart.js';

interface RegisterShellProps {
  onSignOut: () => void;
}

const demoProducts = [
  { sku: 'NSJ-KFT-AMB-M-AMBER', titleEn: 'Amber kaftan (M)', unitPriceMinor: 240_000 },
  { sku: 'NSJ-TRS-LIN-M-STONE', titleEn: 'Linen trousers (M)', unitPriceMinor: 195_000 },
  { sku: 'NSJ-SHR-OVR-S-SAGE', titleEn: 'Oversized shirt (S)', unitPriceMinor: 165_000 },
] as const;

export const RegisterShell = ({ onSignOut }: RegisterShellProps) => {
  const [lines, setLines] = useState<Line[]>([]);
  const totals = summarize(lines, { taxRateBasisPoints: 1400 });

  return (
    <main className="grid min-h-dvh grid-cols-1 gap-4 bg-surface-sunken p-4 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl bg-surface-raised p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="font-display-latin text-2xl text-text">Register</h1>
          <Button size="sm" variant="ghost" onClick={onSignOut}>
            Sign out
          </Button>
        </header>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {demoProducts.map((p) => (
            <button
              key={p.sku}
              type="button"
              className="rounded-lg border border-border bg-surface p-4 text-start hover:border-accent"
              onClick={() => setLines((prev) => addLine(prev, p))}
            >
              <span className="block text-sm font-medium text-text">{p.titleEn}</span>
              <span className="mt-1 block text-xs text-text-muted">
                EGP {(p.unitPriceMinor / 100).toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      </section>
      <aside className="rounded-2xl bg-surface-raised p-6">
        <h2 className="mb-4 font-display-latin text-xl text-text">Cart</h2>
        {lines.length === 0 ? (
          <p className="text-sm text-text-muted">No items yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lines.map((line) => (
              <li key={line.sku} className="flex items-center justify-between text-sm">
                <span>
                  {line.quantity} × {line.titleEn}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLines((prev) => removeLine(prev, line.sku))}
                  aria-label={`Remove ${line.titleEn}`}
                >
                  ✕
                </Button>
              </li>
            ))}
          </ul>
        )}
        <dl className="mt-6 flex flex-col gap-1 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>EGP {(totals.subtotalMinor / 100).toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>EGP {(totals.taxMinor / 100).toFixed(2)}</dd>
          </div>
          <div className="mt-2 flex justify-between font-medium text-base">
            <dt>Total</dt>
            <dd>EGP {(totals.totalMinor / 100).toFixed(2)}</dd>
          </div>
        </dl>
      </aside>
    </main>
  );
};
