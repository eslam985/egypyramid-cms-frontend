// 3-  create (login, refresh, logout): "/auth.js"
import api from './interceptors'

export const login = async (userData) => {
    const result = await api.post('/auth/login', userData)

    return result.data
}

export const refresh = async () => {
    const result = await api.post('/auth/refresh')

    return result.data
}

export const logout = async () => {
    const result = await api.post('/auth/logout')

    return result.data
}
