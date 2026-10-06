// /src/api/auth/userApi.ts
import api from '@/api/auth/interceptors'
import type {
  UpdateUserInputsType,
  ChangePasswordInputsType,
  DeleteSessionInputsType
} from '@/schemas/authSchema'

import type {
  BaseApiResponse,
  UserDataResponse,
  UserSeassionDataResponse,
  sortedSessionRequiest
} from '@/types/globalTypes'

const handleUpdateUserInfo = async (data: UpdateUserInputsType): Promise<BaseApiResponse<UserDataResponse>> => {
  const result = await api.put(`user/update/info`, data)
  return result.data
}

const handleChangePassword = async (data: ChangePasswordInputsType): Promise<BaseApiResponse> => {
  const result = await api.put('/user/update/password', data)
  return result.data
}

const handleFindUserById = async (): Promise<BaseApiResponse<UserDataResponse>> => {
  const result = await api.get('/user')
  return result.data
}


const handleGetSessionsByUserId = async (query: sortedSessionRequiest): Promise<BaseApiResponse<UserSeassionDataResponse[]>> => {
  const result = await api.get('/user/sessions', { params: { query } })
  return result.data
}

const handleRemoveSessionById = async (sessionId: DeleteSessionInputsType): Promise<BaseApiResponse> => {
  const result = await api.delete('/user/delete/session', { data: { sessionId } })
  return result.data
}

const handleDeleteAvatar = async (): Promise<BaseApiResponse<UserDataResponse>> => {
  const result = await api.delete('/avatar')
  return result.data
}

const handleUploadAvatar = async (formData: FormData): Promise<BaseApiResponse<UserDataResponse>> => {
  const result = await api.post('/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return result.data
}


const handleSetAvatarFromHistory = async (chosenAvatarUrl: string): Promise<BaseApiResponse<UserDataResponse>> => {
  const result = await api.patch('/avatar/set-previous', { chosenAvatarUrl })
  return result.data
}

export {
  handleUpdateUserInfo,
  handleChangePassword,
  handleGetSessionsByUserId,
  handleRemoveSessionById,
  handleUploadAvatar,
  handleFindUserById,
  handleDeleteAvatar,
  handleSetAvatarFromHistory
}
