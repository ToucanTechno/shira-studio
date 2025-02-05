import {useCallback, useEffect, useState} from "react";
import { Form } from "react-router";
import {Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, useConst} from "@chakra-ui/react";
import axios, {AxiosInstance} from "axios";
import {getPasswordErrorUI, isEmailValidUI } from "../utils/Validation";
import { Link as ReactRouterLink } from 'react-router'
import { Link as ChakraLink } from '@chakra-ui/react'

const Login = (props: any) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    const handleEmailChange = (e: any) => setEmail(e.target.value);
    const handlePasswordChange = (e: any) => setPassword(e.target.value);

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
        // if (props.user !== null) {
        //     console.error('already logged in');
        //     return;
        // }
        const response = await api.post('auth/sign-in/', { email, password }).catch(err => {
            if (err && err.response && err.response.data && err.response.data.message === 'Email invalid.') {
                setPasswordError('User does not exist.');
            } else {
                setPasswordError('Unknown error.')
                console.error(err);
            }
            setLoading(false);
        });

        console.log(response);
        if (response && response.data && response.data.message == 'Password valid.') {
            const token = response.data.token;
            // TODO: save token to local storage and change login state in UI
        }
        setLoading(false);
    }, [api, email, password, emailError, passwordError])

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