import {Server as SocketServer} from 'socket.io'
import {TokenService} from "../service/token.service";
import {RoomRepository} from "../repository/room.repository";
import {UserRepository} from "../repository/user.repository";
import {omit} from "lodash";

const tokenService = new TokenService()
const roomRepository = new RoomRepository()
const userRepository = new UserRepository()

const getAllUsers = (io: SocketServer) => {
    const users: any[] = []
    const usersFromDb = userRepository.listAllUsers()

    usersFromDb.forEach(user => {
        for (let [id, socket] of io.of('/').sockets) {
            if (user.id === socket.data.userId) {
                users.push({
                    socketId: id,
                    userId: socket.data.userId,
                    userName: socket.data.userName
                })
                return;
            }
        }

        users.push({
            userId: user.id,
            userName: user.name
        })
    })

    return users
}

export const registerSockets = (io: SocketServer) => {

    io.use((socket, next) => {
        const token = socket.handshake.auth.token

        try {
            const {userId} = tokenService.verify<{userId: string}>(token)

            const {name} = userRepository.getByIdOrThrow(userId)

            socket.data = {
                userId,
                userName: name
            }

            next()
        } catch (_) {
            next(new Error("Token is invalid"))
        }
    })

    io.on('connection', (socket)=> {
        console.log(`user ${socket.data.userId} is connected`)

        socket.emit('current-user', JSON.stringify(omit(userRepository.getById(socket.data.userId), ['password'])))
        io.emit('all-users', JSON.stringify(getAllUsers(io)))
        io.emit('all-active-rooms', JSON.stringify(roomRepository.listRooms()))
        socket.join(roomRepository.listRooms().map(room => room.id))


        socket.on('disconnect', () => {
            io.emit('all-users', JSON.stringify(getAllUsers(io)))
        })


        socket.on('room-message', (payload) => {
            const {roomId, message} = JSON.parse(payload)

            if (!socket.rooms.has(roomId)) return;

            io.in(roomId).emit('room-message', message)
        })
    })
}