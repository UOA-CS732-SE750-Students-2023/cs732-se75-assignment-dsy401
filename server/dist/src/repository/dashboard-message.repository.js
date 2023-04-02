"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardMessageRepository = void 0;
const messages = [];
class DashboardMessageRepository {
    create(message) {
        messages.push(message);
    }
    listMessages() {
        return messages;
    }
}
exports.DashboardMessageRepository = DashboardMessageRepository;
