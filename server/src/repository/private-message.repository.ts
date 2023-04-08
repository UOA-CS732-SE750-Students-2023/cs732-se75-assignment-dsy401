import {Message} from "../types/message.type";

type PrivateMessage = Message & {
    receiverUserId: string
}

const messages: PrivateMessage[] = []

/**
 * Private message repository to get private messages
 */
export class PrivateMessageRepository {
    public create(message: PrivateMessage): void {
        messages.push(message)
    }

    public listMessages(userId: string, receiverUserId: string) {
        return messages.filter((message) => message.userId === userId && message.receiverUserId === receiverUserId)
    }
}