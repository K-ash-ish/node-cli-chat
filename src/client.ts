import WebSocket from "ws";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ws = new WebSocket("ws://localhost:3000/?token=abc123");
ws.on("open", function open() {
    ws.send("Hllllll");
    rl.on("line", (input) => {
        console.log("INPUT: ", input);
        ws.send(input);
    });
});

// recieved message
ws.on("message", function message(data) {
    console.log("Client: ", data);
});
