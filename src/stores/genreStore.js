import { defineStore } from 'pinia'
import { handleStoreDelete, handleStoreEdit, handleStoreAdd, handleStoreFetch } from '@/utils/store'

import {
    findGenreByName,
    findGenreById,
    findAllGenres,
    createGenre,
    updateGenreById,
    deleteGenreById,
} from '@/api/data/genres'

const useGenresStore = defineStore('genre', {
    state: () => ({
        allGenres: [],
        currentGenre: null,
        isLoading: false,
        successMessage: '',
        errorMessage: '',
    }),
    actions: {
        resetGenreState() {
            this.allGenres = []
            this.currentGenre = null
            this.isLoading = false
            this.successMessage = ''
            this.errorMessage = ''
        },
        async fetchAllGenres(force = false) {
            return handleStoreFetch({
                store: this,
                apiCall: findAllGenres,
                targetKey: 'allGenres',
                force, // تمرير خيار الإجبار
                defaultError: 'حدث خطأ أثناء جلب التصنيفات',
            })
        },
        async fetchGenreByName(name) {
            const data = await handleStoreFetch({
                store: this,
                apiCall: findGenreByName,
                args: name,
                defaultError: 'حدث خطأ أثناء جلب التصنيف بالاسم',
            })

            if (data) {
                this.currentGenre = data
                this.allGenres = [data]
            }

            return data
        },
        async fetchGenreById(id) {
            return handleStoreFetch({
                store: this,
                apiCall: findGenreById,
                args: id,
                targetKey: 'currentGenre',
                defaultError: 'حدث خطا اثناء جلب التصنيف بالمعرف (id)',
            })
        },
        async addGenre(data) {
            return handleStoreAdd({
                store: this,
                apiCall: createGenre,
                data,
                listKey: 'allGenres',
                defaultError: 'حدث خطا اثناء انشاء التصنيف',
            })
        },
        async editGenreById(id, data) {
            return handleStoreEdit({
                store: this,
                apiCall: updateGenreById,
                id,
                data,
                listKey: 'allGenres',
                defaultError: 'حدث خطأ اثناء تعديل التصنيف',
            })
        },
        async removeGenreById(id) {
            return handleStoreDelete({
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
