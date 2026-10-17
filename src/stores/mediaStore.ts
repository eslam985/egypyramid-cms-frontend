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
import type { MediasResponse, MediaState } from '@/types/globalTypes'

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
        notiStore: () => useNotificationStore(),

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

            const isSuccess: boolean = await handleStoreExport<
                GetMediasQueryInputsType,
                MediaState
            >({
                store: this,
                apiCall: handleExportMedia,
                args: filters,
                defaultFileName: `medias-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير الاعمال!',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'تعذر جلب البيانات')
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح')
            }

            return isSuccess
        },
        async getMediaById(id: number, force: boolean = true): Promise<MediasResponse | null> {
            if (!id) {
                this.notiStore.triggerNotification('Media Id Is Required!')
                return null
            }

            const isSuccess: MediasResponse | null = await handleStoreFetch<
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

            if (isSuccess) {
                this.notiStore.triggerNotification(
                    this.successMessage || `Found Media ID ${id} successfuly `,
                )
                this.medias = [isSuccess]
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            }

            return isSuccess
        },
        async fetchMediaByAnyId(
            id: number,
            targetTable: 'all' | 'episodes' | 'links' | 'medias' | 'seasons',
            force: boolean = false,
        ): Promise<MediasResponse | null> {
            if (!id) {
                this.notiStore.triggerNotification('ID Is required!')
                return null
            }

            if (typeof targetTable === 'boolean') {
                force = targetTable
                targetTable = 'all'
            }

            const isSuccess: MediasResponse[] | MediasResponse | null = await handleStoreFetch<
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

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || `Found Media ID ${isSuccess.id} successfuly `,
                )
                this.medias = [isSuccess]
                this.currentMedia =
                    Array.isArray(isSuccess) &&  isSuccess !== null ? isSuccess[0] : isSuccess
            }

            return isSuccess
        },

        async addMedia(data: CreateMediaInputsType): Promise<MediasResponse | null> {
            if (!data) {
                this.notiStore.triggerNotification('data is required!')
            }

            const isSuccess: MediasResponse | null = await handleStoreAdd<
                MediasResponse,
                CreateMediaInputsType,
                MediaState
            >({
                store: this,
                apiCall: createMedia,
                data,
                listKey: 'medias',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'تم اضافة الميديا بنجاح')
            }

            return isSuccess
        },
        async editMediaById(
            id: number,
            data: UpdateMediaInputsType,
        ): Promise<MediasResponse | null> {
            if (!data || !id) {
                this.notiStore.triggerNotification('ID And Data is required!')
            }

            const isSuccess: MediasResponse | null = await handleStoreEdit<
                MediasResponse,
                UpdateMediaInputsType,
                number,
                MediaState
            >({
                store: this,
                apiCall: updateMediaById,
                id,
                data,
                listKey: 'medias',
                defaultError: 'حدث خطأ اثناء تعديل الميديا',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'لم يتم التعديل')
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'تم تعديل التصنيف بنجاح')
            }

            return isSuccess
        },
        async removeMediaById(id: number): Promise<boolean> {
            if (!id) {
                this.notiStore.triggerNotification('Id Is required!')
                return false
            }

            const isSuccess: boolean = await handleStoreDelete<boolean, number, MediaState>({
                store: this,
                apiCall: deleteMediaById,
                id,
                listKey: 'medias',
                defaultError: 'حدث خطأ اثناء حذف الميديا!',
            })

            if (isSuccess) {
                this.notiStore.triggerNotification(
                    this.successMessage || `Media ID ${id} Deleted successfuly `,
                )
            } else {
                this.notiStore.triggerNotification(
                    this.errorMessage || `Media ID ${id} was not deleted!`,
                )
            }

            return isSuccess
        },
        async fetchMedias(
            query?: GetMediasQueryInputsType,
            force: boolean = false,
        ): Promise<MediasResponse[] | null> {
            const isSuccess: MediasResponse[] | null = await handleStoreFetch<
                MediasResponse[],
                GetMediasQueryInputsType,
                MediaState
            >({
                store: this,
                apiCall: findAllMedia,
                args: query,
                targetKey: 'medias',
                paginationKey: 'pagination',
                defaultError: 'حدث خطأ أثناء جلب الميديا',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || `Found ${isSuccess?.length} Media successfuly `,
                )
            }

            return isSuccess
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

        async setFilters(
            newFilters: Partial<MediaState['filters']>,
        ): Promise<MediasResponse[] | null> {
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
