// ==================================
// ========== media type ============
// ==================================
export interface MediasResponse {
    id: string
    tmdb_id: string | null
    title: string
    story: string | null
    poster_url: string | null
    category: 'movie' | 'tv'
    year: string | null
    rating: string | null
    created_at: string
    updated_at: string
    labels: string
    runtime: string | null
    duration_iso: string | null
    media_type: 'movie' | 'series'
    is_ready: boolean
    is_notified: boolean
    is_facebook_posted: boolean
    facebook_posted_at: string
    normalized_title: string
    slug: string
    genres?: (string | number | null)[] | null
    media_id?: string
    seasons_count?: number
}

export interface MediaGenreResponse {
    media_id: string
    genre_id: string
}

export interface FindMediaByAnyIdResponse {
    media_id: string
    media_title: string
    found_in: string
}
