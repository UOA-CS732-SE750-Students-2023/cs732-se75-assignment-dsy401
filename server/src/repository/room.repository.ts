export type Room = {
    id: string
    name: string
}

const rooms: Room[] = [
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
]

export class RoomRepository {
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