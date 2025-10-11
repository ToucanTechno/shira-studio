'use client'

import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import "./PanelLogin.css"
import {AuthContext} from "../../services/AuthContext";
import { logger } from "../../utils/logger";

const PanelLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loginError, setLoginError] = useState('')
    const { authTokens, setAuthTokens} = useContext(AuthContext)
    const router = useRouter()

    // Call the server API to check if the given email ID already exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initiateLogin = useCallback((processLoginResult: (accountData: any) => void) => {
        const apiUrl = 'http://127.0.0.1:3001/api/auth/admin/sign-in';
        logger.log('Attempting admin login with:', { email, isAdmin: true, endpoint: apiUrl });

        // First test if the server is reachable
        fetch('http://127.0.0.1:3001', { method: 'GET' })
            .then(res => {
                logger.log('Server status check:', res.status, res.ok ? 'online' : 'issue detected');
                logger.log('Proceeding with admin login request to:', apiUrl);
                // Now try the actual login
                return fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then(async (res): Promise<[number, any]> => {
                    const status = res.status;
                    let data = {};
                    try {
                        data = await res.json();
                    } catch (e) {
                        logger.error('Error parsing response:', e);
                        data = { error: 'Invalid response format' };
                    }
                    return [status, data];
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((loginResult: [number, any]) => {
                    logger.log('Login response:', loginResult[0], loginResult[1]);
                    processLoginResult(loginResult);
                });
            })
            .catch(error => {
                logger.error('Server connection error:', error);
                setLoginError('Cannot connect to server. Please check if the backend is running.');
            })
    }, [email, password]);

    // Log in a user using email and password
    const logIn = useCallback((accountData: {message: string, token: string}) => {
        // TODO: should we store accountData.email too?
        const token = JSON.stringify(accountData.token);
        localStorage.setItem('authTokens', token);
        // console.log("navigate", localStorage.getItem("authTokens"));
        setAuthTokens(token);
        router.push('/control-panel/');
    }, [router, setAuthTokens]);

    const onLogin = useCallback(() => {
        // Reset error messages
        setEmailError('');
        setPasswordError('');
        setLoginError('');

        // Check if the user has entered both fields correctly
        if ('' === email) {
            setEmailError('Please enter your email');
            return;
        }
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,13}$/.test(email)) {
            setEmailError('Please enter a valid email');
            return;
        }

        if ('' === password) {
            setPasswordError('Please enter a password');
            return;
        }

        // For admin login, we can simplify the password check
        // since we're using a known admin password
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }

        // Update UI to show login attempt is in progress
        setLoginError('Attempting to log in...');

        // Check if email has an account associated with it
        initiateLogin(([status, loginData]) => {
            // Clear the "attempting" message
            setLoginError('');

            // Handle different status codes
            if (status === 200) {
                logIn(loginData);
            } else if (status === 404) {
                logger.error('API endpoint not found');
                setLoginError('Login failed: API endpoint not found. Please check if backend server is running and the URL is correct.');
            } else if (status === 401) {
                setLoginError('Unauthorized: Admin access denied. Please check your credentials.');
            } else if (status === 403) {
                setLoginError('Forbidden: You do not have admin privileges.');
            } else {
                logger.error('Login error:', status, loginData);
                setLoginError(`Failed to login as admin (${status}). ${loginData.message || ''}`);
            }
        })
    }, [email, password, initiateLogin, logIn]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUserKeyPress = useCallback((event: any) => {
        if (event.key === 'Enter') {
            onLogin();
        }
    }, [onLogin]);

    useEffect(() => {
        window.addEventListener('keydown', handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    useEffect(() => {
        if (authTokens) {
            // console.log("Redirecting back to control-panel with user:", user);
            router.push('/control-panel/');
        }
    }, [router, authTokens]);

    return (
        <div className="login-container">
            <div className='title-container'>
                <div>התחברות מנהל</div>
            </div>
            <div className='input-container'>
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => {
                        setEmail(ev.target.value);
                    }} className='input-box'
                />
                <label className="error-label">{emailError}</label>
            </div>
            <br/>
            <div className='input-container'>
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => {
                        setPassword(ev.target.value);
                    }} className='input-box'
                />
                <label className="error-label">{passwordError}</label>
            </div>
            <br/>
            <div className='input-container'>
                <input className='input-button button-style' type="button" onClick={onLogin} value='כניסה'/>
                <label className="error-label">{loginError}</label>
            </div>
        </div>
    )
};

export default PanelLogin;
