// ==================================
// ========== user type =============
// ==================================
export interface JwtUserPayload {
    userId: string
    roles: string
    iat?: number
    exp?: number
}

export interface UserDataResponse {
    accessToken?: string
    userId?: string
    roles?: string
    id?: string | number
    username?: string
    email?: string
    avatar_url?: string | null
    avatar_history?: string[] | string | null
    created_at?: string
    updated_at?: string
}

export interface RegisterDataResponse {
    id: string | number
    username: string
    email: string
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
