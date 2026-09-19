import api from '../auth/interceptors'

const findSeasonsByMediaId = async (media_id) => {
  const result = await api.get(`/seasons/media/${media_id}`)
  return result.data
}

const createSeason = async (media_id, data) => {
  const result = await api.post(`/seasons/media/${media_id}`, data)
  return result.data
}

const findSeasonById = async (id) => {
  const result = await api.get(`/seasons/${id}`)
  return result.data
}

const updateSeasonById = async (id, data) => {
  const result = await api.patch(`/seasons/${id}`, data)
  return result.data
}

const deleteSeasonById = async (id) => {
  const result = await api.delete(`/seasons/${id}`)
  return result.data
}

export { findSeasonsByMediaId, createSeason, findSeasonById, updateSeasonById, deleteSeasonById }
