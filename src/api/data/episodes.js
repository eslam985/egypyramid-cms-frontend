import api from '@/api/auth/interceptors'

const createEpisode = async (
  media_id,
  { season_id = null, episode_number = 1, ...extraData } = {},
) => {
  const result = await api.post(`/episodes/media/${media_id}`, {
    episode_number,
    ...(season_id && { season_id }),
    ...extraData,
  })

  return result.data
}

const updateEpisodeById = async (id, data) => {
  const result = await api.patch(`/episodes/${id}`, data)
  return result.data
}

const findEpisodeById = async (id) => {
  const result = await api.get(`/episodes/${id}`)
  return result.data
}

const findEpisodesByMediaId = async (media_id, page = 1, limit = 20) => {
  const result = await api.get(`/episodes/media/${media_id}`, {
    params: {
      page,
      limit,
    },
  })

  return result.data
}

const findEpisodesBySeasonId = async (season_id) => {
  const result = await api.get(`/episodes/season/${season_id}`)

  return result.data
}

const deleteEpisodeById = async (id) => {
  const result = await api.delete(`/episodes/${id}`)
  return result.data
}

export {
  createEpisode,
  updateEpisodeById,
  findEpisodeById,
  findEpisodesByMediaId,
  findEpisodesBySeasonId,
  deleteEpisodeById,
}
