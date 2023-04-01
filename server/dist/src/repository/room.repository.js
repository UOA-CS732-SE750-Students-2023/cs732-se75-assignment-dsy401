"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const uuid_1 = require("uuid");
const rooms = [];
class RoomRepository {
    createRoom(roomName) {
        const room = {
            id: (0, uuid_1.v4)(),
            name: roomName
        };
        rooms.push(room);
        return room;
    }
    listRooms() {
        return rooms;
    }
    getById(roomId) {
        var _a;
        return (_a = rooms.find(room => room.id === roomId)) !== null && _a !== void 0 ? _a : null;
    }
    getByIdOrThrow(roomId) {
        const room = this.getById(roomId);
        if (!room) {
            throw new Error("Room not found");
        }
        return room;
    }
}
exports.RoomRepository = RoomRepository;
