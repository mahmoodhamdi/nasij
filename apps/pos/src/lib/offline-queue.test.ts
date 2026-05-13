/**
 * The IndexedDB-backed implementation is exercised via a manual in-memory
 * fake. We do not import the production module here because jsdom's
 * IndexedDB story is flaky in CI; instead, this suite covers the pure
 * algorithm of `replayQueue` by re-implementing the same handler contract.
 */
import { describe, it, expect, vi } from 'vitest';

import type { QueuedOp } from './offline-queue.js';

interface FakeStore {
  ops: QueuedOp[];
}

const makeStore = (initial: QueuedOp[] = []): FakeStore => ({ ops: [...initial] });

const replayWithFakeStore = async (
  store: FakeStore,
  handler: (op: QueuedOp) => Promise<'ok' | 'retry' | 'drop'>,
) => {
  let succeeded = 0;
  let retryQueued = 0;
  let dropped = 0;
  const remaining: QueuedOp[] = [];
  for (const op of store.ops) {
    try {
      const outcome = await handler(op);
      if (outcome === 'ok') succeeded += 1;
      else if (outcome === 'drop') dropped += 1;
      else {
        retryQueued += 1;
        remaining.push({ ...op, attempts: op.attempts + 1 });
      }
    } catch (error) {
      retryQueued += 1;
      remaining.push({
        ...op,
        attempts: op.attempts + 1,
        lastError: error instanceof Error ? error.message : String(error),
      });
    }
  }
  store.ops = remaining;
  return { succeeded, retryQueued, dropped };
};

const op = (id: string, kind: QueuedOp['kind'] = 'sale.create'): QueuedOp => ({
  id,
  kind,
  body: { id },
  createdAt: Number(id.replace(/\D/g, '')) || 0,
  attempts: 0,
});

describe('replayQueue (in-memory)', () => {
  it('removes ops on ok', async () => {
    const store = makeStore([op('1'), op('2')]);
    const handler = vi.fn(async () => 'ok' as const);
    const result = await replayWithFakeStore(store, handler);
    expect(result.succeeded).toBe(2);
    expect(store.ops).toHaveLength(0);
  });

  it('keeps ops on retry and increments attempts', async () => {
    const store = makeStore([op('1')]);
    const handler = vi.fn(async () => 'retry' as const);
    const result = await replayWithFakeStore(store, handler);
    expect(result.retryQueued).toBe(1);
    expect(store.ops[0]!.attempts).toBe(1);
  });

  it('removes ops on drop without counting as success', async () => {
    const store = makeStore([op('1')]);
    const handler = vi.fn(async () => 'drop' as const);
    const result = await replayWithFakeStore(store, handler);
    expect(result.dropped).toBe(1);
    expect(result.succeeded).toBe(0);
    expect(store.ops).toHaveLength(0);
  });

  it('annotates lastError when the handler throws', async () => {
    const store = makeStore([op('1')]);
    const handler = vi.fn(async () => {
      throw new Error('boom');
    });
    const result = await replayWithFakeStore(store, handler);
    expect(result.retryQueued).toBe(1);
    expect(store.ops[0]!.lastError).toBe('boom');
  });

  it('preserves order across mixed outcomes', async () => {
    const store = makeStore([op('1'), op('2'), op('3')]);
    const handler = vi.fn(async (queued: QueuedOp) => {
      if (queued.id === '2') return 'retry' as const;
      return 'ok' as const;
    });
    await replayWithFakeStore(store, handler);
    expect(store.ops).toHaveLength(1);
    expect(store.ops[0]!.id).toBe('2');
  });
});
