import type { Database } from '@nasij/db';

export interface SessionInfo {
  id: string;
  subjectId: string;
  subjectKind: 'user' | 'customer';
  role: string;
  expiresAt: Date;
}

export interface TrpcContext {
  db: Database;
  session: SessionInfo | null;
  requestId: string;
  ipAddress: string | null;
  userAgent: string | null;
  locale: 'ar' | 'en';
}

export interface CreateTrpcContextOptions {
  db: Database;
  session: SessionInfo | null;
  requestId?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  locale?: 'ar' | 'en';
}

export const createTrpcContext = (opts: CreateTrpcContextOptions): TrpcContext => ({
  db: opts.db,
  session: opts.session,
  requestId: opts.requestId ?? crypto.randomUUID(),
  ipAddress: opts.ipAddress ?? null,
  userAgent: opts.userAgent ?? null,
  locale: opts.locale ?? 'ar',
});
