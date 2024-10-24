import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">",
});
export function promptHandler(query: string): Promise<string> {
  return new Promise(
    (resolve: (value: string | PromiseLike<string>) => void) => {
      rl.question(query, function prompt(value: string) {
        resolve(value);
      });
    }
  );
}
