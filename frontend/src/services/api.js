import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error?.response?.data
    if (Array.isArray(payload?.detail)) {
      return Promise.reject({
        ...payload,
        detail: payload.detail
          .map((item) => item?.msg)
          .filter(Boolean)
          .join(', '),
      })
    }
    return Promise.reject(payload || error)
  },
)

export default api
