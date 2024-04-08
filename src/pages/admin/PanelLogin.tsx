import React, {useCallback, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./PanelLogin.css"
import {AuthContext} from "../../services/AuthContext";

const PanelLogin = (props: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loginError, setLoginError] = useState('')
    const { authTokens, setAuthTokens} = useContext(AuthContext)
    const navigate = useNavigate()

    const onLogin = () => {
        // Set initial error values to empty
        setEmailError('');
        setPasswordError('');

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
        if (/^(.{0,9}|[^0-9]*|[^A-Za-z]*)$/.test(password)) {
            setPasswordError('The password must be 10 characters or longer, and contain numbers and letters.');
            return;
        }

        // Check if email has an account associated with it
        initiateLogin(([status, loginData]) => {
            // If yes, log in
            if (status !== 200) {
                setLoginError('Failed to login as admin.');
                return;
            }

            logIn(loginData);
        })
    }

    const handleUserKeyPress = useCallback((event: any) => {
        if (event.key === 'Enter') {
            onLogin();
        }
    }, [email, password, onLogin]);

    useEffect(() => {
        window.addEventListener('keydown', handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    // Call the server API to check if the given email ID already exists
    const initiateLogin = (processLoginResult: (accountData: any) => void) => {
        fetch('http://127.0.0.1:3001/api/auth/sign-in?admin=1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(async (res): Promise<[number, {}]> => [res.status, await res.json()])
            .then((loginResult: [number, {}]) => {
                processLoginResult(loginResult);
            })
    }

// Log in a user using email and password
    const logIn = (accountData: {message: string, token: string}) => {
        // TODO: should we store accountData.email too?
        const token = JSON.stringify(accountData.token);
        localStorage.setItem("authTokens", token);
        // console.log("navigate", localStorage.getItem("authTokens"));
        setAuthTokens(token);
        navigate('/control-panel/');
    }

    useEffect(() => {
        if (authTokens) {
            // console.log("Redirecting back to control-panel with user:", user);
            navigate('/control-panel/');
        }
    }, [authTokens]);

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
