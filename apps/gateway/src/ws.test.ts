import { EventEmitter } from 'node:events';

import { describe, it, expect, vi } from 'vitest';

import { broadcastJson, handleConnection, handleMessage } from './ws.js';

describe('handleMessage', () => {
  it('parses a well-formed message', () => {
    expect(handleMessage('{"type":"ping"}')).toEqual({ type: 'ping' });
  });

  it('rejects invalid JSON', () => {
    expect(handleMessage('not-json')).toBe(null);
  });

  it('rejects non-object payloads', () => {
    expect(handleMessage('null')).toBe(null);
    expect(handleMessage('"a string"')).toBe(null);
    expect(handleMessage('42')).toBe(null);
  });

  it('rejects objects without a string type', () => {
    expect(handleMessage('{"foo":"bar"}')).toBe(null);
    expect(handleMessage('{"type":42}')).toBe(null);
  });
});

describe('broadcastJson', () => {
  it('sends to ready clients only', () => {
    const a = { readyState: 1, send: vi.fn() };
    const b = { readyState: 0, send: vi.fn() };
    const wss = { clients: new Set([a, b]) } as unknown as Parameters<typeof broadcastJson>[0];
    expect(broadcastJson(wss, { ok: true })).toBe(1);
    expect(a.send).toHaveBeenCalledOnce();
    expect(b.send).not.toHaveBeenCalled();
  });
});

describe('handleConnection', () => {
  type FakeSocket = EventEmitter & { send: ReturnType<typeof vi.fn> };
  const newSocket = (): FakeSocket => Object.assign(new EventEmitter(), { send: vi.fn() });

  it('greets the client', () => {
    const socket = newSocket();
    handleConnection(socket as unknown as Parameters<typeof handleConnection>[0], {} as never);
    expect(socket.send).toHaveBeenCalledOnce();
    expect(JSON.parse(socket.send.mock.calls[0]![0] as string).type).toBe('hello');
  });

  it('responds to ping with pong', () => {
    const socket = newSocket();
    handleConnection(socket as unknown as Parameters<typeof handleConnection>[0], {} as never);
    socket.emit('message', Buffer.from('{"type":"ping"}'));
    const replies = socket.send.mock.calls.map((c) => JSON.parse(c[0] as string).type);
    expect(replies).toContain('pong');
  });

  it('sends error on invalid message', () => {
    const socket = newSocket();
    handleConnection(socket as unknown as Parameters<typeof handleConnection>[0], {} as never);
    socket.emit('message', Buffer.from('not-json'));
    const replies = socket.send.mock.calls.map((c) => JSON.parse(c[0] as string).type);
    expect(replies).toContain('error');
  });

  it('does not reply when the message type is unknown', () => {
    const socket = newSocket();
    handleConnection(socket as unknown as Parameters<typeof handleConnection>[0], {} as never);
    const before = socket.send.mock.calls.length;
    socket.emit('message', Buffer.from('{"type":"unknown"}'));
    expect(socket.send.mock.calls.length).toBe(before);
  });
});
