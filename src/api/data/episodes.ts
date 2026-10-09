import api from '@/api/auth/interceptors'

import type { CreateEpisodeSchemaType, UpdateEpisodeSchemaType } from '@/schemas/episodeSchema'

import type {
    BaseApiResponse,
    EpisodeResponse,
    BaseQueryRequest,
    EpisodeQueryRequest,
} from '@/types/globalTypes'

const createEpisode = async (
    media_id: number,
    params: CreateEpisodeSchemaType,
): Promise<BaseApiResponse<EpisodeResponse | null>> => {
    const result = await api.post(`/episodes/media/${media_id}`, { ...params })

    return result.data
}

const updateEpisodeById = async (
    id: number,
    data: UpdateEpisodeSchemaType,
): Promise<BaseApiResponse<EpisodeResponse | null>> => {
    const result = await api.patch(`/episodes/${id}`, data)
    return result.data
}

const findEpisodeById = async (id: number): Promise<BaseApiResponse<EpisodeResponse | null>> => {
    const result = await api.get(`/episodes/${id}`)
    return result.data
}

const findEpisodesByMediaId = async (
    media_id: number,
    query?: BaseQueryRequest,
): Promise<BaseApiResponse<EpisodeResponse | any[]>> => {
    const result = await api.get(`/episodes/media/${media_id}`, { params: { ...query } })

    return result.data
}

const findEpisodesBySeasonId = async (
    season_id: number,
): Promise<BaseApiResponse<EpisodeResponse | any[]>> => {
    const result = await api.get(`/episodes/season/${season_id}`)

    return result.data
}
// (property) QueryResultBase.rowCount: number | null
const deleteEpisodeById = async (id: number): Promise<number | null> => {
    const result = await api.delete(`/episodes/${id}`)
    return result.data
}

const handleFindAllEpisodes = async (
    params: EpisodeQueryRequest,
): Promise<BaseApiResponse<Blob | EpisodeResponse | any[]>> => {
    const result = await api.get('/episodes', {
        params: { ...params, export: 'true' },
        responseType: 'blob',
    })

    return result.data
}

export {
    createEpisode,
    updateEpisodeById,
    findEpisodeById,
    findEpisodesByMediaId,
    findEpisodesBySeasonId,
    deleteEpisodeById,
    handleFindAllEpisodes, // TODO: Call this func in store first to use
}
