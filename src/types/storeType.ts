// ===========================================
// ============  Store Type ==================
// ===========================================
import type { TotalStatusLinksResponse, SystemCountersResponse, LockedTelegramResponse } from '@/types/analyticsType'
import type { UserSessionDataResponse, UserDataResponse } from '@/types/userType'
import type { SortedSessionRequest, SeasonsResponse } from '@/types/seasonType'
import type { DownloadTasksResponse } from '@/types/downloadTasksType'
import type { GetMediasQueryInputsType } from '@/schemas/mediaSchema'
import type { EpisodeResponse } from '@/types/episodeType'
import type { MediasResponse } from '@/types/mediaType'
import type { GenresResponse } from '@/types/genreType'
import type { OrderingEnum } from '@/types/globalTypes'
import type { LinksResponse } from '@/types/linkType'

export interface BaseStore {
    isLoading: boolean
    successMessage: string
    errorMessage: string
    _lastFetchArgs?: string | null
}

export interface AuthState extends BaseStore {
    user: UserDataResponse | { id: string } | null
    userRole: number | null
    accessToken: string | null
    isInitialized: boolean
    isServerError: boolean
}

export interface AnalyticsState extends BaseStore {
    systemCounters: SystemCountersResponse | null
    totalCountersStatusServeres: TotalStatusLinksResponse[]
    mediasNotReadyList: MediasResponse[]
    brokenLinksList: DownloadTasksResponse[]
    missingLinksByServer: DownloadTasksResponse[]
    telegramLocked: LockedTelegramResponse[] | []
    pagination: {
        total: number
        page: number
        limit: number
        totalPage: number
    }
}
export interface BackupState extends BaseStore {
    downloadedBytes: number
    elapsedTime: number
    timerInterval: ReturnType<typeof setInterval> | null
}
export interface Genrestate extends BaseStore {
    allGenres: GenresResponse[] | null
    currentGenre: GenresResponse | null
}

export interface MediaContentState extends BaseStore {
    seasons: SeasonsResponse[] | null
    episodes: EpisodeResponse[] | null
    links: LinksResponse[]
    currentSeason: SeasonsResponse | null
    currentEpisode: EpisodeResponse | null
    currentEpisodeId: number | string | null
    currentLink: LinksResponse | null
    pagination: {
        total: number
        page: number
        limit: number
        totalPage: number
    }
}

export interface mediaQueryParams extends GetMediasQueryInputsType {
    filters: {
        search: string | null
        category: 'movie' | 'tv' | null
        sortBy: 'category' | 'title' | 'year' | 'is_ready' | 'created_at'
        sortOrder: OrderingEnum
    }
}
// 1. حالة الـ Store النظيفة (بدون extends لـ Query)
export interface MediaState extends BaseStore {
    medias: MediasResponse[] | null
    currentMedia: MediasResponse | null
    pagination: {
        total: number
        page: number
        limit: number
        totalPage: number
    }
    filters: {
        search: string | null
        category: 'movie' | 'tv' | null
        sortBy: 'category' | 'title' | 'year' | 'is_ready' | 'created_at'
        sortOrder: OrderingEnum
    }
}
export interface NotificationState {
    isShowSideBar: boolean
    notification: {
        show: boolean
        message: string
    }
    confirmModal: {
        show: boolean
        message: string
        resolvePromise: ((value: boolean) => void) | null
    }
}

export interface TasksState extends BaseStore {
    allTasks: DownloadTasksResponse[] | []
    currentTask: null
    pagination: {
        total: number
        page: number
        limit: number
        totalPage: number
    }
    isLoading: boolean
    successMessage: string
    errorMessage: string
}

export interface UserState extends BaseStore {
    userInfo: UserDataResponse | null
    sessions: UserSessionDataResponse[]
    filters: SortedSessionRequest
}
