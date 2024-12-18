import { Data, WebSocket } from "ws";
import { Message } from "./types/message";
import { WS_URL } from "./constant";

export class WSConnection {
  private readonly ws: WebSocket;
  private readonly token: string;
  constructor(token: string) {
    this.token = token;
    this.ws = new WebSocket(`${WS_URL}?token=${this.token}`);
  }

  connect(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      this.ws.on("open", () => {
        console.log("Websocket connected");
        resolve(this.ws);
      });
      this.ws.on("error", () => {
        console.error();
        reject(new Error("Something went wrong!"));
      });
    });
  }
  subscribeToMessage(): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.ws.on("message", function message(data: Data) {
        const { from, message } = JSON.parse(data.toString());
        console.log(`${from}: ${message} \n`);
        // resolve(data);
      });
    });
  }
  sendMessage(message: Message) {
    this.ws.send(Buffer.from(JSON.stringify(message)));
  }
}
