import { z } from 'zod';

const Env = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535).default(54_000),
  REDIS_URL: z.string().url().default('redis://localhost:56379'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),
});

export type GatewayEnv = {
  port: number;
  redisUrl: string;
  corsOrigins: readonly string[];
};

export const parseGatewayEnv = (input: NodeJS.ProcessEnv): GatewayEnv => {
  const parsed = Env.parse(input);
  return {
    port: parsed.PORT,
    redisUrl: parsed.REDIS_URL,
    corsOrigins: parsed.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
  };
};
