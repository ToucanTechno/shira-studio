'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/services/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { logger } from '@/utils/logger'

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedUser: any = jwtDecode(authTokens)
      if (!decodedUser || decodedUser.role !== 'admin') {
        router.push('/control-panel/login')
      }
    } catch (error) {
      logger.error('Token decode error:', error)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedUser: any = jwtDecode(authTokens)
    if (!decodedUser || decodedUser.role !== 'admin') {
      return null
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null
  }

  return <>{children}</>
}