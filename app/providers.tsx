'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from 'src/services/AuthContext'
import CartWrapper from 'src/utils/CartWrapper'

const theme = extendTheme({
    direction: 'rtl',
})

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider theme={theme}>
            <AuthProvider>
                <CartWrapper>
                    {children}
                </CartWrapper>
            </AuthProvider>
        </ChakraProvider>
    )
}