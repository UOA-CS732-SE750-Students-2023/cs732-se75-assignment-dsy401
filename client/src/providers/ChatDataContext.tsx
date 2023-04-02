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
        socket.connect()
        socket.on('connect', () => {
            setHasSocketConnected(true)
        })

        socket.on('disconnect', () => {
            setHasSocketConnected(false)
        })


        socket.on('all-active-rooms', (rooms) => {
            setRooms(JSON.parse(rooms))
        })

        socket.on('current-user', (user) => {
            setCurrentUser(JSON.parse(user))
        })

        socket.on('all-users', (users) => {
            setAllUsers(JSON.parse(users))
        })

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