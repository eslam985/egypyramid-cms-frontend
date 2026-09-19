import api from '@/api/auth/interceptors'

const createMedia = async (data) => {
  const result = await api.post('/medias', data)
  return result.data
}

const updateMediaById = async (id, data) => {
  const result = await api.patch(`/medias/${id}`, data)
  return result.data
}

const deleteMediaById = async (id) => {
  const result = await api.delete(`/medias/${id}`)
  return result.data
}

const findMediaById = async (id) => {
  const result = await api.get(`/medias/${id}`)
  return result.data
}

// /api/medias?page=1&limit=10
// findAllMedia({category, page = 1, limit = 20, search})
const findAllMedia = async ({ category, page = 1, limit = 20, search, sortBy, sortOrder } = {}) => {
  const result = await api.get('/medias', {
    params: {
      page,
      limit,
      ...(category && { category }),
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    },
  })

  return result.data
}

export { createMedia, updateMediaById, deleteMediaById, findAllMedia, findMediaById }
