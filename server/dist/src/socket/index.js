"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSockets = void 0;
const token_service_1 = require("../service/token.service");
const room_repository_1 = require("../repository/room.repository");
const user_repository_1 = require("../repository/user.repository");
const lodash_1 = require("lodash");
const dashboard_message_repository_1 = require("../repository/dashboard-message.repository");
const room_message_repository_1 = require("../repository/room-message.repository");
const tokenService = new token_service_1.TokenService();
const roomRepository = new room_repository_1.RoomRepository();
const userRepository = new user_repository_1.UserRepository();
const dashboardMessageRepository = new dashboard_message_repository_1.DashboardMessageRepository();
const roomMessageRepository = new room_message_repository_1.RoomMessageRepository();
const getAllUsers = (io) => {
    const users = [];
    const usersFromDb = userRepository.listAllUsers();
    usersFromDb.forEach(user => {
        for (let [id, socket] of io.of('/').sockets) {
            if (user.id === socket.data.userId) {
                users.push({
                    socketId: id,
                    userId: socket.data.userId,
                    userName: socket.data.userName
                });
                return;
            }
        }
        users.push({
            userId: user.id,
            userName: user.name
        });
    });
    return users;
};
const registerSockets = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            const { userId } = tokenService.verify(token);
            const { name } = userRepository.getByIdOrThrow(userId);
            socket.data = {
                userId,
                userName: name
            };
            next();
        }
        catch (_) {
            next(new Error("Token is invalid"));
        }
    });
    io.on('connection', (socket) => {
        console.log(`user ${socket.data.userId} is connected`);
        socket.emit('current-user', JSON.stringify((0, lodash_1.omit)(userRepository.getById(socket.data.userId), ['password'])));
        io.emit('all-users', JSON.stringify(getAllUsers(io)));
        io.emit('all-active-rooms', JSON.stringify(roomRepository.listRooms()));
        socket.join(roomRepository.listRooms().map(room => room.id));
        socket.on('disconnect', () => {
            io.emit('all-users', JSON.stringify(getAllUsers(io)));
        });
        socket.on('send-room-message', (payload) => {
            const { roomId, message } = JSON.parse(payload);
            if (!socket.rooms.has(roomId))
                return;
            const user = userRepository.getByIdOrThrow(socket.data.userId);
            const messageToCreate = {
                message,
                userId: user.id,
                name: user.name,
                createdAt: Date.now(),
                roomId: roomId
            };
            roomMessageRepository.create(messageToCreate);
            io.in(roomId).emit('receive-room-message', roomMessageRepository);
        });
        socket.on('send-dashboard-message', (message) => {
            const user = userRepository.getByIdOrThrow(socket.data.userId);
            const messageToCreate = {
                message,
                userId: user.id,
                name: user.name,
                createdAt: Date.now(),
            };
            dashboardMessageRepository.create(messageToCreate);
            io.emit('receive-dashboard-message', JSON.stringify(messageToCreate));
        });
        socket.on('list-dashboard-message', () => {
            const messages = dashboardMessageRepository.listMessages();
            socket.emit('list-dashboard-message', JSON.stringify(messages));
        });
    });
};
exports.registerSockets = registerSockets;
