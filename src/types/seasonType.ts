// ==================================
// ========== season type ===========
// ==================================
import type { BaseQueryRequest, OrderingEnum } from '@/types/globalTypes'
export interface SeasonsResponse {
    id: string
    media_id: string
    season_number: number
    created_at: string
    episodes_count?: number
}

export type SeasonAllowedColumns = 'season_number' | 'created_at'

export interface SeasonQueryRequest extends BaseQueryRequest {
    sortBy?: SeasonAllowedColumns
}

export interface SortedSessionRequest {
    sortBy?: string | null
    sortOrder?: OrderingEnum
}
