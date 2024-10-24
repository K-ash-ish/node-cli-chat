import http, { IncomingMessage } from "http";
import { Duplex } from "stream";
import { parse } from "url";
import { WebSocketServer, WebSocket, Data } from "ws";
import { createPasswordHash } from "./utils/hash";
import dotenv from "dotenv";
import { ApiResponse } from "./utils/ApiResponse";
import { signJWT, verifyJWT } from "./utils/verifyJwt";
dotenv.config();

//TODO: convert http -> https
const CLIENTS: Map<string, WebSocket> = new Map();

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/login" && req.method === "POST") {
    let data, token;
    // Listen for data events to get the request body
    req.on("data", async (body) => {
      const { username, password } = JSON.parse(body.toString());
      const passwordHash = await createPasswordHash(password);
      data = {
        id: Math.floor(Math.random() * 100).toString(),
        username,
      };
      token = signJWT(data);
      res.end(JSON.stringify(new ApiResponse(200, "Login success", token)));
    });
  }
  if (req.url === "/list-users" && req.method === "GET") {
    const users = Array.from(CLIENTS.keys()).map((name) => {
      return name;
    });

    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(new ApiResponse(100, "Current online users", users))
    );
  }
  if (req.url === "/disconnect-client" && req.method === "POST") {
    req.on("data", async (body) => {
      const { username } = JSON.parse(body.toString());
      const client = CLIENTS.get(username);
      CLIENTS.delete(username);
      client?.close();
      console.log(
        `Remaining Clients: ${Array.from(CLIENTS.keys())} ${CLIENTS.size}`
      );
      if (client?.CLOSED) {
        console.log("User diconnected: ", username);
        res.end(
          JSON.stringify(new ApiResponse(100, "Connection closed successfully"))
        );
      }
    });
  }
});

const wss = new WebSocketServer({ noServer: true });

//
wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const {
    query: { token },
  } = parse(req.url ?? "", true);
  const { username } = verifyJWT(token as string);
  CLIENTS.set(username, ws);

  //received message
  ws.on("message", function message(data: Data) {
    const { to } = JSON.parse(data.toString());
    const recipientWs = CLIENTS.get(to);
    console.log("ONMESSAGE: ", Array.from(CLIENTS.keys()));

    recipientWs?.send(data);
  });

  ws.on("close", () => {
    ws.close();
    console.log("Connection closed: ", CLIENTS.size);
  });
});

server.on(
  "upgrade",
  function upgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
    console.log("UPGRADE: \n");
    wss.handleUpgrade(request, socket, head, function upgrade(ws) {
      wss.emit("connection", ws, request);
    });
  }
);

// server.listen(process.env.PORT ?? 8000, process.argv[2]);
const PORT = process.env.PORT ?? 3000;
server.listen(0, "0.0.0.0", () => {
  console.log("Server started at port : ", process.env.PORT, 3000);
});
