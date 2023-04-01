import React, {useEffect, useState} from 'react'
import './style.css'
import {config} from "../../config";


export const Login = () => {
    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            window.location.href = '/main/dashboard'
        }
    }, [])

    const [isLoading ,setIsLoading] = useState(false)
    const [loginErrorMessage, setLoginErrorMessage] = useState('')

    const onSubmit = async (e: any) => {
        e.preventDefault()

        setIsLoading(true)

        const email = e.target.email.value
        const password = e.target.password.value

        if (!email) {
            setLoginErrorMessage('email cannot be empty')
            setIsLoading(false)
            return
        }

        if (!password) {
            setLoginErrorMessage('password cannot be empty')
            setIsLoading(false)
            return
        }

        try {
            const rawData = await fetch(`${config.apiEndpoint}/api/sign-in`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            if (rawData?.status !== 201) {
                setLoginErrorMessage('Credentials are incorrect.')
                setIsLoading(false)
                return;
            }

            const {accessToken} = await rawData.json()

            localStorage.setItem('token', accessToken)

            window.location.href = '/main/dashboard'
        } catch (_) {
            setLoginErrorMessage('Credentials are incorrect.');
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={onSubmit} className="login-form">
                <h1 className="login-header">Socket.IO Tech Demo</h1>
                <div className="form-group">
                    <label htmlFor="username" className="label">Email</label>
                    <input
                        type="text"
                        name='email'
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="label">Password</label>
                    <input
                        type="password"
                        name='password'
                        className="input"
                    />
                </div>
                <button disabled={isLoading} type="submit" className="login-button">
                    {isLoading ? 'Loading': 'Log In'}
                </button>

                <div className='login-error'>{loginErrorMessage}</div>
            </form>
        </div>
    )
}