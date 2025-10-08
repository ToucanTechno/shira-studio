// Centralized API configuration
// Next.js requires NEXT_PUBLIC_ prefix for browser-accessible environment variables
// These are embedded at build time by Next.js/Vercel

export const API_URL = process.env.API_URL || 'http://localhost:3001/api';