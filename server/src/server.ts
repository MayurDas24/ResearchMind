//server/src/server.ts
import { createServer } from "http";
import { Server } from "socket.io";

import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

import initializeSocket from "./sockets/socket";
import { setIO } from "./services/socket";

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Create HTTP server
  const httpServer = createServer(app);

  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  // Initialize Socket.IO
  setIO(io);
  initializeSocket(io);

  // Start server
  httpServer.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
};

startServer();