import { Server } from "socket.io";

export default function initializeSocket(io: Server) {
  io.on("connection", (socket) => {

    console.log("🟢 Connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });

  });
}