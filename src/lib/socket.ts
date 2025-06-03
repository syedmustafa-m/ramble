import io from "socket.io-client";

console.log("🌐 Connecting to:", process.env.NEXT_PUBLIC_SOCKET_URL || "../../../ramble-socket-server/socket-sever.js");

const socket = io("http://192.168.18.43:3001", {
  path: "/socket.io",
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
