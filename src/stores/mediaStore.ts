import { defineStore } from 'pinia'
import {
    handleStoreDelete,
    handleStoreEdit,
    handleStoreAdd,
    handleStoreFetch,
    handleStoreExport,
} from '@/utils/store'

import {
    createMedia,
    updateMediaById,
    deleteMediaById,
    findAllMedia,
    findMediaById,
    findMediaByAnyId,
    handleExportMedia,
} from '@/api/data/medias'

import type {
    CreateMediaInputsType,
    UpdateMediaInputsType,
    GetMediasQueryInputsType,
} from '@/schemas/mediaSchema'

import { OrderingEnum } from '@/types/globalTypes'
import type { MediasResponse, BaseStore } from '@/types/globalTypes'

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



const useMediaStore = defineStore('media', {
    state: (): MediaState => ({
        medias: [],
        currentMedia: null,
        pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPage: 0,
        },
        filters: {
            search: null,
            category: null,
            sortBy: 'created_at',
            sortOrder: OrderingEnum.DESC,
        },
        isLoading: false,
        successMessage: '',
        errorMessage: '',
    }),
    getters: {
        // 👈 يحول الـ filters والـ pagination إلى Flat Query Object نظيف للـ API
        queryParams: (state): GetMediasQueryInputsType => ({
            search: state.filters.search ?? undefined,
            category: state.filters.category ?? undefined,
            sortBy: state.filters.sortBy,
            sortOrder: state.filters.sortOrder,
            page: state.pagination.page,
            limit: state.pagination.limit,
        }),
    },
    actions: {
        async exportMedia(filters: GetMediasQueryInputsType): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            return handleStoreExport<GetMediasQueryInputsType, MediaState>({
                store: this,
                apiCall: handleExportMedia,
                args: filters,
                defaultFileName: `medias-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير الاعمال!',
            })
        },
        async getMediaById(id: number, force: boolean = true): Promise<MediasResponse | null> {
            const data: MediasResponse | null = await handleStoreFetch<
                MediasResponse,
                number,
                MediaState
            >({
                store: this,
                apiCall: findMediaById,
                args: id,
                targetKey: 'currentMedia',
                defaultError: 'حدث خطأ اثناء جلب الميديا بالمعرف (id)',
                force,
            })

            if (!data) return null

            if (data || Object.keys(data).length > 0) {
                this.medias = [data]
            }

            return data
        },
        async fetchMediaByAnyId(
            id: number,
            targetTable: string | boolean = 'all',
            force: boolean = false,
        ): Promise<MediasResponse | null> {
            if (typeof targetTable === 'boolean') {
                force = targetTable
                targetTable = 'all'
            }

            const data: MediasResponse | null = await handleStoreFetch<
                MediasResponse,
                unknown,
                MediaState
            >({
                store: this,
                apiCall: findMediaByAnyId,
                args: [id, targetTable],
                targetKey: 'currentMedia',
                defaultError: 'حدث خطأ اثناء جلب الميديا بالمعرف (id)',
                force,
            })

            if (!data) return null

            if (Object.keys(data).length > 0) {
                this.medias = [data]
            }

            return data
        },

        async addMedia(data: CreateMediaInputsType): Promise<MediasResponse | null> {
            return handleStoreAdd<MediasResponse, CreateMediaInputsType, MediaState>({
                store: this,
                apiCall: createMedia,
                data,
                listKey: 'medias',
            })
        },
        async editMediaById(
            id: number,
            data: UpdateMediaInputsType,
        ): Promise<MediasResponse | null> {
            return handleStoreEdit<MediasResponse, UpdateMediaInputsType, number, MediaState>({
                store: this,
                apiCall: updateMediaById,
                id,
                data,
                listKey: 'medias',
                defaultError: 'حدث خطأ اثناء تعديل الميديا',
            })
        },
        async removeMediaById(id: number): Promise<boolean | null> {
            return handleStoreDelete<boolean, number, MediaState>({
                store: this,
                apiCall: deleteMediaById,
                id,
                listKey: 'medias',
                defaultError: 'حدث خطأ اثناء حذف الميديا!',
            })
        },
        async fetchMedias(
            query?: GetMediasQueryInputsType,
            force: boolean = false,
        ): Promise<MediasResponse[] | null> {
            return handleStoreFetch<MediasResponse[], GetMediasQueryInputsType, MediaState>({
                store: this,
                apiCall: findAllMedia,
                args: query,
                targetKey: 'medias',
                paginationKey: 'pagination',
                defaultError: 'حدث خطأ أثناء جلب الميديا',
                force,
            })
        },
        async setSort(column: MediaState['filters']['sortBy']): Promise<MediasResponse[] | null> {
            if (this.filters.sortBy === column) {
                this.filters.sortOrder =
                    this.filters.sortOrder === OrderingEnum.ASC
                        ? OrderingEnum.DESC
                        : OrderingEnum.ASC
            } else {
                this.filters.sortBy = column
                this.filters.sortOrder = OrderingEnum.ASC
            }

            this.pagination.page = 1

            // ✅ تمرير الكائن مسطحاً مباشرة بدون كلمة query
            return await this.fetchMedias(this.queryParams, true)

        },

        async setFilters(newFilters: Partial<MediaState['filters']>): Promise<MediasResponse[] | null> {

            this.filters = { ...this.filters, ...newFilters }
            this.pagination.page = 1

            // ✅ تمرير الكائن مسطحاً مباشرة بدون كلمة query
            return await this.fetchMedias(this.queryParams, true)
        },

        async setPage(page: number): Promise<MediasResponse[] | null> {
            this.pagination.page = page
            return await this.fetchMedias(this.queryParams, true)
        },
    },
})

export { useMediaStore }
