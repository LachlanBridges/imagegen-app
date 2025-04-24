import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: isLocal()
    ? { 'x-user': 'lachlan' }
    : {},
})

function isLocal() {
  return typeof window !== 'undefined' &&
         window.location.hostname === 'localhost'
}
