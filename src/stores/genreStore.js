import { defineStore } from 'pinia'
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
    async exportGenres() {
      const date = new Date().toISOString().slice(0, 10)

      return handleStoreExport({
        store: this,
        apiCall: handleExportGenresToCSV, // استدعاء دالة الـ API المصححة
        defaultFileName: `genres-${date}.csv`,
        defaultError: 'حدثت مشكلة أثناء تصدير الأقسام!',
      })
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
    async fetchGenreByName(name, force = false) {
      if (!name) {
        const err = new Error('name required!')
        throw err
      }
      const data = await handleStoreFetch({
        store: this,
        apiCall: findGenreByName,
        args: name,
        defaultError: 'حدث خطأ أثناء جلب التصنيف بالاسم',
        force,
      })

      if (data) {
        this.currentGenre = data
        this.allGenres = [data]
      }

      return data
    },
    async fetchGenreById(id, force = false) {
      const data = await handleStoreFetch({
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
