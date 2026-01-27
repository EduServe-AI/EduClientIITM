import {
  CreateSessionRequest,
  CreateSessionResponse,
  InstructorProfileType,
  searchInstructorResponseType,
  searchResponseType,
  UserChatsResponse,
  UserSessionsResponse,
} from '@/types/api'
import api from './axios'

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

// Retreiving the list of recent chats of a user
export const getRecentChats = async () => {
  const response = await api.get<UserChatsResponse>('/chat/user-chats')

  // Returning the chats array
  return response.data.data.chats
}

// Searching the bots
export const getBotsQueryFn = async (search: string, level: string) => {
  const response = await api.get<searchResponseType>('/bot', {
    params: { search, level },
  })

  // Return the bots array from the nested data structure
  return response.data.data.bots
}

// Searching the instructors
export const getInstructorsQueryFn = async (search: string, level: string) => {
  const response = await api.get<searchInstructorResponseType>('/instructor', {
    params: { search, level },
  })

  // Return the instructors array from the nested data structure
  return response.data.data.instructors
}

// Retreiving instructors detailed profile view
export const getInstructorQueryFn = async (instructorId: string) => {
  const response = await api.get<InstructorProfileType>(
    `/instructor/${instructorId}`
  )

  // Returning the data from the response
  return response.data.data
}

// Creating the session call / Booking the session
export const createSession = async (sessionData: CreateSessionRequest) => {
  const response = await api.post<CreateSessionResponse>(
    '/session/create-session',
    sessionData
  )

  // Returning the data from the response
  return response.data
}

// Retreiving the list of user ( student or instructor ) sessions
export const getSessionsQueryFn = async () => {
  const response = await api.get<UserSessionsResponse>('/session/list')

  // Returning the sessions list
  return response.data.data.userSessions
}

// Retrieving the stream token for the session call
export const getCallTokenFn = async () => {
  const response = await api.get('/session/token')

  // Returning the stream call token
  return response.data.token
}

// Joining the session
export const joinSessionFn = async (sessionId: string) => {
  const response = await api.get(`/session/${sessionId}/join`)

  // Returning the data
  return response.data.streamCallId
}

// Ending the session
export const endSessionFn = async (sessionId: string) => {
  const response = await api.get(`/session/${sessionId}/end`)

  // Returning the response data
  return response.data
}
