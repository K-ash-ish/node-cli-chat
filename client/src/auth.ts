import { URL } from "./constant";
import { promptHandler } from "./promptHandler";
import { UserSession } from "./UserSession";
export async function auth(type: string): Promise<string> {
  let username: string, password: string, confirmation: string;
  username = await promptHandler("username: ");
  password = await promptHandler("password: ");
  const authType = type === "login" ? "login" : "signup";
  const response = await fetch(`${URL}${authType}`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => res);

  if (!response.success) {
    throw new Error(`${response.message}`);
  }
  console.log(`${response.message}\n`);
  const user = UserSession.getInstance();
  user.currentUser = username;
  return response.data;
}
