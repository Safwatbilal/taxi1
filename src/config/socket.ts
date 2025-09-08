import { io } from "socket.io-client";

const SOCKET_URL = "https://taxi-szt5.onrender.com/";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
  forceNew: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🟢 Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("❌ Connection Error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.log("🔄❌ Reconnection Error:", error.message);
});
