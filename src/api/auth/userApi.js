import api from '@/api/auth/interceptors'


const handleUpdateUserInfo = async (data = {}) => {
  const result = await api.put(`user/update/info`, data)

  return result.data
}

const handleChangePassword = async (data = {}) => {
  const result = await api.put('/user/update/password',data)
  return result.data
}
const handleFindUserById = async () => {
  const result = await api.get('/user')
  return result.data
}
const handleGetSessionsByUserId = async ({ sortBy = 'expires_at', sortOrder = 'ASC' } = {}) => {
  const result = await api.get('/user/sessions', {
    params: {
      sortBy,
      sortOrder,
    },
  })
  return result.data
}

const handleRemoveSessionById = async (sessionId) => {
  const result = await api.delete('/user/delete/session', {
    data: { sessionId },
  })
  return result.data
}

//  التعديل الصحيح لاستقبال وإرسال كائن الملفات
const handleUploadAvatar = async (formData) => {
  const result = await api.post('/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 💡 نخبر Axios أننا نرسل ملفاً وليس JSON عادي
    },
  })
  return result.data
}

// router.delete("/", handleDeleteAvatar);
const handleDeleteAvatar = async () => {
  const result = await api.delete('/avatar')
  return result.data
}

// دالة جديدة: إرسال رابط الصورة المختارة من السجل لتعيينها كصورة بروفايل
const handleSetAvatarFromHistory = async (chosenAvatarUrl) => {
  const result = await api.patch('/avatar/set-previous', { chosenAvatarUrl })
  return result.data
}

// أضف الدالة الجديدة هنا داخل كائن الـ export
export {
  handleUpdateUserInfo,
  handleChangePassword,
  handleGetSessionsByUserId,
  handleRemoveSessionById,
  handleUploadAvatar,
  handleFindUserById,
  handleDeleteAvatar,
  handleSetAvatarFromHistory // 💡 تم التصدير بنجاح
}
