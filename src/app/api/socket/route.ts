export const dynamic = "force-dynamic";

import { Server } from "socket.io";
import type { NextRequest } from "next/server";
import type { Socket } from "socket.io";

type ChatSocket = Socket & {
  partner?: ChatSocket;
};

export async function GET(req: NextRequest) {
  if (!(globalThis as any).io) {
    console.log("✅ Initializing socket server...");

    const io = new Server({
      path: "/api/socket",
    });

    (globalThis as any).io = io;

    const usersQueue: ChatSocket[] = [];

    io.on("connection", (socket: ChatSocket) => {
      console.log("✅ User connected:", socket.id);

      usersQueue.push(socket);

      if (usersQueue.length >= 2) {
        const [user1, user2] = usersQueue.splice(0, 2);
        user1.partner = user2;
        user2.partner = user1;

        user1.emit("partnerFound");
        user2.emit("partnerFound");

        user1.on("message", (msg) => user2.emit("message", msg));
        user2.on("message", (msg) => user1.emit("message", msg));
      }

      socket.on("disconnect", () => {
        console.log("⚠️ User disconnected:", socket.id);
        const index = usersQueue.indexOf(socket);
        if (index !== -1) usersQueue.splice(index, 1);
        if (socket.partner) {
          socket.partner.emit("partnerLeft");
          socket.partner.partner = undefined;
        }
      });
    });
  }

  return new Response("Socket server running");
}
