import {Server as SocketServer} from 'socket.io'
import {TokenService} from "../service/token.service";
import {RoomRepository} from "../repository/room.repository";
import {UserRepository} from "../repository/user.repository";
import {omit} from "lodash";
import {DashboardMessageRepository} from "../repository/dashboard-message.repository";
import {RoomMessageRepository} from "../repository/room-message.repository";
import {PrivateMessageRepository} from "../repository/private-message.repository";

const tokenService = new TokenService()
const roomRepository = new RoomRepository()
const userRepository = new UserRepository()
const dashboardMessageRepository = new DashboardMessageRepository()
const roomMessageRepository = new RoomMessageRepository()
const privateMessageRepository = new PrivateMessageRepository()

// get all users to be sent to client
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

    // socket middleware to validate the token before connection
    io.use((socket, next) => {
        const token = socket.handshake.auth.token

        try {
            // verify token
            const {userId} = tokenService.verify<{userId: string}>(token)

            // check the whether user in database
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

    // client has connected to server
    io.on('connection', (socket)=> {
        console.log(`user ${socket.data.userId} is connected`)

        // once connection successfully, emit current-user, all-users, all-active-rooms events and join rooms
        socket.emit('current-user', JSON.stringify(omit(userRepository.getById(socket.data.userId), ['password'])))
        io.emit('all-users', JSON.stringify(getAllUsers(io)))
        io.emit('all-active-rooms', JSON.stringify(roomRepository.listRooms()))
        socket.join(roomRepository.listRooms().map(room => room.id))


        // socket disconnection handler
        socket.on('disconnect', () => {
            io.emit('all-users', JSON.stringify(getAllUsers(io)))
        })


        // receive the send-room-message
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

            // send the message in room
            io.in(roomId).emit('receive-room-message', JSON.stringify(messageToCreate))
        })

        // list room messages by room id
        socket.on('list-room-messages', (roomId) => {
            if (!socket.rooms.has(roomId)) return;

            const messages = roomMessageRepository.listMessagesByRoomId(roomId)

            socket.emit('list-room-messages', JSON.stringify(messages))
        })

        // receive the send-dashboard-message
        socket.on('send-dashboard-message', (message) => {
            const user = userRepository.getByIdOrThrow(socket.data.userId)

            const messageToCreate = {
                message,
                userId: user.id,
                name: user.name,
                createdAt: Date.now(),
            }

            dashboardMessageRepository.create(messageToCreate)

            // send message to all the users
            io.emit('receive-dashboard-message', JSON.stringify(messageToCreate))
        })

        // list all the dashboard messages
        socket.on('list-dashboard-messages', () => {
            const messages = dashboardMessageRepository.listMessages()

            socket.emit('list-dashboard-messages', JSON.stringify(messages))
        })

        // receive send private message event
        socket.on('send-private-message', (payload) => {
            const {socketId,receiverUserId, message} = JSON.parse(payload)

            const user = userRepository.getByIdOrThrow(socket.data.userId)

            const messageToCreate = {
                userId: user.id,
                name: user.name,
                message: message,
                createdAt: Date.now(),
                receiverUserId: receiverUserId
            }

            privateMessageRepository.create(messageToCreate)

            const allUsers = getAllUsers(io)
            const isOnlineUser = socketId && !!allUsers.filter(user => user.socketId && user.socketId === socketId)?.[0]

            if (isOnlineUser) {
                socket.to(socketId).emit('receive-private-message', JSON.stringify(messageToCreate))
            }

            // send private message to the specific socket
            socket.emit('receive-private-message', JSON.stringify(messageToCreate))
        })

        // list all private messages based on socket id
        socket.on('list-private-messages', (receiverUserId) => {
            const messages = privateMessageRepository.listMessages(socket.data.userId, receiverUserId).concat(privateMessageRepository.listMessages(receiverUserId, socket.data.userId))

            socket.emit('list-private-messages', JSON.stringify(messages))
        })
    })
}