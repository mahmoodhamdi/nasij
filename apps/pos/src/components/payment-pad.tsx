import { useState } from 'react';

import { Button, Input, Label } from '@nasij/ui';

import { computeCashChange } from '../lib/payment.js';

interface PaymentPadProps {
  totalMinor: number;
  onComplete: (
    result:
      | { method: 'cash'; tenderedMinor: number; changeMinor: number }
      | { method: 'card' },
  ) => void;
  onCancel: () => void;
}

const PRESETS = [50, 100, 200, 500, 1000];

export const PaymentPad = ({ totalMinor, onComplete, onCancel }: PaymentPadProps) => {
  const [tendered, setTendered] = useState('');
  const tenderedMinor = Math.round(Number(tendered) * 100);
  let preview: { changeMinor: number } | { error: string } = { error: '' };
  if (tendered !== '') {
    try {
      preview = computeCashChange(totalMinor, tenderedMinor);
    } catch (error) {
      preview = { error: error instanceof Error ? error.message : String(error) };
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-6">
      <header>
        <h2 className="font-display-latin text-2xl text-text">Payment</h2>
        <p className="mt-1 text-text-muted">Total: EGP {(totalMinor / 100).toFixed(2)}</p>
      </header>

      <section className="flex flex-col gap-3">
        <Label htmlFor="tendered">Cash tendered (EGP)</Label>
        <Input
          id="tendered"
          type="number"
          inputMode="decimal"
          value={tendered}
          onChange={(e) => setTendered(e.target.value)}
          step="0.01"
          min={0}
        />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTendered(String(preset))}
            >
              {preset}
            </Button>
          ))}
        </div>
        {'changeMinor' in preview ? (
          <p className="text-sm text-text">
            Change due: <span className="font-medium">EGP {(preview.changeMinor / 100).toFixed(2)}</span>
          </p>
        ) : preview.error ? (
          <p className="text-sm text-danger">{preview.error}</p>
        ) : null}
      </section>

      <footer className="flex flex-col gap-2 pt-2">
        <Button
          size="lg"
          disabled={!('changeMinor' in preview)}
          onClick={() => {
            if ('changeMinor' in preview) {
              onComplete({ method: 'cash', tenderedMinor, changeMinor: preview.changeMinor });
            }
          }}
        >
          Take cash
        </Button>
        <Button size="lg" variant="outline" onClick={() => onComplete({ method: 'card' })}>
          Charge card
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </footer>
    </div>
  );
};
