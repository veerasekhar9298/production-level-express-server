import type { IncomingMessage } from 'http';

interface SocketRequest extends IncomingMessage {
  user?: any;
}
// import type { Request, Response, NextFunction } from 'express';
// import createError from 'http-errors';
import ioSessionHandler from 'io-session-handler';
// import type { Socket, ExtendedError } from 'socket.io';
import { Server } from 'socket.io';

import env from '../config/env.json' with { type: 'json' };

const { WS_PORT } = env;

const wsPort = WS_PORT || 8000;
// convert a connect middleware to a Socket.IO middleware
// const wrap =
//   (middleware: (req: Request, res: Response, next: NextFunction) => void) =>
//   (socket: Socket, next: (err?: ExtendedError) => void) => {
//     socket.request.headers.authorization = socket.handshake.auth?.authorization;

//     middleware(socket.request as Request, {} as Response, (err?: any) => {
//       if (err) {
//         return next(err); // pass error to socket
//       }
//       next();
//     });
//   };

const frontEndWebsocket = new Server({
  allowEIO3: true, // enable compatibility with Socket.IO v2 clients
  cors: {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Authorization'],
  },
  maxHttpBufferSize: 1e8, // 100MB
});

frontEndWebsocket.listen(wsPort);
console.log(`🚀 WebSocket server is running on port ${wsPort}`);

// frontEndWebsocket.use(wrap(passport.initialize()));
// this will extract the JWT token from the header & set the user in the request
// frontEndWebsocket.use(wrap(passport.authenticate('jwt', { session: false, failWithError: true })));

frontEndWebsocket.use((socket, next) => {
  const req = socket.request as SocketRequest;

  if (req.user) {
    next();
  } else {
    // next(createError(401));
    next();
  }
});

frontEndWebsocket.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// this will maintain the socket id for each token passed from client in the query

const sessionHandler = ioSessionHandler.from(frontEndWebsocket);

export { frontEndWebsocket, sessionHandler };
