const {wsKey} = require("../config.json");
const WebSocket = require("ws");
// const ws = new WebSocket("ws://localhost:1439/message");

// ws.on("open", () => {
//     console.log("Connected");
// });
//
// ws.on("close", () => {
//     console.log("Disconnected");
// });

async function invitePlayer(username) {
    new Promise((resolve) => {
        // if (ws.readyState === ws.OPEN || true) {
        //     resolve();
        // }
        resolve();
    }).then(() => {
        const send = {
            type: "message",
            data: `/g invite ${username}`,
            token: wsKey,
        };
        console.log(JSON.stringify(send));
        // ws.send(JSON.stringify(send));
    });
}

module.exports = {invitePlayer};
