import { jwtDecode } from 'jwt-decode'

interface CustomJwtPayload {
  userId: string
  role: 'student' | 'instructor'
  type: 'access' | 'refresh'
  exp: number
}

export const saveAccessToken = (token: string) => {
  // Store in localStorage for persistence
  localStorage.setItem('accessToken', token)
}

export const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const removeAccessToken = () => {
  localStorage.removeItem('accessToken')
}

// Helper function to get the userId from the token
export const getCurrentUserId = () => {
  // Checking if we are on the client side (Next.js SSR safety check)
  if (typeof window === 'undefined') return null

  try {
    const token = getAccessToken()
    if (!token) return null

    // Decoding the token to get the payload
    const decoded = jwtDecode<CustomJwtPayload>(token)

    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      localStorage.removeItem('accessToken') // Auto-cleanup
      return null
    }

    return decoded
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}
