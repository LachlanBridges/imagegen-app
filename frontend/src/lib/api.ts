import axios from 'axios'

// Axios instance
export const api = axios.create({
  baseURL: '/api',
})

// Inject user header dynamically from localStorage
api.interceptors.request.use((config) => {
  const user = getUser()
  if (user) {
    config.headers['x-user'] = user
  }
  console.log('[API REQUEST]', config.method?.toUpperCase(), config.url, config.data || config.params)
  return config
})

// Util
function getUser(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return localStorage.getItem('user') || undefined
}
