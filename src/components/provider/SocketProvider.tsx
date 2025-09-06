import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socket } from "../../config/socket";

interface SocketContextType {
  socket: Socket;
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  retryConnection: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("connecting");

  useEffect(() => {
    // التحقق من الحالة الأولية
    if (socket.connected) {
      setIsConnected(true);
      setConnectionStatus("connected");
    }

    function onConnect() {
      console.log("✅ Socket connected with id:", socket.id);
      setIsConnected(true);
      setConnectionStatus("connected");
    }

    function onDisconnect(reason: string) {
      console.log("❌ Socket disconnected, reason:", reason);
      setIsConnected(false);
      setConnectionStatus("disconnected");
    }

    function onConnectError(error: Error) {
      console.log("🔥 Socket connection error:", error.message);
      setIsConnected(false);
      setConnectionStatus("error");
    }

    function onConnecting() {
      console.log("🔄 Socket connecting...");
      setConnectionStatus("connecting");
    }

    function onReconnect(attemptNumber: number) {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
      setConnectionStatus("connected");
    }

    // إضافة المستمعين
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("reconnect", onReconnect);

    // محاولة الاتصال إذا لم يكن متصل
    if (!socket.connected) {
      console.log("🚀 Attempting to connect socket...");
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("reconnect", onReconnect);
    };
  }, []);

  const retryConnection = () => {
    console.log("🔄 Manual reconnection attempt...");
    setConnectionStatus("connecting");
    socket.disconnect();
    setTimeout(() => {
      socket.connect();
    }, 1000);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        connectionStatus,
        retryConnection,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
