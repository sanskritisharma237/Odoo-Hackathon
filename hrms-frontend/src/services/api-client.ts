import axios from 'axios'
import { APP_CONFIG } from '@/config'
import { storage } from '@/utils'

const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor – attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(APP_CONFIG.TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor – handle 401 and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = storage.get<string>(APP_CONFIG.REFRESH_TOKEN_KEY)

      if (refreshToken) {
        try {
          const res = await axios.post(`${APP_CONFIG.API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          const newToken = res.data.access_token
          storage.set(APP_CONFIG.TOKEN_KEY, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        } catch {
          storage.remove(APP_CONFIG.TOKEN_KEY)
          storage.remove(APP_CONFIG.REFRESH_TOKEN_KEY)
          storage.remove(APP_CONFIG.USER_KEY)
          window.location.href = '/login'
        }
      } else {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
