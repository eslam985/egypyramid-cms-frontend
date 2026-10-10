import api from '../auth/interceptors'

import type { CreateSeasonSchemaType, UpdateSeasonSchemaType } from '@/schemas/seasonSchema'

import type { BaseApiResponse, SeasonsResponse, SeasonQueryRequest } from '@/types/globalTypes'

const findSeasonsByMediaId = async (
    media_id: number,
): Promise<BaseApiResponse<SeasonsResponse[] | SeasonsResponse | null>> => {
    const result = await api.get(`/seasons/media/${media_id}`)
    return result.data
}

const createSeason = async (
    media_id: number,
    data: CreateSeasonSchemaType,
): Promise<BaseApiResponse<SeasonsResponse | null>> => {
    const result = await api.post(`/seasons/media/${media_id}`, data)
    return result.data
}

const findSeasonById = async (id: number): Promise<BaseApiResponse<SeasonsResponse | null>> => {
    const result = await api.get(`/seasons/${id}`)
    return result.data
}

const updateSeasonById = async (
    id: number,
    data: UpdateSeasonSchemaType,
): Promise<BaseApiResponse<SeasonsResponse | null>> => {
    const result = await api.patch(`/seasons/${id}`, data)
    return result.data
}

const deleteSeasonById = async (id: number): Promise<BaseApiResponse<SeasonsResponse | null>> => {
    const result = await api.delete(`/seasons/${id}`)
    return result.data
}

const handleFindAllSeasons = async (params?: SeasonQueryRequest): Promise<Blob> => {
    const result = await api.get('/seasons', {
        params: { ...params, export: true },
        responseType: 'blob',
    })

    return result.data
}

export {
    findSeasonsByMediaId,
    createSeason,
    findSeasonById,
    updateSeasonById,
    deleteSeasonById,
    handleFindAllSeasons,
}
