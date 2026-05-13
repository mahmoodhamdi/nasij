import { type IDBPDatabase, openDB } from 'idb';

/**
 * Offline mutation queue for the POS app. Mutations queued here while the
 * device is offline (or the API is unreachable) are replayed in order when
 * connectivity returns. Each queued op is identified by a monotonically
 * increasing key and carries an idempotency hint so the server can reject
 * replays of an already-accepted op.
 */

export type QueuedOpKind = 'sale.create' | 'sale.void' | 'sale.refund' | 'customer.upsert';

export interface QueuedOp<TBody = unknown> {
  id: string;
  kind: QueuedOpKind;
  body: TBody;
  createdAt: number;
  attempts: number;
  lastError?: string;
}

const DB_NAME = 'nasij-pos';
const STORE = 'queue';

const openQueue = (): Promise<IDBPDatabase> =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    },
  });

export const enqueueOp = async (op: QueuedOp): Promise<void> => {
  const db = await openQueue();
  await db.put(STORE, op);
  db.close();
};

export const listOps = async (): Promise<QueuedOp[]> => {
  const db = await openQueue();
  const all = (await db.getAllFromIndex(STORE, 'createdAt')) as QueuedOp[];
  db.close();
  return all;
};

export const removeOp = async (id: string): Promise<void> => {
  const db = await openQueue();
  await db.delete(STORE, id);
  db.close();
};

export const updateOpAfterFailure = async (id: string, error: string): Promise<void> => {
  const db = await openQueue();
  const existing = (await db.get(STORE, id)) as QueuedOp | undefined;
  if (existing) {
    await db.put(STORE, {
      ...existing,
      attempts: existing.attempts + 1,
      lastError: error,
    });
  }
  db.close();
};

export interface ReplayHandler {
  (op: QueuedOp): Promise<'ok' | 'retry' | 'drop'>;
}

export interface ReplayResult {
  succeeded: number;
  retryQueued: number;
  dropped: number;
}

/**
 * Replay queued ops in order. The handler returns one of:
 *  - 'ok' → op is removed from the queue.
 *  - 'retry' → op is kept; attempts incremented, lastError annotated by caller.
 *  - 'drop' → op is removed without success counting (e.g. dead-letter).
 */
export const replayQueue = async (handler: ReplayHandler): Promise<ReplayResult> => {
  const ops = await listOps();
  let succeeded = 0;
  let retryQueued = 0;
  let dropped = 0;
  for (const op of ops) {
    let outcome: 'ok' | 'retry' | 'drop';
    try {
      outcome = await handler(op);
    } catch (error) {
      await updateOpAfterFailure(op.id, error instanceof Error ? error.message : String(error));
      retryQueued += 1;
      continue;
    }
    if (outcome === 'ok') {
      await removeOp(op.id);
      succeeded += 1;
    } else if (outcome === 'drop') {
      await removeOp(op.id);
      dropped += 1;
    } else {
      retryQueued += 1;
    }
  }
  return { succeeded, retryQueued, dropped };
};
