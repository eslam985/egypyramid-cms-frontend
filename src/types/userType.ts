// ==================================
// ========== user type =============
// ==================================
export type RolesType = '2001' | '5150' | '1984'

export interface SetAndUpdateAvatarUrlResponse {
    id: string // UUID
    username: string
    avatar_url: string
    avatar_history: string[] | null
}

export interface UserDataResponse extends SetAndUpdateAvatarUrlResponse {
    email: string
    roles: RolesType
    created_at: string
    updated_at: string
    accessToken?: string
}

export interface JwtUserPayload {
    userId: string
    roles: string
    iat?: number
    exp?: number
}

export interface UserSessionDataResponse {
    id: string | number
    user_id: string | number
    user_agent: string
    ip_address: string
    expires_at: string
    created_at: string
    updated_at: string
}
