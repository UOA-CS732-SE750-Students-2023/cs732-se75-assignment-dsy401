import React, {useMemo} from 'react'
import './style.css'
import {useLocation, useNavigate} from "react-router-dom";
import {useChatData} from "../../providers/ChatDataContext";

const NavItem = ({active, name, path}: {active: boolean, name: string, path: string}) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => {
                navigate(path)
            }}
            className={`nav__item--room ${active && 'nav__item--room--active'}`}
        >
            {name}
        </div>
    )
}

export const Sidebar = () => {
    const location = useLocation()

    const {rooms, currentUser, allUsers} = useChatData()

    const onSignOut = () => {
        localStorage.removeItem('token')

        window.location.href = '/login'
    }

    const onlineUsers = useMemo(() => {
        return (
            allUsers.filter((user: any) => user.userId !== currentUser?.id && !!user.socketId)
        )
    }, [allUsers, currentUser])

    const offlineUsers = useMemo(() => {
        return (
            allUsers.filter((user: any) => user.userId !== currentUser?.id && !user.socketId)
        )
    }, [allUsers, currentUser])

    return (
        <div className="nav">
            <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                <div style={{ textAlign: 'center' }}>Tech Demo</div>
                <div style={{ textAlign: 'center' }}>Socket.IO</div>
            </div>
            <div style={{ marginTop: 10, color: 'white' }}>Hello, {currentUser?.name}</div>
            <div className="nav__section">
                <div className="nav__item">
                    <NavItem path={'/main/dashboard'} active={location.pathname === '/main/dashboard' || location.pathname === '/main'} name={"Dashboard"}/>
                </div>

                <div className="nav__item">
                    <div className="nav__item--title">
                        Chat Rooms
                    </div>

                    {rooms.map((room: any) => (
                        <NavItem path={`/main/room/${room.id}`} key={room.id} active={location.pathname === `/main/room/${room.id}`} name={room.name}/>
                    ))}
                </div>


                <div className="nav__item">
                    <div className="nav__item--title">
                        Online Users
                    </div>

                    {onlineUsers.length === 0 ? <div>No other online users</div> : (
                        onlineUsers.map((user: any) => (
                                <NavItem key={user.userId} active={location.pathname === `/main/user/${user.userId}`} name={user.userName} path={`/main/user/${user.userId}`}/>
                            ))
                    )}
                </div>

                <div className="nav__item">
                    <div className="nav__item--title">
                        Offline Users
                    </div>

                    {offlineUsers.length === 0 ? <div>No other offline users</div> : (
                        offlineUsers.map((user: any) => (
                            <NavItem key={user.userId} active={location.pathname === `/main/user/${user.userId}`} name={user.userName} path={`/main/user/${user.userId}`}/>
                        ))
                    )}
                </div>

            </div>

            <div
                style={{ marginTop: 'auto', color: 'white', textAlign: 'center' }}
            >
                <div style={{cursor: "pointer", marginTop: 10}} onClick={onSignOut}>
                    Sign Out
                </div>
            </div>
        </div>
    )
}