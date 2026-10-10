import api from '@/api/auth/interceptors'
import type {
    CreateMediaInputsType,
    UpdateMediaInputsType,
    GetMediasQueryInputsType,
} from '@/schemas/mediaSchema'

import type { BaseApiResponse, MediasResponse } from '@/types/globalTypes'

const createMedia = async (
    data: CreateMediaInputsType,
): Promise<BaseApiResponse<MediasResponse | null>> => {
    const result = await api.post('/medias', data)
    return result.data
}

const updateMediaById = async (
    id: number,
    data: UpdateMediaInputsType,
): Promise<BaseApiResponse<MediasResponse | null>> => {
    const result = await api.patch(`/medias/${id}`, data)
    return result.data
}

const deleteMediaById = async (id: number): Promise<BaseApiResponse<MediasResponse | null>> => {
    const result = await api.delete(`/medias/${id}`)
    return result.data
}

const findMediaById = async (id: number): Promise<BaseApiResponse<MediasResponse | null>> => {
    const result = await api.get(`/medias/${id}`)
    return result.data
}

const findMediaByAnyId = async (
    id: number,
    targetTable?: string,
): Promise<BaseApiResponse<MediasResponse | null>> => {
    const result = await api.get(`/medias/any-id/${id}`, {
        params: { targetTable },
    })
    return result.data
}

const findAllMedia = async (query?: GetMediasQueryInputsType): Promise<BaseApiResponse<MediasResponse[] | null>> => {

    const result = await api.get('/medias', { params: { ...query } })

    return result.data
}

const handleExportMedia = async (
    query?: GetMediasQueryInputsType,
): Promise<BaseApiResponse<MediasResponse>> => {
    const result = await api.get('/medias/export', {
        params: {
            ...query,
            export: true,
        },
        responseType: 'blob',
    })

    return result.data
}

export {
    createMedia,
    updateMediaById,
    deleteMediaById,
    findAllMedia,
    findMediaById,
    findMediaByAnyId,
    handleExportMedia,
}
