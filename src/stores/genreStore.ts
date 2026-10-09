import { defineStore } from 'pinia'
import type { CreateGenreSchemaType, UpdateGenreByIdSchemaType } from '@/schemas/genreSchema'
import type { GenresResponse, BaseStore } from '@/types/globalTypes'

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

    actions: {
        resetGenreState(): void {
            this.allGenres = []
            this.currentGenre = null
            this.isLoading = false
            this.successMessage = ''
            this.errorMessage = ''
        },

        async fetchAllGenres(force: boolean = false): Promise<GenresResponse[] | null> {
            return handleStoreFetch<GenresResponse[], unknown, Genrestate>({
                store: this,
                apiCall: findAllGenres,
                targetKey: 'allGenres',
                force,
                defaultError: 'حدث خطأ أثناء جلب التصنيفات',
            })
        },

        async fetchGenreByName(
            name: string,
            force: boolean = true,
        ): Promise<GenresResponse | null> {
            if (!name) {
                throw new Error('name required!')
            }
            const data = await handleStoreFetch<GenresResponse, string, Genrestate>({
                store: this,
                apiCall: findGenreByName,
                args: name,
                defaultError: 'حدث خطأ أثناء جلب التصنيف بالاسم',
                force,
            })

            if (data && Object.keys(data).length > 0) {
                this.currentGenre = data
                this.allGenres = [data]
            }

            return data
        },

        async fetchGenreById(id: number, force: boolean = false): Promise<GenresResponse | null> {
            const data = await handleStoreFetch<GenresResponse, number, Genrestate>({
                store: this,
                apiCall: findGenreById,
                args: id,
                targetKey: 'currentGenre',
                defaultError: 'حدث خطا اثناء جلب التصنيف بالمعرف (id)',
                force,
            })

            if (data && Object.keys(data).length > 0) {
                this.allGenres = [data]
            }
            return data
        },

        async exportGenres(): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            return handleStoreExport({
                store: this,
                apiCall: handleExportGenresToCSV,
                defaultFileName: `genres-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير الأقسام!',
            })
        },

        async addGenre(data: CreateGenreSchemaType): Promise<GenresResponse | null> {
            return handleStoreAdd<GenresResponse, CreateGenreSchemaType, Genrestate>({
                store: this,
                apiCall: createGenre,
                data,
                listKey: 'allGenres',
                defaultError: 'حدث خطا اثناء انشاء التصنيف',
            })
        },

        async editGenreById(
            id: number,
            data: UpdateGenreByIdSchemaType,
        ): Promise<GenresResponse | null> {
            // نمرر TId كـ number حتماً
            return handleStoreEdit<GenresResponse, UpdateGenreByIdSchemaType, number, Genrestate>({
                store: this,
                apiCall: updateGenreById, // أصبحت مطابقة 100% لأن كلاهما يتوقع number
                id,
                data,
                listKey: 'allGenres',
                defaultError: 'حدث خطأ اثناء تعديل التصنيف',
            })
        },

        async removeGenreById(id: number): Promise<boolean> {
            return handleStoreDelete<GenresResponse, number, Genrestate>({
                store: this,
                apiCall: deleteGenreById,
                id,
                listKey: 'allGenres',
                defaultError: 'حدث خطأ أثناء حذف التصنيف',
            })
        },
    },
})

export { useGenresStore }
