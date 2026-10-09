import api from '../auth/interceptors'

import type { CreateGenreSchemaType, UpdateGenreByIdSchemaType } from '@/schemas/genreSchema'

import type { BaseApiResponse, GenresResponse } from '@/types/globalTypes'

const findGenreByName = async (name: string): Promise<BaseApiResponse<GenresResponse | null>> => {
    const result = await api.get('/genres/search', {
        params: { name },
    })
    return result.data
}

const findGenreById = async (id: number): Promise<BaseApiResponse<GenresResponse | null>> => {
    const result = await api.get(`/genres/${id}`)
    return result.data
}

const createGenre = async (
    data: CreateGenreSchemaType,
): Promise<BaseApiResponse<GenresResponse | null>> => {
    const result = await api.post('/genres', data)
    return result.data
}

const updateGenreById = async (
    id: number,
    data: UpdateGenreByIdSchemaType,
): Promise<BaseApiResponse<GenresResponse | null>> => {
    const result = await api.patch(`/genres/${id}`, data)
    return result.data
}

const deleteGenreById = async (id: number): Promise<BaseApiResponse<GenresResponse | null>> => {
    const result = await api.delete(`/genres/${id}`)
    return result.data
}

const findAllGenres = async (): Promise<BaseApiResponse<GenresResponse[] | any[]>> => {
    const result = await api.get('/genres')
    return result.data
}

const handleExportGenresToCSV = async (): Promise<Blob> => {
    const result = await api.get('/genres', {
        params: { export: true },
        responseType: 'blob',
    })

    return result.data
}

export {
    findGenreByName,
    findAllGenres,
    createGenre,
    findGenreById,
    updateGenreById,
    deleteGenreById,
    handleExportGenresToCSV,
}
