import {Message} from "../types/message.type";


type RoomMessage = Message & {
    roomId: string
}

const messages: RoomMessage[] = []

export class RoomMessageRepository {
    public create(message: RoomMessage): void {
        messages.push(message)
    }

    public listMessagesByRoomId(roomId: string): RoomMessage[] {
        return messages.filter((message) => message.roomId === roomId)
    }
}