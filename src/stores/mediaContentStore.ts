import { defineStore } from 'pinia'
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

            return handleStoreExport<SeasonQueryRequest, MediaContentState>({
                store: this,
                apiCall: handleFindAllSeasons,
                args: filters,
                defaultFileName: `season-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير المواسم! ',
            })
        },
        async getSeasonsByMediaId(
            mediaId: number,
            force: boolean = false,
        ): Promise<SeasonsResponse[] | SeasonsResponse | null> {
            const data: SeasonsResponse | SeasonsResponse[] | null = await handleStoreFetch<
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

            // التعديل الأفضل (استخدام Array.isArray كما فعلت في الحلقات)
            if (Array.isArray(data)) {
                this.seasons = sortByProperty(data, 'season_number')
            }

            return data
        },
        async getSeasonById(id: number, force: boolean = false): Promise<SeasonsResponse | null> {
            return handleStoreFetch<SeasonsResponse, number, MediaContentState>({
                store: this,
                apiCall: findSeasonById,
                args: id,
                targetKey: 'currentSeason',
                defaultError: 'حدثت مشكلة اثناء جلب الموسم',
                force,
            })
        },
        async addSeason(
            media_id: number,
            data: CreateSeasonSchemaType,
            force: boolean = true,
        ): Promise<SeasonsResponse | null> {
            return handleStoreAdd<SeasonsResponse, CreateSeasonSchemaType, MediaContentState>({
                store: this,
                apiCall: createSeason,
                id: media_id,
                data,
                listKey: 'seasons',
                defaultError: 'حدثت مشكلة اثناء إضافة الموسم',
                force,
            })
        },
        async editSeasonById(
            id: number,
            data: UpdateSeasonSchemaType,
        ): Promise<SeasonsResponse | null> {
            return handleStoreEdit<
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
        },
        async removeSeasonById(id: number): Promise<boolean | null> {
            return handleStoreDelete<SeasonsResponse, number, MediaContentState>({
                store: this,
                apiCall: deleteSeasonById,
                id,
                listKey: 'seasons',
                defaultError: 'حدث خطأ اثناء حذف الموسم',
            })
        },
        // --- Episodes ---
        async getEpisodeById(id: number, force: boolean = false): Promise<EpisodeResponse | null> {
            const data: EpisodeResponse | null = await handleStoreFetch<
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

            if (data && Object.keys(data).length > 0 && 'id' in data) {
                this.currentEpisodeId = data.id ?? null
            }

            return data
        },
        async getEpisodesByMediaId(
            media_id: number,
            params: BaseQueryRequest,
            force: boolean = false,
        ) {
            if (typeof params === 'boolean') {
                params = {}
                force = true
            }

            const resultData: EpisodeResponse | EpisodeResponse[] | null = await handleStoreFetch<
                EpisodeResponse[] | EpisodeResponse,
                [number, BaseQueryRequest],
                MediaContentState
            >({
                store: this,
                apiCall: findEpisodesByMediaId,
                args: [media_id, params],
                targetKey: 'episodes',
                defaultError: 'حدث خطأ أثناء جلب الحلقات',
                force,
            })

            // الترتيب فقط في حال نجاح الجلب ورجوع مصفوفة
            if (Array.isArray(resultData)) {
                this.episodes = sortByProperty(resultData, 'episode_number')
            }

            return resultData
        },
        async getEpisodesBySeasonId(
            season_id: number,
            force: boolean = false,
        ): Promise<EpisodeResponse[] | EpisodeResponse | null> {
            const resultData = await handleStoreFetch<
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

            // الترتيب فقط في حال نجاح الجلب ورجوع مصفوفة
            if (Array.isArray(resultData)) {
                this.episodes = sortByProperty(resultData, 'episode_number')
            }

            return resultData
        },
        async addEpisode(
            mediaId: number,
            data: CreateEpisodeSchemaType,
        ): Promise<EpisodeResponse | null> {
            return handleStoreAdd<
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
        },
        async editEpisodeById(
            id: number,
            data: UpdateEpisodeSchemaType,
        ): Promise<EpisodeResponse | null> {
            return handleStoreEdit<
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
        },
        async removeEpisodeById(id: number): Promise<boolean> {
            return handleStoreDelete<EpisodeResponse, number, MediaContentState>({
                store: this,
                apiCall: deleteEpisodeById,
                id,
                listKey: 'episodes',
                defaultError: 'حدث خطأ اثناء حذف الحلقة',
            })
        },

        // 💡 أكشن تصدير الحلقات المعتمد بالكامل على الـ Utility المشتركة
        async exportEpisodes(filters: EpisodeQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            return handleStoreExport<EpisodeQueryRequest, MediaContentState>({
                store: this,
                apiCall: handleFindAllEpisodes,
                args: filters,
                defaultFileName: `episodes-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير الحلقات ',
            })
        },

        // --- Links ---
        // 💡 أكشن تصدير الحلقات المعتمد بالكامل على الـ Utility المشتركة
        async exportLinks(filters: LinksQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            return handleStoreExport<LinksQueryRequest, MediaContentState>({
                store: this,
                apiCall: handleFindAllLinks,
                args: filters, // تمرير الفلاتر الحالية للـ API
                defaultFileName: `links-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير اللينكات! ',
            })
        },
        async getLinksByEpisodeId(
            episode_id: number,
            force: boolean = false,
        ): Promise<LinksResponse[] | LinksResponse | null> {
            const data: LinksResponse | LinksResponse[] | null = await handleStoreFetch<
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

            if (data && Array.isArray(this.links)) {
                // تمرير false للترتيب التنازلي (من الأحدث للأقدم)
                this.links = sortByProperty(this.links, 'last_check_at')
            }

            return data
        },
        async getLinkById(id: number, force: boolean = false): Promise<LinksResponse | null> {
            return handleStoreFetch<LinksResponse | null, number, MediaContentState>({
                store: this,
                apiCall: findLinkById,
                args: id,
                targetKey: 'currentLink',
                defaultError: 'حدثت مشكلة اثناء جلب اللينك',
                force,
            })
        },
        async addLink(
            episode_id: number,
            data: CreateLinkSchemaType,
        ): Promise<LinksResponse | null> {
            const resultData: LinksResponse | null = await handleStoreAdd<
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

            if (resultData && Array.isArray(this.links)) {
                this.links = sortByProperty(this.links, 'last_check_at')
            }

            return resultData
        },
        async editLinkById(
            id: number,
            data: UpdateLinkByIdSchemaType,
        ): Promise<LinksResponse | null> {
            const resultData: LinksResponse | null = await handleStoreEdit<
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

            // إعادة الترتيب بعد نجاح التعديل

            if (resultData && Array.isArray(this.links)) {
                this.links = sortByProperty(this.links, 'last_check_at')
            }

            return resultData
        },
        async removeLinkById(id: number): Promise<boolean> {
            return handleStoreDelete<LinksResponse, number, MediaContentState>({
                store: this,
                apiCall: deleteLinkById,
                id,
                listKey: 'links',
                defaultError: 'حدث خطأ اثناء حذف الرابط',
            })
        },
    },
})

export { useMediaContentStore }
