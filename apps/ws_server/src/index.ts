import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { config } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import "dotenv/config";

const wss = new WebSocketServer({
  port: process.env.PORT as number | undefined,
});

interface decodedPayload {
  id: string;
  username: string;
}

async function verifyUser(token: string) {
  try {
    const decodedPayload = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    const isUserValid = await prismaClient.users.findFirst({
      where: {
        id: (decodedPayload as decodedPayload)?.id,
        username: (decodedPayload as decodedPayload)?.username,
      },
    });
    return decodedPayload;
  } catch (error) {
    console.log(
      "------------------------Error while decoding your token-----------------------\n",
      error
    );
  }
}

wss.on("connection", async (socket, request) => {
  console.log(`WS SERVER running on ws://localhost:${process.env.PORT}`);
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    socket.send("No token sent");
    socket.close();
    return;
  }

  const data = await verifyUser(token);
  if (!data) {
    console.log("invalid token");
    socket.close();
    return;
  }
  socket.on("message", function meassage(data) {
    socket.send("Hey there");
  });
});
