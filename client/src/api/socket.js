import { io } from "socket.io-client";
import parser from "socket.io-msgpack-parser";

const BACKEND_URL = "http://localhost:8080";

export const socket = io(BACKEND_URL, {
  parser,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  autoConnect: true
});

// Add event listeners for connection status
socket.on("connect", () => {
  console.log("Connected to server:", BACKEND_URL);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from server:", reason);
});

// Handle reconnection
socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("Attempting to reconnect...", attemptNumber);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Reconnected to server after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("Reconnection error:", error.message);
});

socket.on("reconnect_failed", () => {
  console.error("Failed to reconnect to server");
});