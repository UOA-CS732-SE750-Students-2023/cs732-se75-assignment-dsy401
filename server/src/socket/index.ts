import {Server as SocketServer} from 'socket.io'
import {TokenService} from "../service/token.service";
import {RoomRepository} from "../repository/room.repository";

const tokenService = new TokenService()
const roomRepository = new RoomRepository()

const getAllOnlineUsers = (io: SocketServer) => {
    const users = []

    for (let [id, socket] of io.of('/').sockets) {
        users.push({
            socketId: id,
            userId: socket.data.userId,
        })
    }

    return users
}

export const registerSockets = (io: SocketServer) => {

    io.use((socket, next) => {
        const token = socket.handshake.auth.token

        // const {user} = tokenService.verify<{user: User}>(token)

        // socket.data.userId = user.id

        socket.data.userId = '4e6cb539-26d3-4878-ac17-9aba43bb278f'

        next()

        // TODO: error handling
    })

    io.on('connection', (socket)=> {
        socket.emit('all-online-users', JSON.stringify(getAllOnlineUsers(io)))


        socket.on('disconnect', () => {
            console.log(`socket: ${socket.id} disconnected`)
        })


        socket.on('listRooms', () => {
            const rooms = roomRepository.listRooms()
            io.emit('listRooms', JSON.stringify(rooms))
        })

        socket.on('createRoom', (roomName) => {
            roomRepository.createRoom(roomName)

            const rooms = roomRepository.listRooms()

            io.emit('listRooms', JSON.stringify(rooms))
        })

        socket.on('join-room', (roomId) => {
            if (socket.rooms.has(roomId)){
                return;
            }
            socket.join(roomId)
        })

        socket.on('leave-room', (roomId) => {
            socket.leave(roomId)
        })

        socket.on('room-message', (payload) => {
            const {roomId, message} = JSON.parse(payload)

            if (!socket.rooms.has(roomId)) return;

            io.in(roomId).emit('room-message', message)
        })
    })
}