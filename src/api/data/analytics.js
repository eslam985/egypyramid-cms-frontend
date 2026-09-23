import api from '@/api/auth/interceptors'

const getSystemCounters = async () => {
  const result = await api.get('/analytics/system-counters')
  return result.data
}

const getTotalBrokenAndValidAndPendingLinks = async (status) => {
  const result = await api.get(`/analytics/links/status/total`, {
    params: {
      ...(status && { status }),
    },
  })

  return result.data
}

const getNotReadyMedias = async ({ page = 1, limit = 20 } = {}) => {
  const result = await api.get(`/analytics/medias/not-ready`, {
    params: {
      page,
      limit,
    },
  })
  return result.data
}

const getBrokenLinks = async ({ serverName, page = 1, limit = 20 } = {}) => {
  const result = await api.get(`/analytics/links/broken`, {
    params: {
      serverName,
      page,
      limit,
    },
  })
  return result.data
}

const getMissingEpisodesByServer = async ({ serverName, page = 1, limit = 20 } = {}) => {
  const result = await api.get(`/analytics/episodes/links/missing-by-server`, {
    params: {
      ...(serverName && { serverName }),
      page,
      limit,
    },
  })
  return result.data
}

const getLockedTelegramLinks = async ({ page = 1, limit = 20 } = {}) => {
  const result = await api.get(`/analytics/links/telegram/locked`, {
    params: {
      page,
      limit,
    },
  })
  return result.data
}

export {
  getSystemCounters,
  getTotalBrokenAndValidAndPendingLinks,
  getNotReadyMedias,
  getBrokenLinks,
  getMissingEpisodesByServer,
  getLockedTelegramLinks,
}
