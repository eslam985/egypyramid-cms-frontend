import { defineStore } from 'pinia'
import { useNotificationStore } from '@/stores/notificationStore'
import {
    handleStoreDelete,
    handleStoreEdit,
    handleStoreAdd,
    handleStoreFetch,
    handleStoreExport,
} from '@/utils/store'

import {
    findSeasonsByMediaId,
    createSeason,
    findSeasonById,
    updateSeasonById,
    deleteSeasonById,
    handleFindAllSeasons,
} from '@/api/data/seasons'

import {
    createLink,
    updateLinkById,
    findLinksByEpisodeId,
    findLinkById,
    deleteLinkById,
    handleFindAllLinks,
} from '@/api/data/links'

import {
    createEpisode,
    updateEpisodeById,
    findEpisodeById,
    findEpisodesByMediaId,
    findEpisodesBySeasonId,
    deleteEpisodeById,
    handleFindAllEpisodes,
} from '@/api/data/episodes'
import { sortByProperty } from '@/utils/global'
import type { CreateSeasonSchemaType, UpdateSeasonSchemaType } from '@/schemas/seasonSchema'
import type { CreateEpisodeSchemaType, UpdateEpisodeSchemaType } from '@/schemas/episodeSchema'
import type { CreateLinkSchemaType, UpdateLinkByIdSchemaType } from '@/schemas/linkSchema'
import type {
    BaseStore,
    SeasonsResponse,
    SeasonQueryRequest,
    EpisodeResponse,
    BaseQueryRequest,
    EpisodeQueryRequest,
    LinksResponse,
    LinksQueryRequest,
} from '@/types/globalTypes'

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

