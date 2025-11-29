const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
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

  // Destructuring the body out so that we wont pass the raw object to the fetch config
  const { body, ...restOptions } = options

  // Merging default options with any custom options provided
  const config: RequestInit = {
    method: restOptions.method || 'GET',
    credentials: 'include',
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...restOptions.headers,
    },
  }

  // Stringifying the body if it is present
  if (body) {
    config.body = JSON.stringify(body)
  }

  // Performing the actual fetch request
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    // validating the response
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
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
