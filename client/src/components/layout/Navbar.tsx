import { useEffect, useState } from "react";
import { getSocket } from "@/hooks/useSocket";

const Navbar = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    setConnected(socket.connected);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 bg-zinc-950/80 backdrop-blur z-20">
      <span className="text-lg font-semibold tracking-tight">
        Research<span className="text-emerald-400">Mind</span>
      </span>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
          }`}
        />
        {connected ? "Live" : "Reconnecting..."}
      </div>
    </header>
  );
};

export default Navbar;