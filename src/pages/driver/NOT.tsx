import { useSocket } from "@/components/provider/SocketProvider";
import { useEffect } from "react";

function Chat() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    socket.on("message", (msg: string) => {
      console.log("📩 New message:", msg);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  return <div>{isConnected ? "🟢 Connected" : "🔴 Disconnected"}</div>;
}

export default Chat;
