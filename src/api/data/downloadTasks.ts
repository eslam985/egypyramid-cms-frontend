import api from '@/api/auth/interceptors'

import type { CreateTaskInputsType, UpdateTaskInputsType } from '@/schemas/downloadTaskSchema'

import type { BaseApiResponse, DownloadTasksResponse, TasksQueryRequest, DeleteTaskResponseData } from '@/types/globalTypes'

const createTask = async (
    data: CreateTaskInputsType,
): Promise<BaseApiResponse<DownloadTasksResponse | null>> => {
    const result = await api.post('/tasks', data)
    return result.data
}

const updateTaskById = async (
    id: number,
    data: UpdateTaskInputsType,
): Promise<BaseApiResponse<DownloadTasksResponse | null>> => {
    const result = await api.patch(`/tasks/${id}`, data)
    return result.data
}

const getAllTasks = async (query?: TasksQueryRequest): Promise<BaseApiResponse<DownloadTasksResponse[] | null>> => {

    const result = await api.get('/tasks', { params: { ...query } })

    return result.data
}

const exportTasksToCSV = async (query?: TasksQueryRequest): Promise<Blob> => {
    const result = await api.get('/tasks', {
        params: {
            ...query,
            export: true,
        },
        responseType: 'blob',
    })

    return result.data
}

const findByTaskId = async (id: number): Promise<BaseApiResponse<DownloadTasksResponse | null>> => {
    const result = await api.get(`/tasks/${id}`)
    return result.data
}

const deleteTaskById = async (id: number): Promise<BaseApiResponse<DeleteTaskResponseData>> => {
    const result = await api.delete(`/tasks/${id}`)
    return result.data
}

const deleteAllTasksFailed = async (): Promise<BaseApiResponse<number | null>> => {
    const result = await api.delete(`/tasks/failed`)
    return result.data
}

const deleteTasksByIds = async (ids: number[]): Promise<BaseApiResponse<number | null>> => {
    const result = await api.delete(`/tasks`, {
        data: { ids }, // [1,5,10]
    })
    return result.data
}

export {
    createTask,
    updateTaskById,
    getAllTasks,
    findByTaskId,
    deleteTaskById,
    deleteAllTasksFailed,
    deleteTasksByIds,
    exportTasksToCSV,
}
