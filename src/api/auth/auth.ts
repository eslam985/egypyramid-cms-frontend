// /src/api/auth.ts
import api from './interceptors'
import type { LoginUserInputsType, CreateUserInputsType } from '@/schemas/authSchema'
import type { BaseApiResponse, UserDataResponse, RegisterDataResponse } from '@/types/globalTypes'


export async function handleRegister(userData: CreateUserInputsType): Promise<BaseApiResponse<RegisterDataResponse>> {
  const result = await api.post('/auth/register', userData)
  return result.data
}

export async function login(userData: LoginUserInputsType): Promise<BaseApiResponse<UserDataResponse>> {
  const result = await api.post('/auth/login', userData)
  return result.data
}

export async function refresh(): Promise<BaseApiResponse<string>> {
  const result = await api.post('/auth/refresh')
  return result.data
}

export async function logout(): Promise<BaseApiResponse> {
  const result = await api.post('/auth/logout')
  return result.data
}
