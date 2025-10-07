'use client'

import {useCallback, useEffect, useState} from "react";
import {Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, useConst} from "@chakra-ui/react";
import axios from "axios";
import {getPasswordErrorUI, isEmailValidUI } from "../utils/Validation";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Link as ChakraLink } from '@chakra-ui/react'
import UserProfile from '../components/UserProfile';

const Login = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const api = useConst<any>(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEmailChange = (e: any) => setEmail(e.target.value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePasswordChange = (e: any) => setPassword(e.target.value);

    // Function to decode JWT token
    const decodeToken = (token: string) => {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    // Check if user is already logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) {
                // Check if token is still valid (not expired)
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp && decodedToken.exp > currentTime) {
                    setCurrentUser({
                        id: decodedToken.id,
                        email: decodedToken.email || 'N/A',
                        user_name: decodedToken.user_name || 'User',
                        role: decodedToken.role || 'user'
                    });
                } else {
                    // Token expired, remove it
                    localStorage.removeItem('authToken');
                }
            }
        }
        setCheckingAuth(false);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        router.push('/');
    }, [router]);

    useEffect(() => {
        setEmailError(isEmailValidUI(email) ? '' : 'Invalid email address');
        setPasswordError(getPasswordErrorUI(password));
    }, [email, password])

    useEffect(() => {
        setIsFormValid(!emailError && !passwordError && email !== '' && password !== '');
    }, [emailError, passwordError, email, password])

    const handleLogin = useCallback(async () => {
        if (email === '' || password === '') {
            return;
        }
        if (emailError !== '' || passwordError !== ''){
            console.log(emailError, passwordError)
            return;
        }
        setLoading(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await api.post('auth/sign-in/', { email, password }).catch((err: any) => {
            if (err && err.response && err.response.data && err.response.data.message === 'Email invalid.') {
                setPasswordError('User does not exist.');
            } else {
                setPasswordError('Invalid login credentials. Please try again.')
                console.error(err);
            }
            setLoading(false);
        });

        console.log(response);
        if (response && response.data && response.data.message == 'Password valid.') {
            const token = response.data.token;

            // Decode token to get user role
            const decodedToken = decodeToken(token);

            if (decodedToken) {
                // Save token to local storage
                localStorage.setItem('authToken', token);

                // Set current user state
                setCurrentUser({
                    id: decodedToken.id,
                    email: decodedToken.email || email,
                    user_name: decodedToken.user_name || 'User',
                    role: decodedToken.role || 'user'
                });

                // Check if user is admin
                if (decodedToken.role === 'admin') {
                    router.push('/control-panel');
                } else {
                    // Redirect regular users to a different page (e.g., dashboard or home)
                    router.push('/profile'); // or wherever non-admin users should go
                }
            } else {
                setPasswordError('Invalid token received.');
            }
        }
        setLoading(false);
    }, [api, email, password, emailError, passwordError, router])

    // Show loading while checking authentication
    if (checkingAuth) {
        return <Box>Loading...</Box>;
    }

    // Show user profile if already logged in
    if (currentUser) {
        return <UserProfile user={currentUser} onLogout={handleLogout} />;
    }

    // Show login form if not logged in
    return (
        <Box className="login-container">
            <Heading as="h2">Login</Heading>
            <form>
                <FormControl isRequired isInvalid={email !== '' && emailError !== ''}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                    />
                    <FormErrorMessage>{emailError}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={password !== '' && passwordError !== ''}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                    />
                    <FormErrorMessage>{passwordError}</FormErrorMessage>
                </FormControl>

                <Button tabIndex={0}
                        w='full'
                        isLoading={loading}
                        my={3}
                        onClick={handleLogin}
                        isDisabled={!isFormValid}>Login</Button>
                <ChakraLink as={Link}
                            color='blue.400'
                            fontSize='md'
                            href='/register'>Register</ChakraLink>
            </form>
        </Box>
    );
}

export default Login;