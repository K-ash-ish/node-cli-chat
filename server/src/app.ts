import http from "http";
import { parse } from "url";
import { WebSocketServer } from "ws";

const server = http.createServer();

const wss = new WebSocketServer({ server });

//
wss.on("connection", (ws, req) => {
    console.log("Client connected");
    const id = req.headers["sec-websocket-key"];
    console.log("ID: ", id);
    console.log("Req headers: ", req.headers);
    const {
        query: { token },
    } = parse(req.url, true);
    console.log("TOKEN: ", token);

    //received message
    ws.on("message", function message(data) {
        wss.clients.forEach(function each(client) {});
        console.log("Recieved: ", data);
    });

    //send to client
    ws.send("Something");
});

server.listen(3000);
