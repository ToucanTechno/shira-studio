'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'
import { AuthContext } from '@/services/AuthContext'
import { getPasswordErrorUI, isEmailValidUI } from '@/utils/Validation'
import { jwtDecode } from 'jwt-decode'
import { logger } from '@/utils/logger'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const { api, authTokens, setAuthTokens } = useContext(AuthContext)
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmailChange = (e: any) => setEmail(e.target.value)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePasswordChange = (e: any) => setPassword(e.target.value)

  useEffect(() => {
    setEmailError(isEmailValidUI(email) ? '' : 'Invalid email address')
    setPasswordError(getPasswordErrorUI(password))
  }, [email, password])

  useEffect(() => {
    setIsFormValid(!emailError && !passwordError && email !== '' && password !== '')
  }, [emailError, passwordError, email, password])

  useEffect(() => {
    if (authTokens) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedUser: any = jwtDecode(authTokens)
        if (decodedUser && decodedUser.role === 'admin') {
          router.push('/control-panel/')
        }
      } catch (error) {
        logger.error('Token decode error:', error)
      }
    }
  }, [authTokens, router])

  const handleLogin = useCallback(async () => {
    if (email === '' || password === '') {
      return
    }
    if (emailError !== '' || passwordError !== '') {
      logger.log(emailError, passwordError)
      return
    }
    setLoading(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any
    try {
      response = await api.post('auth/admin/sign-in/', { email, password })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err && err.response && err.response.data) {
        if (err.response.data.message === 'Email invalid.') {
          setPasswordError('Admin user does not exist.')
        } else if (err.response.status === 401) {
          setPasswordError('Unauthorized: Admin access denied.')
        } else if (err.response.status === 403) {
          setPasswordError('Forbidden: You do not have admin privileges.')
        } else {
          setPasswordError('Invalid admin login credentials. Please try again.')
        }
      } else {
        setPasswordError('Cannot connect to server. Please check if the backend is running.')
      }
      logger.error(err)
      setLoading(false)
      return
    }

    logger.log(response)
    if (response && response.data && response.data.token) {
      const token = response.data.token

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken: any = jwtDecode(token)

        if (decodedToken && decodedToken.role === 'admin') {
          // Save token to local storage
          const tokenString = JSON.stringify(token)
          localStorage.setItem('authTokens', tokenString)
          
          // Store in cookie for server-side middleware
          document.cookie = `authTokens=${tokenString}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

          setAuthTokens(tokenString)
          router.push('/control-panel/')
        } else {
          setPasswordError('You do not have admin privileges.')
        }
      } catch (error) {
        logger.error('Token decode error:', error)
        setPasswordError('Invalid token received.')
      }
    }
    setLoading(false)
  }, [api, email, password, emailError, passwordError, router, setAuthTokens])

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid) {
      handleLogin()
    }
  }, [handleLogin, isFormValid])

  return (
    <Box 
      className="login-container" 
      maxW="md" 
      mx="auto" 
      mt={8} 
      p={6} 
      borderWidth={1} 
      borderRadius="lg"
      onKeyPress={handleKeyPress}
    >
      <Heading as="h2" mb={6} textAlign="center">
        התחברות מנהל
      </Heading>
      
      <FormControl isRequired isInvalid={email !== '' && emailError !== ''} mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your admin email"
        />
        <FormErrorMessage>{emailError}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={password !== '' && passwordError !== ''} mb={4}>
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

      <Button
        tabIndex={0}
        w="full"
        isLoading={loading}
        my={3}
        onClick={handleLogin}
        isDisabled={!isFormValid}
        colorScheme="cyan"
      >
        כניסה
      </Button>
    </Box>
  )
}