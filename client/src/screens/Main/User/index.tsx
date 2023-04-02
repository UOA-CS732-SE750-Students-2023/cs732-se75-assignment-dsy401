import React, {useEffect, useMemo, useState} from 'react'
import {Chat} from "../../../components/Chat";
import {useSocket} from "../../../providers/SocketContext";
import {useParams} from "react-router-dom";
import {useChatData} from "../../../providers/ChatDataContext";

export const User = () => {
    const socket = useSocket()

    const [messages, setMessages] = useState<any>([])

    const {userId} = useParams<{userId: string}>()

    const {allUsers, currentUser} = useChatData()

    const chatUser = useMemo(() => {
        return allUsers.filter((user: any) => user.userId === userId)?.[0] ?? null
    }, [userId,allUsers])


    useEffect(() => {
        socket.emit('list-private-messages', userId)

        socket.on('list-private-messages', (data) => {
            setMessages(JSON.parse(data)
                .filter((message: any) => (message.userId === currentUser?.id && message.receiverUserId === userId) || (message.userId === userId && message.receiverUserId === currentUser?.id) )
                .sort((a:any, b: any) => a.createdAt - b.createdAt))
        })

        socket.on('receive-private-message', (data) => {
            setMessages((prevState: any) => {
                const message = JSON.parse(data)

                if (!((message.userId === currentUser?.id && message.receiverUserId === userId) || (message.userId === userId && message.receiverUserId === currentUser?.id))) return prevState

                return [
                    ...prevState,
                    message
                ].sort((a:any, b: any) => a.createdAt - b.createdAt)
            })
        })

        return () => {
            socket.off('list-private-messages')
            socket.off('receive-private-message')
        }
    }, [userId, currentUser])

    const sendMessage = (message: string) => {
        socket.emit('send-private-message', JSON.stringify({
            message,
            socketId: chatUser.socketId,
            receiverUserId: userId,
        }))
    }

    return (
        <div style={{ marginLeft: 20, marginRight: 20, width: '100%', height: '90vh'}}>
            <h2 style={{height: '10%'}}>Private Chat - {chatUser?.userName}</h2>
            <Chat sendMessage={sendMessage} messages={messages}/>
        </div>
    )
}