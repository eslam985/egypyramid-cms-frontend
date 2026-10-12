import { defineStore } from 'pinia'
import {
    getSystemCounters,
    getTotalBrokenAndValidAndPendingLinks,
    getNotReadyMedias,
    getBrokenLinks,
    getMissingEpisodesByServer,
    getLockedTelegramLinks,
    handleExportNotReadyMedias,
    handleExportBrokenLinks,
    handleExportMissingEpisodesByServer,
    handleExportLockedTelegramLinks,
} from '@/api/data/analytics'

import { handleStoreFetch, handleStoreExport } from '@/utils/store'
import { useNotificationStore } from '@/stores/notificationStore'
const notiStore = useNotificationStore()

import type { BaseStore } from '@/types/globalTypes'
import type {
    SystemCountersResponse,
    StatusTasksRequest,
    MediasResponse,
    DownloadTasksResponse,
    TotalStatusLinksResponse,
    BaseQueryRequest,
    ServerNameRequest,
    LockedTelegramResponse,
} from '@/types/globalTypes'

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

const useAnalyticsStore = defineStore('analytics', {
    state: (): AnalyticsState => ({
        systemCounters: {} as SystemCountersResponse,
        totalCountersStatusServeres: [],
        mediasNotReadyList: [],
        brokenLinksList: [],
        missingLinksByServer: [],
        telegramLocked: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPage: 0,
        },
        isLoading: false,
        successMessage: '',
        errorMessage: '',
    }),
    actions: {
        resetContentState(): void {
            this.systemCounters = null
            this.totalCountersStatusServeres = []
            this.mediasNotReadyList = []
            this.brokenLinksList = []
            this.missingLinksByServer = []
            this.telegramLocked = []
        },
        async exportNotReadyMedia(filters: BaseQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            const isSuccess: boolean = await handleStoreExport<BaseQueryRequest, AnalyticsState>({
                store: this,
                apiCall: handleExportNotReadyMedias,
                args: filters,
                defaultFileName: `not-ready-medias-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير الاعمال الغير جاهزة!',
            })

            if (isSuccess) {
                notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح!')
            } else {
                notiStore.triggerNotification(this.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
            }

            return isSuccess
        },
        async exportBrokenLinks(filters: ServerNameRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            return handleStoreExport<ServerNameRequest, AnalyticsState>({
                store: this,
                apiCall: handleExportBrokenLinks,
                args: filters,
                defaultFileName: `export-broken-links-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير اللينكات التالفة!',
            })
        },
        async exportMissingEpisodesByServer(filters: ServerNameRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            const isSuccess: boolean = await handleStoreExport<ServerNameRequest, AnalyticsState>({
                store: this,
                apiCall: handleExportMissingEpisodesByServer,
                args: filters,
                defaultFileName: `export-missing-episodes-by-server-name-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير السرفرات المفقودة من الحلقات!',
            })

            if (isSuccess) {
                notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح!')
            } else {
                notiStore.triggerNotification(this.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
            }

            return isSuccess
        },
        async exportLockedTelegramLinks(filters: BaseQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            const isSuccess: boolean = await handleStoreExport<BaseQueryRequest, AnalyticsState>({
                store: this,
                apiCall: handleExportLockedTelegramLinks,
                args: filters,
                defaultFileName: `export-locked-telegram-links-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير لينكات تليجرام المحجوزة!',
            })

            if (isSuccess) {
                notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح!')
            } else {
                notiStore.triggerNotification(this.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
            }

            return isSuccess
        },

        async fetchAllCounters(force = false): Promise<SystemCountersResponse | null> {
            return handleStoreFetch<SystemCountersResponse | null, never, AnalyticsState>({
                store: this,
                apiCall: getSystemCounters,
                targetKey: 'systemCounters',
                defaultError: 'حدث خطا أثناء جلب العدادات!',
                force,
            })
        },
        async fetchMissingEpisodesByServer(
            params: ServerNameRequest,
            force = false,
        ): Promise<DownloadTasksResponse[] | null> {
            const isSuccess: DownloadTasksResponse[] | null = await handleStoreFetch<
                DownloadTasksResponse[] | null,
                ServerNameRequest,
                AnalyticsState
            >({
                store: this,
                apiCall: getMissingEpisodesByServer,
                args: params,
                targetKey: 'missingLinksByServer',
                defaultError: 'حدث خطا أثناء جلب السرفرات المفقودة!',
                force,
            })

            if (isSuccess && isSuccess?.length > 0) {
                notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح!')
            } else {
                notiStore.triggerNotification(this.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
            }

            return isSuccess
        },
        async fetchTotalCountersStatusServers(
            status: StatusTasksRequest,
            force = false,
        ): Promise<TotalStatusLinksResponse[] | null> {
            return handleStoreFetch<
                TotalStatusLinksResponse[] | null,
                StatusTasksRequest,
                AnalyticsState
            >({
                store: this,
                apiCall: getTotalBrokenAndValidAndPendingLinks,
                args: status,
                targetKey: 'totalCountersStatusServeres',
                defaultError: 'حدث خطا أثناء جلب الحالات!',
                force,
            })
        },
        async fetchNotReadyMedias(
            params: BaseQueryRequest,
            force = false,
        ): Promise<MediasResponse[] | null> {
            if (typeof params === 'boolean') {
                params = {}
                force = true
            }

            const isSuccess: MediasResponse[] | null = await handleStoreFetch<
                MediasResponse[] | null,
                BaseQueryRequest,
                AnalyticsState
            >({
                store: this,
                apiCall: getNotReadyMedias,
                args: params,
                targetKey: 'mediasNotReadyList',
                defaultError: 'حدث خطا أثناء جلب الاعمال الغير جاهزة!',
                force,
            })

            if (isSuccess && isSuccess?.length > 0) {
                notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح!')
            } else {
                notiStore.triggerNotification(this.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
            }

            return isSuccess
        },
        async fetchBrokenLinks(
            params: ServerNameRequest,
            force = false,
        ): Promise<DownloadTasksResponse[] | null> {
            if (params.serverName === undefined) {
                params.serverName = 'telegram_direct'
                force = true
            }

            return handleStoreFetch<
                DownloadTasksResponse[] | null,
                ServerNameRequest,
                AnalyticsState
            >({
                store: this,
                apiCall: getBrokenLinks,
                args: params,
                targetKey: 'brokenLinksList',
                defaultError: 'حدث خطا أثناء جلب اللينكات المكسورة!',
                force,
            })
        },
        async fetchLockedTelegramLinks(
            params: BaseQueryRequest,
            force = false,
        ): Promise<LockedTelegramResponse[] | null> {
            if (typeof params === 'boolean') {
                params = {}
                force = true
            }

            const isSuccess: LockedTelegramResponse[] | null = await handleStoreFetch<
                LockedTelegramResponse[] | null,
                BaseQueryRequest,
                AnalyticsState
            >({
                store: this,
                apiCall: getLockedTelegramLinks,
                args: params,
                targetKey: 'telegramLocked',
                defaultError: 'حدث خطا أثناء جلب اللينكات المحجوزة!',
                force,
            })

            if (isSuccess && isSuccess?.length > 0) {
                notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح!')
            } else {
                notiStore.triggerNotification(this.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
            }

            return isSuccess

        },
    },
})

export { useAnalyticsStore }
