import {useCallback, useEffect, useState} from "react";
import { Form } from "react-router";
import {Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, useConst} from "@chakra-ui/react";
import axios, {AxiosInstance} from "axios";
import {getPasswordErrorUI, isEmailValidUI } from "../utils/Validation";
import { Link as ReactRouterLink } from 'react-router'
import { Link as ChakraLink } from '@chakra-ui/react'

const Register = (props: any) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [repeatPasswordError, setRepeatPasswordError] = useState('');
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

    useEffect(() => {
        if (repeatPassword !== '' && password !== repeatPassword) {
            setRepeatPasswordError("Passwords don't match");
        } else {
            setRepeatPasswordError('');
        }
    }, [password, repeatPassword])

    const handleRegister = useCallback(async () => {
        if (email === '' || password === '') {
            return;
        }
        if (emailError !== '' || passwordError !== ''){
            console.log(emailError, passwordError)
            return;
        }
        setLoading(true);
        const response = await api.post('auth/',
            { user_name: email, email, password, role: 'user' }).catch(err => {
            setRepeatPasswordError('Unknown error.')
            console.error(err);
            setLoading(false);
        });

        console.log(response);
        if (response && response.data && response.data.message === 'User registered successfully.') {
            // TODO: Login with this user and redirect to last page (or home if no last page was set)
        }
        setLoading(false);
    }, [api, email, password, emailError, passwordError]);

    const handleRepeatPasswordChange = useCallback((e: any) => {
        setRepeatPassword(e.target.value);
    }, [setRepeatPassword]);

    return (
        <Box className="login-container">
            <Heading as="h2">Register</Heading>
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

                <FormControl isRequired isInvalid={repeatPassword !== '' && repeatPasswordError !== ''}>
                    <FormLabel>Repeat Password</FormLabel>
                    <Input
                        type="password"
                        id="repeat_password"
                        name="repeat_password"
                        value={repeatPassword}
                        onChange={handleRepeatPasswordChange}
                        placeholder="Please repeat your password"
                    />
                    <FormErrorMessage>{repeatPasswordError}</FormErrorMessage>
                </FormControl>
                <Button w='full'
                        isLoading={loading}
                        my={3}
                        onClick={handleRegister}
                        tabIndex={0}
                        isDisabled={!isFormValid}>Register</Button>
                <ChakraLink as={ReactRouterLink}
                            color='blue.400'
                            fontSize='md'
                            tabIndex={0}
                            to='/login'>Login</ChakraLink>
            </Form>
        </Box>
    );
}

export default Register;