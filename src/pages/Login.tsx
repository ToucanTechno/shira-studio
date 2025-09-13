import {useCallback, useEffect, useState} from "react";
import { Form } from "react-router";
import {Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, useConst} from "@chakra-ui/react";
import axios, {AxiosInstance} from "axios";
import {getPasswordErrorUI, isEmailValidUI } from "../utils/Validation";
import { Link as ReactRouterLink, useNavigate } from 'react-router'
import { Link as ChakraLink } from '@chakra-ui/react'
import UserProfile from '../components/UserProfile';

const Login = (props: any) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    const navigate = useNavigate();

    const handleEmailChange = (e: any) => setEmail(e.target.value);
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
        navigate('/');
    }, [navigate]);

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

        const response = await api.post('auth/sign-in/', { email, password }).catch(err => {
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
                    navigate('/control-panel');
                } else {
                    // Redirect regular users to a different page (e.g., dashboard or home)
                    navigate('/profile'); // or wherever non-admin users should go
                }
            } else {
                setPasswordError('Invalid token received.');
            }
        }
        setLoading(false);
    }, [api, email, password, emailError, passwordError, navigate])

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
            <Form>
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
                <ChakraLink as={ReactRouterLink}
                            color='blue.400'
                            fontSize='md'
                            to='/register'>Register</ChakraLink>
            </Form>
        </Box>
    );
}

export default Login;