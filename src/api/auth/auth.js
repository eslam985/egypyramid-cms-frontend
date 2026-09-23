// 3-  create (login, refresh, logout): "/auth.js"
import api from './interceptors'

export const login = async (userData) => {
  const result = await api.post('/auth/login', userData)

  return result.data
}

export const refresh = async (refreshToken) => {
  const result = await api.post('/auth/refresh', null, {
    headers: { 'x-refresh-token': refreshToken }
  })
  return result.data
}

export const logout = async (refreshToken) => {
  const result = await api.post('/auth/logout', null, {
    headers: { 'x-refresh-token': refreshToken }
  })
  return result.data
}
