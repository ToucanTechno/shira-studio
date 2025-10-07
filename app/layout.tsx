'use client'

import { Box } from '@chakra-ui/react'
import TopNavbar from '../src/components/common/TopNavbar'
import { Providers } from './providers'
import './globals.css'
import { usePathname } from 'next/navigation'

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isControlPanel = pathname?.startsWith('/control-panel')

    return (
        <html lang="he" dir="rtl">
        <body>
        <Providers>
            <Box className="App" dir="rtl">
                {!isControlPanel && <TopNavbar />}
                {children}
            </Box>
        </Providers>
        </body>
        </html>
    )
}