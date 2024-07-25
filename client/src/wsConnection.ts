import { Data, WebSocket } from "ws";
import { createToken } from "./utils/token";

const token = createToken("someValue");
const ws = new WebSocket(`ws://localhost:3000/?token=${token}`);

console.log(token);
ws.on("open", function open() {
  console.log("message: ");
  //   rl.on("line", (input: string) => {
  //     //change it to current ws user session
  //     const targetToken = createToken("");
  //     const message: Message = {
  //       message: input,
  //       from: token,
  //       to: targetToken,
  //     };

  // ws.send(Buffer.from(JSON.stringify(message)));
});

// recieved message
ws.on("message", function message(data: Data) {
  console.log("Client: ", data.toString());
});
