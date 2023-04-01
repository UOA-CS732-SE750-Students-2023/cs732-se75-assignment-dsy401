"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const rooms = [
    {
        id: 'a799cfab-55b8-4a4b-a598-58846fdbdbc7',
        name: 'Room Red'
    },
    {
        id: '4bd14a35-b800-461b-ae28-27ad1b44e06a',
        name: 'Room Green'
    },
    {
        id: 'ae830e29-d564-4e06-89f7-bb42688db92e',
        name: 'Room Blue'
    }
];
class RoomRepository {
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
