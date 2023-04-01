import {v4 as uuid} from 'uuid'

export type Room = {
    id: string
    name: string
}

const rooms: Room[] = []

export class RoomRepository {
    public createRoom(roomName: string): Room {
        const room = {
            id: uuid(),
            name: roomName
        }

        rooms.push(room)

        return room
    }

    public listRooms(): Room[] {
        return rooms
    }

    public getById(roomId: string): Room | null {
        return rooms.find(room => room.id === roomId) ?? null
    }

    public getByIdOrThrow(roomId: string): Room {
        const room = this.getById(roomId)

        if (!room) {
            throw new Error("Room not found")
        }

        return room
    }
}