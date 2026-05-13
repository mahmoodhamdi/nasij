import { createServer } from 'node:http';

import { WebSocketServer } from 'ws';

import { parseGatewayEnv } from './config.js';
import { broadcastJson, handleConnection } from './ws.js';

const env = parseGatewayEnv(process.env);

const http = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server: http });

wss.on('connection', (socket, request) => {
  handleConnection(socket, request);
});

http.listen(env.port, () => {
  console.warn(`gateway listening on :${env.port}`);
});

const shutdown = () => {
  broadcastJson(wss, { type: 'server.shutdown' });
  wss.close();
  http.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
