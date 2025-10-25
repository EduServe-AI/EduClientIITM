import { toast } from 'sonner'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

interface ApiOptions extends RequestInit {
  body?: any
}

export async function apiService<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const accessToken = localStorage.getItem('accessToken')

  // setting up default headers
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`
  }

  // Merging default options with any custom options provided
  const config: RequestInit = {
    method: options.method || 'GET',
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  // Stringifying the body if it is present
  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  // Performing the actual fetch request
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    // validating the response
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.log('errorData', errorData)
      console.log('errorData', errorData.message)
      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        `HTTP error : status : ${response.status} `
      throw new Error(errorMessage)
    }

    // Handle responses with no content (e.g., 204 No Content)
    if (response.status === 204) {
      return null as T
    }

    return (await response.json()) as T
  } catch (error) {
    throw error
  }
}
