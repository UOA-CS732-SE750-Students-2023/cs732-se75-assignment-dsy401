import io from 'socket.io-client';
import React, { useContext } from 'react';
import {config} from "../config";

const socket = io(config.apiEndpoint, { forceNew: true, autoConnect: false, auth: (cb) => {
    cb({token: localStorage.getItem('token')})
    } });

const SocketContext = React.createContext(socket);

export const SocketContextProvider = ({ children }: any) => {
    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);