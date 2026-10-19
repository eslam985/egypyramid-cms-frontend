import api from '@/api/auth/interceptors'
import type { DownloadTasksResponse, StatusTasksRequest } from '@/types/downloadTasksType'
import type { BaseApiResponse, BaseQueryRequest } from '@/types/globalTypes'
import type { MediasResponse } from '@/types/mediaType'
import type {
    SystemCountersResponse,
    ServerNameRequest,
    LockedTelegramResponse,
    TotalStatusLinksResponse,
} from '@/types/analyticsType'

const getSystemCounters = async (): Promise<BaseApiResponse<SystemCountersResponse | null>> => {
    const result = await api.get('/analytics/system-counters')
    return result.data
}

const getTotalBrokenAndValidAndPendingLinks = async (
    status?: StatusTasksRequest,
): Promise<BaseApiResponse<TotalStatusLinksResponse[]>> => {
    const result = await api.get(`/analytics/links/status/total`, {
        params: {
            ...(status && { status }),
        },
    })

    return result.data
}

const getBrokenLinks = async (
    query: ServerNameRequest,
): Promise<BaseApiResponse<DownloadTasksResponse[]>> => {
    const result = await api.get(`/analytics/links/broken`, { params: { ...query } })

    return result.data
}

const getMissingEpisodesByServer = async (
    query: ServerNameRequest,
): Promise<BaseApiResponse<DownloadTasksResponse[]>> => {
    const result = await api.get(`/analytics/episodes/links/missing-by-server`, {
        params: { ...query },
    })
    return result.data
}

const getLockedTelegramLinks = async (
    query?: BaseQueryRequest,
): Promise<BaseApiResponse<LockedTelegramResponse[]>> => {
    const result = await api.get(`/analytics/links/telegram/locked`, { params: { ...query } })

    return result.data
}

const getNotReadyMedias = async (
    query?: BaseQueryRequest,
): Promise<BaseApiResponse<MediasResponse[]>> => {
    const result = await api.get(`/analytics/medias/not-ready`, {
        params: {
            ...query,
        },
    })

    return result.data
}

const handleExportNotReadyMedias = async (params?: BaseQueryRequest): Promise<Blob> => {
    const result = await api.get('/analytics/medias/not-ready', {
        params: {
            ...params,
            export: true,
        },
        responseType: 'blob',
    })

    return result.data
}

const handleExportBrokenLinks = async (query: ServerNameRequest): Promise<Blob> => {
    const result = await api.get('/analytics/links/broken', {
        params: {
            ...query,
            export: true,
        },
        responseType: 'blob',
    })
    return result.data
}

const handleExportMissingEpisodesByServer = async (query: ServerNameRequest): Promise<Blob> => {
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
    handleExportLockedTelegramLinks,
}
