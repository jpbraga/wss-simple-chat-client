"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wssClient_1 = require("./wssClient");
const jwt = require("jsonwebtoken");
const guid_1 = require("../src/util/guid");
const readline = require("readline");
const environment_1 = require("./util/environment");
const env_vars_1 = require("./util/consts/env.vars");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let token = "";
let client = new wssClient_1.WSSClient();
client.registerConnectionListener((status) => {
    if (status.code === 0) {
        console_out('Connected!');
        console_out(`Chat commands:\n
        /to [USERNAME] [MESSAGE] - direct message to a user\n
        /connected - number of connected users\n
        /users - list of connected users\n\n`);
    }
    if (status.code === 1 || status.code === -1) {
        console_out('Disconnected');
        process.exit(0);
    }
    else {
        client.sendMessage(JSON.stringify({
            jwt_auth_token: token,
            SERVER_QUERY: ['wss_server_details']
        }));
        rl.prompt(true);
        rl.on('line', (input) => {
            client.sendMessage(JSON.stringify({
                jwt_auth_token: token,
                message: input
            }));
            rl.prompt(true);
        });
    }
});
client.registerMessageListener((msg) => {
    try {
        if (msg !== undefined) {
            const message = JSON.parse(JSON.parse(msg)).payload;
            const line = (message.userName) ? `${message.userName}: ${message.message}` : message.message;
            console_out(line);
        }
    }
    catch (err) {
    }
});
rl.question('User name: ', (answer) => {
    console_out(`Connecting...`);
    client.connect();
    let guid = guid_1.Guid.generateGuid();
    console_out("uid: " + guid);
    token = jwt.sign({
        uid: guid,
        name: answer,
    }, environment_1.Environment.getValue(env_vars_1.ENV_VARS.JWT_SECRET, null));
    rl.prompt(true);
});
function console_out(msg) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}
