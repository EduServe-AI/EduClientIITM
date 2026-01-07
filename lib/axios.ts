import axios, {
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { getAccessToken } from './auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

// Creating the axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to inject Authorization and CSRF token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers) config.headers = new AxiosHeaders()

    // Exactly like your apiService: get token from storage
    const accessToken = getAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 3. Response Interceptor: Handle errors globally (Optional but recommended)
api.interceptors.response.use(
  response => response,
  error => {
    // Extract error message similar to your apiService logic
    let customError =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message

    if (typeof customError === 'object' && customError !== null) {
      customError = JSON.stringify(customError)
    }
    console.error('API Error:', customError)
    return Promise.reject(new Error(customError))
  }
)

export default api
