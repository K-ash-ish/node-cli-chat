import { chatWithUser, disconnectClient, getUsers } from "./app";
import { promptHandler } from "./promptHandler";
import { UserSession } from "./UserSession";
import { trimPrompt } from "./utils/trimPrompt";

export async function commandHandler() {
  console.log("/list_users /chatrooms /createroom /chat /back /exit \n");
  let continuePrompt = true;
  const userConnection = UserSession.getInstance().connection;
  while (continuePrompt) {
    let command = await promptHandler("command: ");
    command = trimPrompt(command);

    switch (command) {
      case "list_users":
        getUsers();
        break;
      case "chat":
        chatWithUser(userConnection);
        break;
      case "exit":
        await disconnectClient();
        continuePrompt = false;
        break;
      default:
        break;
    }
  }
}
