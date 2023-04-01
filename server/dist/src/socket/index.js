"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSockets = void 0;
const token_service_1 = require("../service/token.service");
const room_repository_1 = require("../repository/room.repository");
const user_repository_1 = require("../repository/user.repository");
const lodash_1 = require("lodash");
const tokenService = new token_service_1.TokenService();
const roomRepository = new room_repository_1.RoomRepository();
const userRepository = new user_repository_1.UserRepository();
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
        socket.on('disconnect', () => {
            io.emit('all-users', JSON.stringify(getAllUsers(io)));
        });
        socket.on('join-room', (roomId) => {
            if (socket.rooms.has(roomId)) {
                return;
            }
            socket.join(roomId);
        });
        socket.on('leave-room', (roomId) => {
            socket.leave(roomId);
        });
        socket.on('room-message', (payload) => {
            const { roomId, message } = JSON.parse(payload);
            if (!socket.rooms.has(roomId))
                return;
            io.in(roomId).emit('room-message', message);
        });
    });
};
exports.registerSockets = registerSockets;
