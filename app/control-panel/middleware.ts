import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Simple logger for middleware (server-side)
const logger = {
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...args);
    }
  }
};

interface DecodedUser {
  role?: string;
  exp?: number;
}

export function middleware(request: NextRequest) {
  const authTokens = request.cookies.get('authTokens')?.value

  // Allow access to login page
  if (request.nextUrl.pathname === '/control-panel/login') {
    return NextResponse.next()
  }

  // Redirect to login if no token
  if (!authTokens) {
    return NextResponse.redirect(new URL('/control-panel/login', request.url))
  }

  try {
    const decodedUser = jwtDecode<DecodedUser>(authTokens)
    
    // Check if user is admin
    if (!decodedUser || decodedUser.role !== 'admin') {
      return NextResponse.redirect(new URL('/control-panel/login', request.url))
    }

    // Check token expiration
    if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/control-panel/login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    logger.error('Token validation error:', error)
    return NextResponse.redirect(new URL('/control-panel/login', request.url))
  }
}

export const config = {
  matcher: '/control-panel/:path*',
}