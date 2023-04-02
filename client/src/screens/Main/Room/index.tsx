import React, {useEffect, useState} from 'react'
import {useSocket} from "../../../providers/SocketContext";
import {Chat} from "../../../components/Chat";
import {useParams} from "react-router-dom";

export const Room = () => {
    const socket = useSocket()

    const [messages, setMessages] = useState<any>([])

    const {roomId} = useParams<{roomId: string}>()

    useEffect(() => {
        socket.emit('list-room-messages', roomId)

        socket.on('list-room-messages', (data) => {
            setMessages(JSON.parse(data).filter((item: any) => item.roomId === roomId).sort((a:any, b: any) => a.createdAt - b.createdAt))
        })

        socket.on('receive-room-message', (data) => {
            setMessages((prevState: any) => {
                const message = JSON.parse(data)

                if (message.roomId !== roomId) return prevState

                return [
                    ...prevState,
                    message
                ].sort((a:any, b: any) => a.createdAt - b.createdAt)
            })
        })

        return () => {
            socket.off('list-room-messages')
            socket.off('receive-room-message')
        }
    }, [roomId])

    const sendMessage = (message: string) => {
        socket.emit('send-room-message', JSON.stringify({
            roomId: roomId,
            message: message
        }))
    }

    return (
        <div style={{ marginLeft: 20, marginRight: 20, width: '100%', height: '90vh'}}>
            <h2 style={{height: '10%'}}>Room</h2>
            <Chat sendMessage={sendMessage} messages={messages}/>
        </div>
    )
}