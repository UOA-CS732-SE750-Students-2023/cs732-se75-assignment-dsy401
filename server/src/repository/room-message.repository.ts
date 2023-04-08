import {Message} from "../types/message.type";


type RoomMessage = Message & {
    roomId: string
}

const messages: RoomMessage[] = []

/**
 * Room message repository to get room data
 */
export class RoomMessageRepository {
    public create(message: RoomMessage): void {
        messages.push(message)
    }

    public listMessagesByRoomId(roomId: string): RoomMessage[] {
        return messages.filter((message) => message.roomId === roomId)
    }
}