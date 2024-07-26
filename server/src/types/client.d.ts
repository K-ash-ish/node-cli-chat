import { WebSocket } from "ws";

export type client = {
  ws: WebSocket;
  token: string;
};
