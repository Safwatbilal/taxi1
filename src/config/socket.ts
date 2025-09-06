// ./config/socket.js
import { io } from "socket.io-client";

const SOCKET_URL =
  "https://taxi-git-master-ahmad-alnajjars-projects.vercel.app";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
  forceNew: true,
  transports: ["websocket", "polling"],

  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },

  withCredentials: false,
  upgrade: true,
});

socket.on("connect", () => {
  console.log("🟢 Socket.IO Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket.IO Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("❌ Socket.IO Connection Error:", error.message);
  console.log("Error details:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Socket.IO Reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.log("🔄❌ Socket.IO Reconnection Error:", error.message);
});

socket.connect();
