import React, {useEffect, useState} from 'react'
import {Routes, Route} from 'react-router-dom';
import {Sidebar} from "../../components/Sidebar";
import {SocketContextProvider, useSocket} from "../../providers/SocketContext";
import {ChatDataContextProvider} from "../../providers/ChatDataContext";
import {Dashboard} from "./Dashboard";

export const Main = () => {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            window.location.href = '/login'
            return;
        }

        setIsLoading(false)
    }, [])

    return (isLoading ? (
        <div>Loading .......</div>
    ): (
        <SocketContextProvider>
            <ChatDataContextProvider>
                <div style={{display: 'flex'}}>
                    <Sidebar/>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/room/:roomId" element={<div>Room</div>}/>
                        <Route path="/user/:userId" element={<div>User</div>}/>
                        <Route path={"*"} element={<div>Dashboard</div>}/>
                    </Routes>
                </div>
            </ChatDataContextProvider>
        </SocketContextProvider>
    ))
}