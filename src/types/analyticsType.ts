// ======================================
// ========== Analytics type ============
// ======================================
import type { StatusTasksRequest } from '@/types/downloadTasksType'
import type { BaseQueryRequest } from '@/types/globalTypes'

export interface SystemCountersResponse {
    total_medias: string
    ready_medias: string
    not_ready_medias: string
    total_seasons: string
    total_episodes: string
    total_genres: string
    total_tasks: string
    total_processing: string
    total_idle: string
    total_failed: string
    total_links: string
    count_broken_links: string
    count_valid_links: string
    count_pending_links: string
    missing_telegram: string
    missing_dood: string
    missing_lulu: string
    missing_mixdrop: string
    missing_streamtape: string
    missing_voe: string
    missing_vk: string
    missing_archive: string
}
export interface LockedTelegramResponse {
    id: string
    episode_id: string
    idserver_name: string
    url: string
    created_at: string
    is_ready: string
    media_type: string
    title: string
    episode_number: string
    season_number: string
    media_id: string
}
export type StatusLinksRequest = 'valid' | 'broken' | 'pending'

export interface TotalStatusLinksResponse {
    server_name: string
    last_check_status: StatusLinksRequest
    total: number
}
export interface TotalStatusTasksResponse {
    server_name: string
    last_check_status: StatusTasksRequest
    total: number
}
export interface ServerNameRequest extends BaseQueryRequest {
    serverName: string
}
