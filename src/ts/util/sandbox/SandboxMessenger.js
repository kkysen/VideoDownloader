"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allExtensions_1 = require("../extensions/allExtensions");
const anyWindow_1 = require("../window/anyWindow");
const iframe_1 = require("./iframe");
allExtensions_1.addExtensions();
exports.SandboxMessenger = {
    async new(src) {
        const iframe = await iframe_1.createIframeSandbox(src);
        anyWindow_1.globals({ iframe });
        const window = iframe.contentWindow;
        let nextId = 0;
        const promises = new Map();
        const postMessage = function (type, message) {
            const id = nextId++;
            const typedMessage = { id, type, message };
            window.postMessage(typedMessage, "*" || location.origin);
            return new Promise((resolve, reject) => {
                promises.set(id, { resolve, reject });
            });
        };
        const onMessage = function (event) {
            const { id, message: { value, error } } = event.data;
            const pendingPromise = promises.get(id);
            if (pendingPromise) {
                const { resolve, reject } = pendingPromise;
                if (error) {
                    reject(error);
                }
                resolve(value);
            }
        };
        addEventListener("message", onMessage, false);
        const postFunctionMessage = function (args) {
            return postMessage("invoke", args);
        };
        const newSandboxedFunction = function (id) {
            const invokeArgs = function (type, thisArg, args) {
                return { type, id, thisArg, args };
            };
            const f = function (...args) {
                return postFunctionMessage(invokeArgs("call", this, args));
            };
            // override Function.bind() b/c it's more efficient to bind on the sandbox side
            f.bind = async function (thisArg, ...args) {
                const id = await postFunctionMessage(invokeArgs("bind", args, thisArg));
                return newSandboxedFunction(id);
            };
            return f;
        };
        const evaluate = function (js) {
            return postMessage("evaluate", js);
        };
        const compile = async function (js) {
            const id = await postMessage("compile", js);
            return newSandboxedFunction(id);
        };
        return {
            compile,
            evaluate,
        };
    },
};
//# sourceMappingURL=SandboxMessenger.js.map