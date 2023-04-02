import React, {useEffect, useState} from 'react'
import {Chat} from "../../../components/Chat";
import {useSocket} from "../../../providers/SocketContext";


export const Dashboard = () => {
    const socket = useSocket()

    const [messages, setMessages] = useState<any>([])

    useEffect(() => {
        socket.emit('list-dashboard-message')

        socket.on('list-dashboard-message', (data) => {
            setMessages((JSON.parse(data)))
        })

        socket.on('receive-dashboard-message', (data) => {
            setMessages((prevState: any) => {
                return [
                    ...prevState,
                    JSON.parse(data)
                ].sort((a:any, b: any) => a.createdAt - b.createdAt)
            })
        })

        return () => {
            socket.off('list-dashboard-message')
            socket.off('receive-dashboard-message')
        }
    }, [])

    const sendMessage = (message: string) => {
        socket.emit('send-dashboard-message', message)
    }


    return (
        <div style={{ marginLeft: 20, marginRight: 20, width: '100%', height: '90vh'}}>
            <h2 style={{height: '10%'}}>Dashboard - All Chat</h2>
            <Chat sendMessage={sendMessage} messages={messages}/>
        </div>
    )
}