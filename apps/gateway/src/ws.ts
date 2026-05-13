import type { IncomingMessage } from 'node:http';

import type { WebSocket, WebSocketServer } from 'ws';

export interface ClientMessage {
  type: string;
  [key: string]: unknown;
}

export const broadcastJson = (wss: WebSocketServer, payload: unknown): number => {
  const message = JSON.stringify(payload);
  let sent = 0;
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(message);
      sent += 1;
    }
  }
  return sent;
};

export const handleMessage = (raw: string): ClientMessage | null => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;
    if (typeof candidate['type'] !== 'string') return null;
    return candidate as ClientMessage;
  } catch {
    return null;
  }
};

export const handleConnection = (socket: WebSocket, _request: IncomingMessage): void => {
  socket.send(JSON.stringify({ type: 'hello', ts: Date.now() }));
  socket.on('message', (data) => {
    const message = handleMessage(data.toString());
    if (!message) {
      socket.send(JSON.stringify({ type: 'error', code: 'invalid-message' }));
      return;
    }
    if (message.type === 'ping') {
      socket.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
    }
  });
};
