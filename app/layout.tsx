'use client'

import { Box } from '@chakra-ui/react'
import TopNavbar from '@/components/common/TopNavbar'
import { Providers } from './providers'
import './globals.css'
import { usePathname } from 'next/navigation'
import { Alef } from 'next/font/google'

const alef = Alef({
    subsets: ['latin', 'hebrew'],
    weight: ['400', '700'],
    display: 'swap',
})

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isControlPanel = pathname?.startsWith('/control-panel')

    return (
        <html lang="he" dir="rtl">
        <body className={alef.className}>
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