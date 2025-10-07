'use client'

import { AuthProvider } from '@/services/AuthContext'
import TopAdminNavbar from '@/views/admin/TopAdminNavbar'
import { usePathname } from 'next/navigation'
import '@/views/admin/PanelApp.css'

export default function ControlPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/control-panel/login'

  return (
    <AuthProvider>
      {!isLoginPage && <TopAdminNavbar />}
      {children}
    </AuthProvider>
  )
}