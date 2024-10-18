import { WebSocket } from "ws";

export type ClientInfo = {
  ws: WebSocket;
  username: string;
};
