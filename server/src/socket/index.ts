import {Server as SocketServer} from 'socket.io'
import {TokenService} from "../service/token.service";
import {RoomRepository} from "../repository/room.repository";
import {UserRepository} from "../repository/user.repository";
import {omit} from "lodash";
import {DashboardMessageRepository} from "../repository/dashboard-message.repository";
import {RoomMessageRepository} from "../repository/room-message.repository";

const tokenService = new TokenService()
const roomRepository = new RoomRepository()
const userRepository = new UserRepository()
const dashboardMessageRepository = new DashboardMessageRepository()
const roomMessageRepository = new RoomMessageRepository()

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


        socket.on('send-room-message', (payload) => {
            const {roomId, message} = JSON.parse(payload)

            if (!socket.rooms.has(roomId)) return;

            const user = userRepository.getByIdOrThrow(socket.data.userId)

            const messageToCreate = {
                message,
                userId: user.id,
                name: user.name,
                createdAt: Date.now(),
                roomId: roomId
            }

            roomMessageRepository.create(messageToCreate)

            io.in(roomId).emit('receive-room-message', roomMessageRepository)
        })

        socket.on('send-dashboard-message', (message) => {
            const user = userRepository.getByIdOrThrow(socket.data.userId)

            const messageToCreate = {
                message,
                userId: user.id,
                name: user.name,
                createdAt: Date.now(),
            }

            dashboardMessageRepository.create(messageToCreate)

            io.emit('receive-dashboard-message', JSON.stringify(messageToCreate))
        })

        socket.on('list-dashboard-message', () => {
            const messages = dashboardMessageRepository.listMessages()

            socket.emit('list-dashboard-message', JSON.stringify(messages))
        })
    })
}