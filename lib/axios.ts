import axios, {
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { getAccessToken, removeAccessToken, saveAccessToken } from './auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

// For refresh token queue
let isRefreshing = false
let failedQueue: {
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

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

// Response Interceptor: Handle errors globally and refresh tokens
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise(function (resolve, reject) {
        axios
          .post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true })
          .then(({ data }) => {
            const newAccessToken = data?.data?.accessToken || data?.accessToken
            saveAccessToken(newAccessToken)
            api.defaults.headers.common['Authorization'] =
              `Bearer ${newAccessToken}`
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            processQueue(null, newAccessToken)
            resolve(api(originalRequest))
          })
          .catch(err => {
            processQueue(err, null)
            removeAccessToken()
            // Optional fast redirect when refresh token entirely fails
            if (typeof window !== 'undefined') {
              const pathname = window.location.pathname
              if (pathname.includes('/instructor')) {
                window.location.href = '/instructor'
              } else {
                window.location.href = '/student'
              }
            }
            reject(err)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }

    console.log(error, 'test axios', error.response?.status, 'status')
    const status = error.response?.status
    // Extract error message similar to your apiService logic
    let customError =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message

    // Handle "no data" scenarios globally
    const isNoData =
      status === 404 ||
      status === 204 ||
      (typeof customError === 'string' &&
        /no data|not found|empty/i.test(customError))

    if (isNoData) {
      return Promise.resolve({
        data: {
          data: [],
        },
      })
    }

    if (typeof customError === 'object' && customError !== null) {
      customError = JSON.stringify(customError)
    }
    console.error('API Error:', customError)
    return Promise.reject(new Error(customError))
  }
)

export default api
