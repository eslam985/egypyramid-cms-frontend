
// =========================================
// ========== DownloadTasks type ===========
// =========================================

import type { BaseQueryRequest, OrderingAndSearchType } from '@/types/globalTypes'

export interface DownloadTasksResponse {
    id: string
    task_name: string
    source_url: string
    status: StatusTasksRequest
    progress_percent: number
    download_speed: string
    status_message: string
    created_at: string
    updated_at: string
    is_cancelled: boolean
    trailer_url: string | null
    normalized_task_name: string
    task_year: string | null
    fallback_urls: string[] | null
}

export interface DeleteTaskResponseData {
    deletedCount: number
}

export interface TasksQueryRequest extends BaseQueryRequest {
    search?: string
    status?: StatusTasksRequest
}

export type StatusTasksRequest = 'processing' | 'failed' | 'idle'

export interface GetAllTasksRequest extends OrderingAndSearchType {
    status?: StatusTasksRequest | undefined
}
