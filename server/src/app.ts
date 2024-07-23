import { strict } from "assert";
import http, { IncomingMessage } from "http";
import { parse } from "url";
import { Data, WebSocketServer, WebSocket } from "ws";

const server = http.createServer();

const wss = new WebSocketServer({ server });

type client = {
  ws: WebSocket;
  token: string;
};

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

  //received message
  ws.on("message", function message(data: Data) {
    console.log(data.toString());
    const receivedData = JSON.parse(data.toString());
    const client = CLIENTS.filter((client) => client.token === receivedData.to);
    client[0].ws.send(receivedData.message);

    // wss.clients.forEach(function each(client) {
    //   console.log(client);
    // });
  });

  //send to client
  ws.send("From Server");
});

server.listen(3000);
