import { WSConnection } from "./wsConnection";
import { promptHandler } from "./promptHandler";
import { auth } from "./auth";
import { trimPrompt } from "./utils/trimPrompt";
import { commandHandler } from "./commandHandler";
import { UserSession } from "./UserSession";
import { URL } from "./constant";
export async function getUsers() {
  const users = await fetch(`${URL}list-users`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => res.data);
  users.forEach((user: string) => {
    console.log(`• ${user} \n`);
  });
}

export async function chatWithUser(client: WSConnection | null) {
  const userPrompt = await promptHandler("Type username (/back to exit): ");
  const user = UserSession.getInstance().currentUser;
  let isChatting = true;
  if (trimPrompt(userPrompt) === "back") {
    isChatting = false;
    console.log(`\n back \n`);
    commandHandler();
    return;
  }
  while (isChatting) {
    const message = await promptHandler(`${user}: `);
    if (trimPrompt(message) === "back") {
      isChatting = false;
      console.log(`\n back \n`);
      commandHandler();
      return;
    }
    if (client)
      client.sendMessage({
        from: user,
        to: userPrompt,
        message,
      });
  }
}

export async function disconnectClient() {
  const user = UserSession.getInstance().currentUser;
  const res = await fetch(`${URL}disconnect-client`, {
    method: "POST",
    body: JSON.stringify({ username: user }),
  })
    .then((res) => res.json())
    .then((res) => res);
  if (res.success) {
    console.log("\n" + res.message);
    console.log("BYE BYE!!");
    process.exit(0);
  }
}
async function start(action: string) {
  switch (trimPrompt(action)) {
    case "signup":
      return await auth("signup");
    case "login":
      return await auth("login");
    case "exit":
      process.exit(0);
    default:
      break;
  }
}
async function app() {
  console.log("Welcome to the server! \n");
  console.log("/signup /login /exit \n");
  const userAction = await promptHandler("Action: ");
  const token = await start(userAction);

  if (token) {
    const user = UserSession.getInstance();
    user.connection = new WSConnection(token);
    user.connection.subscribeToMessage();
    commandHandler();
  }
}
process.once("SIGINT", disconnectClient);
app();
