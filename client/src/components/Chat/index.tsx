import React, {useEffect, useRef, useState} from "react";
import './style.css'
import moment from 'moment'
import {useChatData} from "../../providers/ChatDataContext";

const ChatItem = ({item}: any) => {
    const {currentUser} = useChatData()

    return (
        <div style={{textAlign: currentUser?.id === item.userId ? 'right': 'left'}} className='chat-item'>
            <div style={{fontWeight: 'bold'}}>
                {item.name} {currentUser?.id === item.userId && '(You)'}
            </div>
            <div>
                {item.message}
            </div>
            <div style={{color: 'grey'}}>
                Sent at {moment(item.createdAt).format('MM/dd/yyyy HH:mm:ss')}
            </div>
        </div>
    )
}

export const Chat = ({messages, sendMessage}: any) => {
    const ref = useRef<any>()

    const [textMessage, setTextMessage] = useState("")

    useEffect(() => {
        ref?.current?.scrollTo({
           left: 0,
           top: ref?.current?.scrollHeight,
           behaviour: 'smooth'
        })
    }, [messages])

    const onSendMessage = () => {
        sendMessage(textMessage)
        setTextMessage("")
    }

    const onSubmit = (e: any) => {
        e.preventDefault()

        onSendMessage()
    }

    return (
        <div style={{height: '90%'}}>
            <div ref={ref} className='chat-board'>
                {messages.map((item: any, i:any) => <ChatItem key={i.toString()} item={item}/>)}
            </div>
            <div style={{marginTop: 20}}>
                <form onSubmit={onSubmit}>
                    <div style={{display: 'inline-block'}}><input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} placeholder='Enter your message ...' className='send-chat-input'/></div>
                    <div style={{display: 'inline-block'}}><button type={'submit'} className='send-chat-button'>Send Message</button></div>
                </form>
            </div>
        </div>
    )
}