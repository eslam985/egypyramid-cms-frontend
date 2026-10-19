// ==================================
// ========== link type =============
// ==================================
import type { BaseQueryRequest } from '@/types/globalTypes'

export interface LinksResponse {
    id: string
    episode_id: string
    server_name: string
    url: string
    created_at: string
    link_type: string
    quality: string
    last_check_status: string | null
    last_check_at: string | null
    error_message: string | null
    check_count: number
    is_fixed: boolean
    last_success_at: string | null
    old_url: string | null
}

export type LinksAllowedColumnsSorted = 'quality' | 'server_name' | 'created_at'

export interface LinksQueryRequest extends BaseQueryRequest {
    sortBy?: LinksAllowedColumnsSorted
}
