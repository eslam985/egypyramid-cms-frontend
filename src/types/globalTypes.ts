// /src/types/globalTypes.ts

export type dataType = string | number | Date

// =================================
// ============= Enum ==============
// =================================

export enum StatusTasksRequest {
    valid = 'valid',
    broken = 'broken',
    pending = 'pending',
}

export enum OrderingEnum {
    DESC = 'DESC',
    ASC = 'ASC',
}

export enum SeasonAllowedColumns {
    season_number = 'season_number',
    created_at = 'created_at',
}

export enum EpisodeAllowedColumnsSorted {
    episode_number = 'episode_number',
    created_at = 'created_at',
    media_id = 'media_id',
}

export enum LinksAllowedColumnsSorted {
    quality = 'quality',
    server_name = 'server_name',
    created_at = 'created_at',
}

// =================================
// ============= Query ==============
// =================================

export interface BaseQueryRequest {
    page?: string
    limit?: string
    sortOrder?: OrderingEnum
}

export interface SortedSessionRequest {
    sortBy?: string
    sortOrder?: OrderingEnum
}

export interface LinksQueryRequest extends BaseQueryRequest {
    sortBy?: LinksAllowedColumnsSorted
}

export interface EpisodeQueryRequest extends BaseQueryRequest {
    sortBy?: EpisodeAllowedColumnsSorted
}

export interface TasksQueryRequest extends BaseQueryRequest {
    search?: string
    status?: StatusTasksRequest
}

export interface TotalStatusTasksResponse {
    server_name: string
    last_check_status: StatusTasksRequest
    total: number
}

export interface ServerNameRequest extends BaseQueryRequest {
    serverName?: string
}

export interface SeasonQueryRequest extends BaseQueryRequest {
    sortBy?: SeasonAllowedColumns
}

// =================================
// ========== API Response =========
// =================================

export interface BaseApiResponse<T = null> {
    success: boolean
    message: string
    data: T
    pagination?: {
        total: number
        page: number
        limit: number
        totalPage: number
    }
}
export interface BaseStore {
    isLoading?: boolean
    successMessage?: string
    errorMessage?: string
    _lastFetchArgs?: string
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

export interface DownloadTasksResponse {
    id?: string | number
    task_name?: string
    source_url?: string
    status?: string
    progress_percent?: string
    download_speed?: string
    status_message?: string
    created_at?: string
    updated_at?: string
    is_cancelled?: boolean
    trailer_url?: string
    normalized_task_name?: string
    task_year?: string
    fallback_urls?: string[]
}
export interface DeleteTaskResponseData {
    deletedCount: number
}
export interface MediasResponse {
    id?: string | number
    tmdb_id?: string
    title?: string
    story?: string
    poster_url?: string
    category?: string
    year?: string
    rating?: string
    created_at?: string
    updated_at?: string
    labels?: string
    runtime?: string
    duration_iso?: string
    media_type?: string
    is_ready?: boolean
    is_notified?: boolean
    is_facebook_posted?: boolean
    facebook_posted_at?: string
    normalized_title?: string
    slug?: string
    genres?: string[]
    seasons_count?: number
}

export interface GenresResponse {
    id?: string | number
    name?: string
    slug?: string
    created_at?: string
}

export interface SeasonsResponse {
    id?: string | number
    media_id?: string | number
    season_number?: string
    created_at?: string
}

export interface EpisodeResponse {
    id?: string | number
    media_id?: string | number
    episode_number?: string
    identifier?: string
    created_at?: string
    updated_at?: string
    status_message?: string
    progress_percent?: string
    download_speed?: string
    status?: string
    download_url?: string
    season_id?: string | number
    slug?: string
}

export interface LinksResponse {
    id?: string | number
    episode_id?: string | number
    server_name?: string
    url?: string
    created_at?: string
    link_type?: string
    quality?: string
    last_check_status?: string
    last_check_at?: string
    error_message?: string
    check_count?: string
    is_fixed?: boolean
    last_success_at?: string
    old_url?: string
}

// =================================
// ========== API Request ==========
// =================================


export interface JwtUserPayload {
    userId: string
    roles: string
    iat?: number
    exp?: number
}

export interface ConfirmAndDeleteParams {
    message?: string
    action: () => Promise<boolean> | boolean
    store?: BaseStore | null
    notiStore: {
        triggerConfirm: (msg: string) => Promise<boolean> | boolean
        triggerNotification: (msg: string, ...args: unknown[]) => void
    }
    onSuccess?: () => Promise<void> | void
    fallbackSuccess?: string
    fallbackError?: string
}

export interface StoreFetchParams<
    TData = unknown,
    TInput = unknown,
    TStore extends BaseStore = BaseStore,
> {
    store?: TStore
    apiCall:
        | ((data: TInput) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
        | ((id: number | string, data?: TInput) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
        | (() => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
    args?: TInput[] | TInput | undefined
    targetKey?: keyof TStore
    defaultError?: string
    paginationKey?: keyof TStore
    force?: boolean
}

export interface StoreAddParams<
    TData = unknown,
    TInput = unknown,
    TStore extends BaseStore = BaseStore,
> {
    store?: TStore | null
    apiCall:
        | ((data: TInput) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
        | ((id: number | string, data: TInput) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
    id?: number | string
    data?: TInput
    listKey?: keyof TStore
    defaultError?: string
}

export interface StoreEditParams<
    TData = unknown,
    TInput = unknown,
    TId = number | string, // 👈 نوع الـ ID أصلح Generic
    TStore extends BaseStore = BaseStore,
> {
    store?: TStore
    apiCall:
        | ((id: TId, data: TInput) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
        | ((data: TInput) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
        | ((id: TId) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
    id?: TId
    data?: TInput
    listKey?: keyof TStore
    idKey?: keyof TData
    defaultError?: string
}

export interface StoreDeleteParams<
    TData = unknown, // 👈 التايب الخاص بعناصر القائمة في الستور (مثل Task)
    TId extends number | string | (number | string)[] = number | string,
    TStore extends BaseStore = BaseStore,
> {
    store?: TStore
    apiCall:
        | ((id: TId) => Promise<BaseApiResponse<unknown>> | BaseApiResponse<unknown>)
        | ((id?: TId) => Promise<BaseApiResponse<unknown>> | BaseApiResponse<unknown>)
        | (() => Promise<BaseApiResponse<unknown>> | BaseApiResponse<unknown>)
    id?: TId
    listKey?: keyof TStore
    idKey?: keyof TData
    defaultError?: string
    filterFn?: (items: TData[]) => TData[]
}

export interface ExportStoreParams<TInput = unknown, TStore extends BaseStore = BaseStore> {
    store?: TStore
    apiCall: (args?: TInput) => Promise<Blob | string | ArrayBuffer> | Blob | string | ArrayBuffer
    args?: TInput
    defaultFileName?: string
    defaultError?: string
}

export interface SearchParamsType<TData = unknown> {
    searchInput?: string | number | null
    notiStore: (msg: string) => void
    targetStore: {
        errorMessage: string
    }
    apiCallById: (id: number) => Promise<TData | null> | TData | null
    apiCallAll: (force?: boolean) => Promise<TData[] | TData | null> | TData[] | TData | null
    apiCallByName: (
        name: string,
        force?: boolean,
    ) => Promise<TData | TData[] | null> | TData | TData[] | null
    defaultErrorMsg?: string
}

export interface SearchResultData {
    targetId: number | null
    rawValue: string | null
}
