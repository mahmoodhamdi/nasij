import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema/index.js';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export interface ClientOptions {
  url: string;
  maxConnections?: number;
}

export const createClient = ({ url, maxConnections = 10 }: ClientOptions): Database => {
  const sql = postgres(url, { max: maxConnections, prepare: false });
  return drizzle(sql, { schema });
};
