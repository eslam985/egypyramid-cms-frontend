// ==================================
// ========== episode type ==========
// ==================================
import type { BaseQueryRequest } from '@/types/globalTypes'

export interface EpisodeResponse {
    id: string
    media_id: string
    episode_number: number
    identifier: string
    created_at: string
    updated_at: string
    status_message: string
    progress_percent: number
    download_speed: string
    status: string
    download_url: string | null
    slug: string
    links_count?: number
    season_id?: string
}

export type EpisodeAllowedColumnsSorted = 'episode_number' | 'created_at' | 'media_id'

export interface EpisodeQueryRequest extends BaseQueryRequest {
    sortBy?: EpisodeAllowedColumnsSorted
}