const useMediaContentStore = defineStore('mediaContent', {
    state: (): MediaContentState => ({
        seasons: [],
        episodes: [],
        links: [],
        currentSeason: null,
        currentEpisode: null,
        currentEpisodeId: null,
        currentLink: null,
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
    getters: {
        notiStore: () => useNotificationStore(),
    },
    actions: {
        resetContentState() {
            this.seasons = []
            this.episodes = []
            this.links = []
            this.currentSeason = null
            this.currentEpisode = null
            this.currentEpisodeId = null
            this.currentLink = null
        },
        // --- Seasons ---
        async exportSeasons(filters: SeasonQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            const isSuccess: boolean = await handleStoreExport<
                SeasonQueryRequest,
                MediaContentState
            >({
                store: this,
                apiCall: handleFindAllSeasons,
                args: filters,
                defaultFileName: `season-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير المواسم! ',
            })

            if (isSuccess) {
                this.notiStore.triggerNotification(
                    this.successMessage || 'Download completed successfully.',
                )
            } else {
                this.notiStore.triggerNotification(this.errorMessage || `The operation failed!`)
            }

            return isSuccess
        },
        async getSeasonsByMediaId(
            mediaId: number,
            force: boolean = false,
        ): Promise<SeasonsResponse[] | SeasonsResponse | null> {
            if (!mediaId) {
                this.notiStore.triggerNotification('Media Id Is Required!')
                return null
            }

            const isSuccess: SeasonsResponse | SeasonsResponse[] | null = await handleStoreFetch<
                SeasonsResponse[] | SeasonsResponse,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: findSeasonsByMediaId,
                args: mediaId,
                targetKey: 'seasons',
                defaultError: 'حدثت مشكلة اثناء جلب الموسم او المواسم',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'Data successfully retrieved.',
                )
                const seasons = Array.isArray(isSuccess) ? isSuccess : [isSuccess]
                this.seasons = sortByProperty(seasons, 'season_number')
            }

            return isSuccess
        },
        async getSeasonById(id: number, force: boolean = false): Promise<SeasonsResponse | null> {
            if (!id) {
                this.notiStore.triggerNotification('Season Id Is Required!')
                return null
            }

            const isSuccess: SeasonsResponse | null = await handleStoreFetch<
                SeasonsResponse,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: findSeasonById,
                args: id,
                targetKey: 'currentSeason',
                defaultError: 'حدثت مشكلة اثناء جلب الموسم',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || `Not Found Season Id ${id}`)
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'Data successfully retrieved.',
                )
            }

            return isSuccess
        },
        async addSeason(
            media_id: number,
            data: CreateSeasonSchemaType,
            force: boolean = true,
        ): Promise<SeasonsResponse | null> {
            if (!media_id || data) {
                this.notiStore.triggerNotification('Id And Data Is Required!')
                return null
            }

            const isSuccess: SeasonsResponse | null = await handleStoreAdd<
                SeasonsResponse,
                CreateSeasonSchemaType,
                MediaContentState
            >({
                store: this,
                apiCall: createSeason,
                id: media_id,
                data,
                listKey: 'seasons',
                defaultError: 'حدثت مشكلة اثناء إضافة الموسم',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'The addition failed!')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'The addition was successful.',
                )
            }

            return isSuccess
        },
        async editSeasonById(
            id: number,
            data: UpdateSeasonSchemaType,
        ): Promise<SeasonsResponse | null> {
            if (!id || data) {
                this.notiStore.triggerNotification('Id And Data Is Required!')
                return null
            }

            const isSuccess: SeasonsResponse | null = await handleStoreEdit<
                SeasonsResponse,
                UpdateSeasonSchemaType,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: updateSeasonById,
                id,
                data,
                listKey: 'seasons',
                defaultError: 'حدثت مشكلة اثناء تعديل الموسم',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'The addition failed!')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'The addition was successful.',
                )
            }

            return isSuccess
        },
        async removeSeasonById(id: number): Promise<boolean> {
            if (!id) {
                this.notiStore.triggerNotification('Season Id Is Required!')
                return false
            }

            const isSuccess: boolean = await handleStoreDelete<
                SeasonsResponse,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: deleteSeasonById,
                id,
                listKey: 'seasons',
                defaultError: 'حدث خطأ اثناء حذف الموسم',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || `Season Id ${id} Deleted successfuly `,
                )
            }

            return isSuccess
        },
        // --- Episodes ---
        async getEpisodeById(id: number, force: boolean = false): Promise<EpisodeResponse | null> {
            if (!id) {
                this.notiStore.triggerNotification('Episode Id Is Required!')
                return null
            }

            const isSuccess: EpisodeResponse | null = await handleStoreFetch<
                EpisodeResponse,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: findEpisodeById,
                args: id,
                targetKey: 'currentEpisode',
                defaultError: 'حدثت مشكلة اثناء جلب الحلقة',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(
                    this.errorMessage || `Not Found Episode ID ${id}`,
                )
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'Not Found')
                this.currentEpisodeId = isSuccess.id ?? null
            }
            return isSuccess
        },
        async getEpisodesByMediaId(
            media_id: number,
            params?: BaseQueryRequest,
            force: boolean = false,
        ) {
            if (!media_id) {
                this.notiStore.triggerNotification('Media Id Is Required!')
                return null
            }

            if (typeof params === 'boolean') {
                params = {}
                force = true
            }

            const isSuccess: EpisodeResponse | EpisodeResponse[] | null = await handleStoreFetch<
                EpisodeResponse[] | EpisodeResponse,
                [number, BaseQueryRequest],
                MediaContentState
            >({
                store: this,
                apiCall: findEpisodesByMediaId,
                args: [media_id, params ?? {}],
                targetKey: 'episodes',
                defaultError: 'حدث خطأ أثناء جلب الحلقات',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || `Not Found Episode`)
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'Not Found')

                const seasons = Array.isArray(isSuccess) ? isSuccess : [isSuccess]

                this.episodes = sortByProperty(seasons, 'episode_number')
            }

            return isSuccess
        },
        async getEpisodesBySeasonId(
            season_id: number,
            force: boolean = false,
        ): Promise<EpisodeResponse[] | EpisodeResponse | null> {
            if (!season_id) {
                this.notiStore.triggerNotification('Season Id Is Required!')
                return null
            }

            const isSuccess = await handleStoreFetch<
                EpisodeResponse[] | EpisodeResponse | null,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: findEpisodesBySeasonId,
                args: season_id,
                targetKey: 'episodes',
                defaultError: 'حدث خطأ أثناء جلب الحلقات',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || `Not Found Episode`)
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'Not Found')

                const seasons = Array.isArray(isSuccess) ? isSuccess : [isSuccess]
                this.episodes = sortByProperty(seasons, 'episode_number')
            }

            return isSuccess
        },
        async addEpisode(
            mediaId: number,
            data: CreateEpisodeSchemaType,
        ): Promise<EpisodeResponse | null> {
            if (!mediaId || !data) {
                this.notiStore.triggerNotification('Media Id And Data Is Required!')
                return null
            }

            const isSuccess: EpisodeResponse | null = await handleStoreAdd<
                EpisodeResponse | null,
                CreateEpisodeSchemaType,
                MediaContentState
            >({
                store: this,
                apiCall: createEpisode,
                id: mediaId,
                data,
                listKey: 'episodes',
                defaultError: 'حدث خطأ اثناء اضافة الحلقة!',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'The addition failed!')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'The addition was successful.',
                )
            }

            return isSuccess
        },
        async editEpisodeById(
            id: number,
            data: UpdateEpisodeSchemaType,
        ): Promise<EpisodeResponse | null> {
            if (!id || !data) {
                this.notiStore.triggerNotification('Id And Data Is Required!')
                return null
            }

            const isSuccess: EpisodeResponse | null = await handleStoreEdit<
                EpisodeResponse | null,
                UpdateEpisodeSchemaType,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: updateEpisodeById,
                id,
                data,
                listKey: 'episodes',
                defaultError: 'حدث خطأ اثناء تعديل الحلقة!',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'Modification failed!')
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'Successfully edited')
            }

            return isSuccess
        },
        async removeEpisodeById(id: number): Promise<boolean> {
            if (!id) {
                this.notiStore.triggerNotification('Episode Id Is Required!')
                return false
            }

            const isSuccess: boolean = await handleStoreDelete<
                EpisodeResponse,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: deleteEpisodeById,
                id,
                listKey: 'episodes',
                defaultError: 'حدث خطأ اثناء حذف الحلقة',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(
                    this.errorMessage || `Episode ID ${id} was not deleted!`,
                )
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || `Episode Id ${id} Deleted successfuly `,
                )
            }

            return isSuccess
        },

        // 💡 أكشن تصدير الحلقات المعتمد بالكامل على الـ Utility المشتركة
        async exportEpisodes(filters?: EpisodeQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            const isSuccess: boolean = await handleStoreExport<
                EpisodeQueryRequest,
                MediaContentState
            >({
                store: this,
                apiCall: handleFindAllEpisodes,
                args: filters,
                defaultFileName: `episodes-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير الحلقات ',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || `The operation failed!`)
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'Download completed successfully.',
                )
            }

            return isSuccess
        },

        // --- Links ---
        // 💡 أكشن تصدير الحلقات المعتمد بالكامل على الـ Utility المشتركة
        async exportLinks(filters?: LinksQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            const isSuccess: boolean = await handleStoreExport<
                LinksQueryRequest,
                MediaContentState
            >({
                store: this,
                apiCall: handleFindAllLinks,
                args: filters, // تمرير الفلاتر الحالية للـ API
                defaultFileName: `links-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير اللينكات! ',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || `The operation failed!`)
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'Download completed successfully.',
                )
            }

            return isSuccess
        },
        async getLinksByEpisodeId(
            episode_id: number,
            force: boolean = false,
        ): Promise<LinksResponse[] | LinksResponse | null> {
            if (!episode_id) {
                this.notiStore.triggerNotification('Episode Id Is Required!')
                return null
            }

            const isSuccess: LinksResponse | LinksResponse[] | null = await handleStoreFetch<
                LinksResponse | LinksResponse[] | null,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: findLinksByEpisodeId,
                args: episode_id,
                targetKey: 'links',
                defaultError: 'حدثت مشكلة اثناء جلب اللينكات',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || `Not Found!`)
            } else {
                const links = Array.isArray(isSuccess) ? isSuccess : [isSuccess]
                this.notiStore.triggerNotification(
                    this.successMessage || `Found ${links.length} Links successfully`,
                )
                this.links = sortByProperty(links, 'last_check_at')
            }

            return isSuccess
        },
        async getLinkById(id: number, force: boolean = false): Promise<LinksResponse | null> {
            if (!id) {
                this.notiStore.triggerNotification('Link Id Is Required!')
                return null
            }

            const isSuccess: LinksResponse | null = await handleStoreFetch<
                LinksResponse | null,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: findLinkById,
                args: id,
                targetKey: 'currentLink',
                defaultError: 'حدثت مشكلة اثناء جلب اللينك',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || `Not Found Link Id ${id}`)
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'Data successfully retrieved.',
                )
            }

            return isSuccess
        },
        async addLink(
            episode_id: number,
            data: CreateLinkSchemaType,
        ): Promise<LinksResponse | null> {
            if (!episode_id || !data) {
                this.notiStore.triggerNotification('Episode Id And Data Is Required!')
                return null
            }

            const isSuccess: LinksResponse | null = await handleStoreAdd<
                LinksResponse | null,
                CreateLinkSchemaType,
                MediaContentState
            >({
                store: this,
                apiCall: createLink,
                id: episode_id,
                data,
                listKey: 'links',
                defaultError: 'حدثت مشكلة اثناء اضافة الرابط',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'The addition failed!')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'The addition was successful.',
                )
                const links = Array.isArray(isSuccess) ? isSuccess : [isSuccess]
                this.links = sortByProperty(links, 'last_check_at')
            }

            return isSuccess
        },
        async editLinkById(
            id: number,
            data: UpdateLinkByIdSchemaType,
        ): Promise<LinksResponse | null> {
            if (!id || !data) {
                this.notiStore.triggerNotification('Episode Id And Data Is Required!')
                return null
            }

            const isSuccess: LinksResponse | null = await handleStoreEdit<
                LinksResponse | null,
                UpdateLinkByIdSchemaType,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: updateLinkById,
                id,
                data,
                listKey: 'links',
                defaultError: 'حدث خطأ اثناء تعديل الرابط',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'The addition failed!')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || 'The addition was successful.',
                )
                const newLinks = Array.isArray(isSuccess) ? isSuccess : [isSuccess]
                this.links = sortByProperty(newLinks, 'last_check_at')
            }

            return isSuccess
        },
        async removeLinkById(id: number): Promise<boolean> {
            if (!id) {
                this.notiStore.triggerNotification('Episode Id And Data Is Required!')
                return false
            }
            const isSuccess: boolean = await handleStoreDelete<
                LinksResponse,
                number,
                MediaContentState
            >({
                store: this,
                apiCall: deleteLinkById,
                id,
                listKey: 'links',
                defaultError: 'حدث خطأ اثناء حذف الرابط',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(
                    this.errorMessage || `An error occurred, or we couldn't find it.`,
                )
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || `Link Id ${id} Deleted successfuly `,
                )
            }

            return isSuccess
        },
    },
})

export { useMediaContentStore }
