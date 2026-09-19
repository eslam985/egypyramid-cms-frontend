import api from '@/api/auth/interceptors'

const createLink = async (episode_id, data = {}) => {
  const result = await api.post(`/links/episode/${episode_id}`, data)

  return result.data
}

const updateLinkById = async (id, data = {}) => {
  const result = await api.patch(`/links/${id}`, data)
  return result.data
}

const findLinksByEpisodeId = async (episode_id) => {
  const result = await api.get(`/links/episode/${episode_id}`)
  return result.data
}

const findLinkById = async (id) => {
  const result = await api.get(`/links/${id}`)
  return result.data
}

const deleteLinkById = async (id) => {
  const result = await api.delete(`/links/${id}`)
  return result.data
}

export { createLink, updateLinkById, findLinksByEpisodeId, findLinkById, deleteLinkById }
