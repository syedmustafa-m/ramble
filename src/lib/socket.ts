import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  path: "/socket.io",
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
