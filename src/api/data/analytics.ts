import api from '@/api/auth/interceptors'
import type {
  BaseApiResponse,
  SystemCountersResponse,
  StatusTasksRequest,
  TotalStatusTasksResponse,
  DownloadTasksResponse,
  MediasResponse,
  BaseQueryRequest,
  serverNameRequest
} from '@/types/globalTypes'


const getSystemCounters = async (): Promise<BaseApiResponse<SystemCountersResponse>> => {
  const result = await api.get('/analytics/system-counters')
  return result.data
}


const getTotalBrokenAndValidAndPendingLinks = async ( status?: StatusTasksRequest):Promise<BaseApiResponse<TotalStatusTasksResponse[]>> => {
  const result = await api.get(`/analytics/links/status/total`, {
    params: {
      ...(status && { status }),
    },
  });

  return result.data;
};


const getBrokenLinks = async (query?: serverNameRequest): Promise<any> => {
  const result = await api.get( `/analytics/links/broken`, { params: { ...query } } )

  return result.data
}

const getMissingEpisodesByServer = async (query?: serverNameRequest): Promise<BaseApiResponse<DownloadTasksResponse>> => {
  const result = await api.get(`/analytics/episodes/links/missing-by-server`, { params: { ...query } } )
  return result.data
}

const getLockedTelegramLinks = async (query?: BaseQueryRequest): Promise<BaseApiResponse<DownloadTasksResponse>> => {
  const result = await api.get(`/analytics/links/telegram/locked`, { params: { ...query } } )
  return result.data
}


const getNotReadyMedias = async (query?: BaseQueryRequest): Promise<BaseApiResponse<MediasResponse>> => {
  const result = await api.get(`/analytics/medias/not-ready`, {
    params: {
      ...query
    }
  })
  return result.data
}


const handleExportNotReadyMedias = async ( params?: BaseQueryRequest ): Promise<Blob> => {
  const result = await api.get('/analytics/medias/not-ready', {
    params: {
      ...params,
      export: true,
    },
    responseType: 'blob',
  })

  return result.data
}


const handleExportBrokenLinks = async (query?: serverNameRequest): Promise<Blob> => {
  const result = await api.get('/analytics/links/broken', {
    params: {
      ...query,
      export: true,
    },
    responseType: 'blob',
  })
  return result.data
}

const handleExportMissingEpisodesByServer = async (query?: serverNameRequest): Promise<Blob> => {
  const result = await api.get('/analytics/episodes/links/missing-by-server', {
    params: {
      ...query,
      export: true,
    },
    responseType: 'blob',
  })
  return result.data
}


const handleExportLockedTelegramLinks = async (query?: BaseQueryRequest): Promise<Blob> => {
  const result = await api.get('/analytics/links/telegram/locked', {
    params: {
      ...query,
      export: true,
    },
    responseType: 'blob',
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
  handleExportNotReadyMedias,
  handleExportBrokenLinks,
  handleExportMissingEpisodesByServer,
  handleExportLockedTelegramLinks
}
