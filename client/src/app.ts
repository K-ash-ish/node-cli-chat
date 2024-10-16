import readline from "readline";
import { createToken } from "./utils/token";
import { WSConnection } from "./wsConnection";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">",
});
function promptHandler(query: string): Promise<string> {
  return new Promise(
    (resolve: (value: string | PromiseLike<string>) => void) => {
      rl.question(query, function prompt(value: string) {
        resolve(value);
      });
    }
  );
}
async function auth(type: string): Promise<string> {
  let username: string, password: string, confirmation: string;
  username = await promptHandler("username: ");
  password = await promptHandler("password: ");
  const authType = type === "login" ? "login" : "signup";
  const response = await fetch(`http://localhost:3000/${authType}`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => res);
  if (!response.success) {
    throw new Error("Login failed");
  }
  console.log(response);
  return response.token;
}
async function app() {
  const token = await auth("login");
  const client = new WSConnection(token);
  await client.connect();

  client.sendMessage({ from: "user1", to: "user2", message: "hello world" });
  client.subscribeToMessage();
}

app();
