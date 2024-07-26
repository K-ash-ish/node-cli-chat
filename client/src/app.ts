import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">",
});
function promptHandler(query: string, muted?: boolean): Promise<string> {
  return new Promise(
    (resolve: (value: string | PromiseLike<string>) => void) => {
      rl.question(query, function prompt(value: string) {
        resolve(value);
      });
    }
  );
}

async function app() {
  let username: string, password: string, confirmation: string;
  username = await promptHandler("username: ");
  password = await promptHandler("password: ");

  await fetch("http://localhost:3000/login", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  })
    .then((response) => response.json())
    .then((response) => console.log(response));
}

app();
