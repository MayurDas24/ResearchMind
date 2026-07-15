//client/src/hooks/usesocket.ts
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      withCredentials: true,
    });
  }
  return socket;
};

const useSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const s = getSocket();

    const invalidateResearch = () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
    };

    s.on("job:update", invalidateResearch);
    s.on("job:completed", invalidateResearch);
    s.on("job:failed", invalidateResearch);

    return () => {
      s.off("job:update", invalidateResearch);
      s.off("job:completed", invalidateResearch);
      s.off("job:failed", invalidateResearch);
    };
  }, [queryClient]);
};

export default useSocket;