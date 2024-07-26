import http, { IncomingMessage } from "http";
import { Duplex } from "stream";
import { parse } from "url";
import { Data, WebSocketServer, WebSocket } from "ws";
import { client } from "./types/client";
import { createPasswordHash, verifyHash } from "./utils/hash";
//TODO: convert http -> https

const server = http.createServer((req, res) => {
  if (req.url === "/login" && req.method === "POST") {
    // Listen for data events to get the request body
    req.on("data", async (body) => {
      const { username, password } = JSON.parse(body.toString());
      const passwordHash = await createPasswordHash(password);
    });

    res.end(JSON.stringify({ message: "server responce" }));
  }
});

const wss = new WebSocketServer({ noServer: true });

const CLIENTS: client[] = [];

//
wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const {
    query: { token },
  } = parse(req.url || "", true);

  console.log("TOKEN: ", token);
  const client: client = {
    ws,
    token: token as string,
  };
  CLIENTS.push(client);
  console.log(CLIENTS);
  //received message
  ws.on("message", function message(data: Data) {
    console.log(data.toString());
    const receivedData = JSON.parse(data.toString());
    const client = CLIENTS.filter((client) => client.token === receivedData.to);
    console.log("CLIENT: ", client);
    client[0]?.ws?.send(receivedData.message);

    // wss.clients.forEach(function each(client) {
    //   console.log(client);
    // });
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

server.listen(3000);
