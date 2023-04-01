"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const api_1 = require("./src/api");
const socket_1 = require("./src/socket");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const port = 8080; // TODO: config
const expressServer = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(expressServer);
const socketServer = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*'
    }
});
expressServer.use((0, cors_1.default)());
expressServer.use(body_parser_1.default.urlencoded({ extended: false }));
expressServer.use(body_parser_1.default.json());
(0, api_1.registerApis)(expressServer);
(0, socket_1.registerSockets)(socketServer);
expressServer.use((error, req, res, next) => {
    const result = {
        errorMessage: error.message
    };
    res.status(error.status || 500);
    res.json(result);
});
httpServer.listen(port, () => {
    console.log(`🚀 [server]: Server is running on port ${port}`);
});
