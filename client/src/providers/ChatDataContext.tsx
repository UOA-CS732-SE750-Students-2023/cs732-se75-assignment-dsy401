import React, {useContext, useEffect, useState} from "react";
import {useSocket} from "./SocketContext";

const ChatDataContext = React.createContext<any>({
    rooms: [],
    currentUser: null,
    allUsers: []
});

export const ChatDataContextProvider = ({ children }: any) => {
    const socket = useSocket()
    const [hasSocketConnected, setHasSocketConnected] = useState(false)

    // essential data
    const [rooms, setRooms] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        // connect to socket server
        socket.connect()

        socket.on('connect', () => {
            setHasSocketConnected(true)
        })

        socket.on('disconnect', () => {
            setHasSocketConnected(false)
        })


        // subscribe all-active-rooms event
        socket.on('all-active-rooms', (rooms) => {
            setRooms(JSON.parse(rooms))
        })

        // subscribe current-user event
        socket.on('current-user', (user) => {
            setCurrentUser(JSON.parse(user))
        })

        // subscribe all-users event
        socket.on('all-users', (users) => {
            setAllUsers(JSON.parse(users))
        })

        // subscribe connection error event
        socket.on('connect_error', (error) => {
            localStorage.removeItem('token')
            window.location.href = '/login'
        })
    }, [])

    return (
        <ChatDataContext.Provider value={{
            rooms,
            currentUser,
            allUsers
        }}>
            {hasSocketConnected ? children : 'Loading ....'}
        </ChatDataContext.Provider>
    );
};

export const useChatData = () => useContext(ChatDataContext)