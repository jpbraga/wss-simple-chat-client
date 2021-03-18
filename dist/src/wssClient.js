"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSSClient = void 0;
const W3CWebSocket = require("websocket");
const env_vars_1 = require("./util/consts/env.vars");
const environment_1 = require("./util/environment");
class WSSClient {
    constructor() {
        this.callback = null;
        this.connCallback = null;
    }
    connect() {
        const uri = environment_1.Environment.getValue(env_vars_1.ENV_VARS.WSS_ADDRESS, null);
        const url = new URL(uri);
        const address = `${url.protocol}//${url.hostname}:${url.port}${url.pathname}`;
        this.client = new W3CWebSocket.w3cwebsocket(address, 'echo-protocol');
        this.client.onerror = (error) => {
            if (this.connCallback)
                this.connCallback({
                    code: -1,
                    content: error.message
                });
        };
        this.client.onopen = () => {
            if (this.connCallback)
                this.connCallback({
                    code: 0
                });
        };
        this.client.onclose = (event) => {
            if (this.connCallback)
                this.connCallback({
                    code: 1,
                    content: JSON.stringify(event)
                });
        };
        this.client.onmessage = (e) => {
            if (typeof e.data === 'string') {
                if (this.callback)
                    this.callback(e.data);
            }
        };
    }
    sendMessage(content) {
        var _a, _b;
        if (((_a = this.client) === null || _a === void 0 ? void 0 : _a.readyState) === ((_b = this.client) === null || _b === void 0 ? void 0 : _b.OPEN))
            this.client.send(content);
    }
    registerMessageListener(callback) {
        this.callback = callback;
    }
    registerConnectionListener(callback) {
        this.connCallback = callback;
    }
}
exports.WSSClient = WSSClient;
