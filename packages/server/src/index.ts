import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const server = serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server running at http://${info.address}:${info.port}`);
  },
);

const io = new Server(server as HttpServer, {
  serveClient: false,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('error', (err) => {
  console.log(err);
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});
