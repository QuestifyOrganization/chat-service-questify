const express = require('express');
const http = require('http');
const { createMainRouter } = require('./routes/mainRouter');
const SocketService = require('./services/socketService');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

const socketService = new SocketService(server);

server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on http://${host}:${port}`);
});
