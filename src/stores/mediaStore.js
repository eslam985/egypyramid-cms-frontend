import { defineStore } from 'pinia'
import { handleStoreDelete, handleStoreEdit, handleStoreAdd, handleStoreFetch } from '@/utils/store'

import {
  createMedia,
  updateMediaById,
  deleteMediaById,
  findAllMedia,
  findMediaById,
  findMediaByAnyId,
} from '@/api/data/medias'

const useMediaStore = defineStore('media', {
  state: () => ({
    medias: [],
    pagination: {
      total: 0,
      page: 0,
      limit: 0,
      totalPage: 0,
    },
    filters: {
      search: '',
      category: '',
      sortBy: 'created_at',
      sortOrder: 'DESC',
    },
    currentMedia: null,
    isLoading: false,
    successMessage: '',
    errorMessage: '',
  }),
  actions: {
    async getMediaById(id, force = true) {
      const data = await handleStoreFetch({
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
    async fetchMediaByAnyId(id, targetTable, force = false) {
      if (typeof targetTable === 'boolean') {
        force = true
        targetTable = 'all'
      }
      const data = await handleStoreFetch({
        store: this,
        apiCall: findMediaByAnyId,
        args: [id, targetTable],
        targetKey: 'currentMedia',
        defaultError: 'حدث خطأ اثناء جلب الميديا بالمعرف (id)',
        force,
      })

      if (!data || data.length < 1) return null

      return data
    },
    async fetchMedias({
      category,
      page = 1,
      limit = 20,
      search,
      sortBy,
      sortOrder,
      force = false,
    } = {}) {
      const params = {
        category: category ?? this.filters.category,
        page,
        limit,
        search: search ?? this.filters.search,
        sortBy: sortBy ?? this.filters.sortBy,
        sortOrder: sortOrder ?? this.filters.sortOrder,
      }

      return handleStoreFetch({
        store: this,
        apiCall: findAllMedia,
        args: params,
        targetKey: 'medias',
        paginationKey: 'pagination',
        defaultError: 'حدث خطأ أثناء جلب الميديا',
        force,
      })
    },
    async addMedia(data, force = true) {
      return handleStoreAdd({
        store: this,
        apiCall: createMedia,
        data,
        listKey: 'medias',
        defaultError: 'حدث خطأ اثناء انشاء الميديا',
        force
      })
    },
    async editMediaById(id, data, force = true) {
      return handleStoreEdit({
        store: this,
        apiCall: updateMediaById,
        id,
        data,
        listKey: 'medias',
        defaultError: 'حدث خطأ اثناء تعديل الميديا',
        force
      })
    },
    async removeMediaById(id) {
      return handleStoreDelete({
        store: this,
        apiCall: deleteMediaById,
        id,
        listKey: 'medias',
        defaultError: 'حدث خطأ اثناء حذف الميديا!',
      })
    },
    async setSort(column) {
      if (this.filters.sortBy === column) {
        this.filters.sortOrder = this.filters.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      } else {
        this.filters.sortBy = column
        this.filters.sortOrder = 'ASC'
      }

      this.pagination.page = 1

      return await this.fetchMedias(
        {
          ...this.filters,
          page: 1,
          limit: this.pagination.limit || 20,
          force: true,
        },
      )
    },
    async setPage(page) {
      this.pagination.page = page

      return await this.fetchMedias({
        ...this.filters,
        page: this.pagination.page,
        limit: this.pagination.limit || 20,
        force: true,
      })
    },
    async setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
      this.pagination.page = 1

      return await this.fetchMedias({
        ...this.filters,
        page: 1,
        limit: this.pagination.limit || 20,
        force: true,
      })
    },
  },
})

export { useMediaStore }
