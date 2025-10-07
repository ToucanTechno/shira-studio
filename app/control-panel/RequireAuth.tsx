'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/services/AuthContext'
import { jwtDecode } from 'jwt-decode'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { authTokens } = useContext(AuthContext)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    if (!authTokens) {
      router.push('/control-panel/login')
      return
    }

    try {
      const decodedUser: any = jwtDecode(authTokens)
      if (!decodedUser || decodedUser.role !== 'admin') {
        router.push('/control-panel/login')
      }
    } catch (error) {
      console.error('Token decode error:', error)
      router.push('/control-panel/login')
    }
  }, [authTokens, router, isClient])

  // Wait for client-side hydration to complete
  if (!isClient) {
    return null
  }

  // If no auth tokens, don't render children
  if (!authTokens) {
    return null
  }

  try {
    const decodedUser: any = jwtDecode(authTokens)
    if (!decodedUser || decodedUser.role !== 'admin') {
      return null
    }
  } catch (error) {
    return null
  }

  return <>{children}</>
}