import { io } from "socket.io-client";

const socket = io("https://ramble-socket-server.onrender.com", {
  path: "/socket.io",
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
