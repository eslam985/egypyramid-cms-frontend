import { defineStore } from 'pinia'
import type { CreateGenreSchemaType, UpdateGenreByIdSchemaType } from '@/schemas/genreSchema'
import type { GenresResponse, BaseStore } from '@/types/globalTypes'
import { useNotificationStore } from '@/stores/notificationStore'

import {
    handleStoreDelete,
    handleStoreEdit,
    handleStoreAdd,
    handleStoreFetch,
    handleStoreExport,
} from '@/utils/store'

import {
    findGenreByName,
    findGenreById,
    findAllGenres,
    createGenre,
    updateGenreById,
    deleteGenreById,
    handleExportGenresToCSV,
} from '@/api/data/genres'

export interface Genrestate extends BaseStore {
    allGenres: GenresResponse[] | null
    currentGenre: GenresResponse | null
}

const useGenresStore = defineStore('genre', {
    state: (): Genrestate => ({
        allGenres: [],
        currentGenre: null,
        isLoading: false,
        successMessage: '',
        errorMessage: '',
    }),
    getters: {
        notiStore: () => useNotificationStore(),
    },
    actions: {
        resetGenreState(): void {
            this.allGenres = []
            this.currentGenre = null
            this.isLoading = false
            this.successMessage = ''
            this.errorMessage = ''
        },

        async fetchAllGenres(force: boolean = false): Promise<GenresResponse[] | null> {
            const isSuccess: GenresResponse[] | null = await handleStoreFetch<
                GenresResponse[],
                unknown,
                Genrestate
            >({
                store: this,
                apiCall: findAllGenres,
                targetKey: 'allGenres',
                force,
                defaultError: 'حدث خطأ أثناء جلب التصنيفات',
            })

            if (isSuccess && isSuccess?.length > 0) {
                this.notiStore.triggerNotification(this.successMessage || 'تم جلب البيانات بنجاح')
            } else {
                this.notiStore.triggerNotification(
                    this.errorMessage || 'حدث خطأ اثناء تحميل البيانات!',
                )
            }

            return isSuccess
        },

        async fetchGenreByName(
            name: string,
            force: boolean = true,
        ): Promise<GenresResponse | null> {
            if (!name) {
                throw new Error('name required!')
            }
            const isSuccess: GenresResponse | null = await handleStoreFetch<
                GenresResponse,
                string,
                Genrestate
            >({
                store: this,
                apiCall: findGenreByName,
                args: name,
                defaultError: 'حدث خطأ أثناء جلب التصنيف بالاسم',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || `found ${isSuccess.name} Successfully`,
                )

                this.currentGenre = isSuccess
                this.allGenres = [isSuccess]
            }

            return isSuccess
        },

        async fetchGenreById(id: number, force: boolean = false): Promise<GenresResponse | null> {
            if (!id) {
                this.notiStore.triggerNotification('Id is Required!')
                return null
            }

            const isSuccess: GenresResponse | null = await handleStoreFetch<
                GenresResponse,
                number,
                Genrestate
            >({
                store: this,
                apiCall: findGenreById,
                args: id,
                targetKey: 'currentGenre',
                defaultError: 'حدث خطا اثناء جلب التصنيف بالمعرف (id)',
                force,
            })

            if (isSuccess && Object.keys(isSuccess).length > 0) {
                this.notiStore.triggerNotification(this.successMessage || `found genre Id ${id}`)
                this.allGenres = [isSuccess]
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            }

            return isSuccess
        },

        async exportGenres(): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            const isSuccess: boolean = await handleStoreExport({
                store: this,
                apiCall: handleExportGenresToCSV,
                defaultFileName: `genres-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير الأقسام!',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'تعذر جلب البيانات')
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح')
            }

            return isSuccess
        },

        async addGenre(data: CreateGenreSchemaType): Promise<GenresResponse | null> {
            if (!data) {
                this.notiStore.triggerNotification('data Is required!')
                return null
            }

            const isSuccess: GenresResponse | null = await handleStoreAdd<
                GenresResponse,
                CreateGenreSchemaType,
                Genrestate
            >({
                store: this,
                apiCall: createGenre,
                data,
                listKey: 'allGenres',
                defaultError: 'حدث خطا اثناء انشاء التصنيف',
            })

            if (isSuccess && Object.keys(isSuccess).length > 0) {
                this.notiStore.triggerNotification(this.successMessage || 'تم اضافة التصنيف بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'Not Found')
            }

            return isSuccess
        },

        async editGenreById(
            id: number,
            data: UpdateGenreByIdSchemaType,
        ): Promise<GenresResponse | null> {
            if (!id || !data) {
                this.notiStore.triggerNotification('Id And Data Required')
                return null
            }

            const isSuccess: GenresResponse | null = await handleStoreEdit<
                GenresResponse,
                UpdateGenreByIdSchemaType,
                number,
                Genrestate
            >({
                store: this,
                apiCall: updateGenreById, // أصبحت مطابقة 100% لأن كلاهما يتوقع number
                id,
                data,
                listKey: 'allGenres',
                defaultError: 'حدث خطأ اثناء تعديل التصنيف',
            })

            if (isSuccess && Object.keys(isSuccess).length > 0) {
                this.notiStore.triggerNotification(this.successMessage || 'تم تعديل التصنيف بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'لم يتم التعديل')
            }

            return isSuccess
        },

        async removeGenreById(id: number): Promise<boolean> {
            if (!id) {
                this.notiStore.triggerNotification('Id Is Required!')
                return false
            }

            const isSuccess: boolean = await handleStoreDelete<GenresResponse, number, Genrestate>({
                store: this,
                apiCall: deleteGenreById,
                id,
                listKey: 'allGenres',
                defaultError: 'حدث خطأ أثناء حذف التصنيف',
            })

            if (isSuccess) {
                this.notiStore.triggerNotification(this.successMessage || 'تم حذف التصنيف بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'لم يتم الحذف')
            }

            return isSuccess
        },
    },
})

export { useGenresStore }
