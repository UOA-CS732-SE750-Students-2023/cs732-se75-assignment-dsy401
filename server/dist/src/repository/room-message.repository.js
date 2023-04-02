"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMessageRepository = void 0;
const messages = [];
class RoomMessageRepository {
    create(message) {
        messages.push(message);
    }
    listMessagesByRoomId(roomId) {
        return messages.filter((message) => message.roomId === roomId);
    }
}
exports.RoomMessageRepository = RoomMessageRepository;
