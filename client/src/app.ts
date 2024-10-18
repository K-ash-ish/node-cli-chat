import readline from "readline";
import { createToken } from "./utils/token";
import { WSConnection } from "./wsConnection";

let CURRENT_USER: string;

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
  CURRENT_USER = username;
  return response.data;
}
async function getUsers(token: string) {
  const users = await fetch(`http://localhost:3000/list-users`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => res.data);
  console.log(users);
  // users.foreach((user: string) => {
  //   console.log(`• ${user}`);
  // });
}
async function sendMessageToUser(
  client: WSConnection,
  message: string,
  CURRENT_USER: string,
  userPrompt: string
) {
  client.sendMessage({
    from: CURRENT_USER,
    to: userPrompt,
    message,
  });
}

async function chatWithUser(client: WSConnection) {
  const userPrompt = await promptHandler("Type username (/back to exit): ");
  let isChatting = true;
  if (trimPrompt(userPrompt) === "back") {
    isChatting = false;
    // commandHandler();
    return;
  }
  while (isChatting) {
    const message = await promptHandler(`${CURRENT_USER}: `);
    sendMessageToUser(client, message, CURRENT_USER, userPrompt);
  }
}
function commandHandler() {
  console.log("/list_users /chatrooms /createroom /back /chat");
}
function trimPrompt(prompt: string) {
  return prompt.trim().slice(1);
}
async function app() {
  let command;
  const token = await auth("login");
  if (token) {
    console.log("Login successfull");
    commandHandler();
    const currentUser = new WSConnection(token);
    const ws = await currentUser.connect();

    currentUser.subscribeToMessage();
    while (true) {
      command = await promptHandler("command: ");
      command = trimPrompt(command);

      switch (command) {
        case "list_users":
          getUsers(token);
          break;
        case "exit":
          ws.close();
          break;
        case "chat":
          chatWithUser(currentUser);
          break;
        default:
          break;
      }
    }
  }
}

app();
