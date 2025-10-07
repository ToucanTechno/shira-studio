'use client'

import { AuthProvider } from '@/services/AuthContext'
import TopAdminNavbar from '@/pages/admin/TopAdminNavbar'
import { usePathname } from 'next/navigation'
import '@/pages/admin/PanelApp.css'

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