import WebSocket, { Data } from "ws";
import readline from "readline";
import { createHash } from "crypto";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createToken = (username: string): string => {
  return createHash("sha256").update(username).digest("hex");
};
type message = {
  message: string;
  from: string;
  to: string;
};
rl.question("Username: ", function prompt(input: string) {
  const token = createToken(input);
  const ws = new WebSocket(`ws://localhost:3000/?token=${token}`);
  ws.on("open", function open() {
    console.log("message: ");
    rl.on("line", (input: string) => {
      const targetToken = createToken("user2");
      const message: message = {
        message: input,
        from: token,
        to: targetToken,
      };

      ws.send(Buffer.from(JSON.stringify(message)));
    });
  });

  // recieved message
  ws.on("message", function message(data: Data) {
    console.log("Client: ", data.toString());
  });
});
