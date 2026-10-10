import api from '@/api/auth/interceptors'

import type { CreateLinkSchemaType, UpdateLinkByIdSchemaType } from '@/schemas/linkSchema'

import type { BaseApiResponse, LinksResponse, LinksQueryRequest } from '@/types/globalTypes'

const createLink = async (
    episode_id: number,
    data: CreateLinkSchemaType,
): Promise<BaseApiResponse<LinksResponse | null>> => {
    const result = await api.post(`/links/episode/${episode_id}`, data)

    return result.data
}

const updateLinkById = async (
    id: number,
    data: UpdateLinkByIdSchemaType,
): Promise<BaseApiResponse<LinksResponse | null>> => {
    const result = await api.patch(`/links/${id}`, data)
    return result.data
}

const findLinksByEpisodeId = async (
    episode_id: number,
): Promise<BaseApiResponse<LinksResponse[] | LinksResponse | null>> => {
    const result = await api.get(`/links/episode/${episode_id}`)
    return result.data
}

const findLinkById = async (id: number): Promise<BaseApiResponse<LinksResponse | null>> => {
    const result = await api.get(`/links/${id}`)
    return result.data
}

const deleteLinkById = async (id: number): Promise<BaseApiResponse<LinksResponse | null>> => {
    const result = await api.delete(`/links/${id}`)
    return result.data
}

const handleFindAllLinks = async (
    params: LinksQueryRequest,
): Promise<BaseApiResponse<Blob | LinksResponse[] | LinksResponse | null>> => {

    const result = await api.get('/links', {

        params: { ...params, export: true },
        responseType: 'blob',
    })

    return result.data
}

export {
    createLink,
    updateLinkById,
    findLinksByEpisodeId,
    findLinkById,
    deleteLinkById,
    handleFindAllLinks,
}
