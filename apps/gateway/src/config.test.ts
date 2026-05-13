import { describe, it, expect } from 'vitest';

import { parseGatewayEnv } from './config.js';

describe('parseGatewayEnv', () => {
  it('returns defaults when env is empty', () => {
    const cfg = parseGatewayEnv({});
    expect(cfg.port).toBe(54_000);
    expect(cfg.redisUrl).toBe('redis://localhost:56379');
    expect(cfg.corsOrigins.length).toBeGreaterThan(0);
  });

  it('coerces PORT to a number', () => {
    expect(parseGatewayEnv({ PORT: '8080' }).port).toBe(8080);
  });

  it('rejects PORT out of range', () => {
    expect(() => parseGatewayEnv({ PORT: '0' })).toThrow();
    expect(() => parseGatewayEnv({ PORT: '99999' })).toThrow();
  });

  it('splits CORS_ORIGINS on commas', () => {
    const cfg = parseGatewayEnv({ CORS_ORIGINS: 'a, b ,c' });
    expect(cfg.corsOrigins).toEqual(['a', 'b', 'c']);
  });

  it('drops empty CORS_ORIGINS', () => {
    expect(parseGatewayEnv({ CORS_ORIGINS: ' , , ' }).corsOrigins).toEqual([]);
  });

  it('rejects invalid REDIS_URL', () => {
    expect(() => parseGatewayEnv({ REDIS_URL: 'not-a-url' })).toThrow();
  });
});
