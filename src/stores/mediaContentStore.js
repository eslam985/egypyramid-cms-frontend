import { defineStore } from 'pinia'
import { handleStoreDelete, handleStoreEdit, handleStoreAdd, handleStoreFetch } from '@/utils/store'

import {
  findSeasonsByMediaId,
  createSeason,
  findSeasonById,
  updateSeasonById,
  deleteSeasonById,
} from '@/api/data/seasons'

import {
  createEpisode,
  updateEpisodeById,
  findEpisodeById,
  findEpisodesByMediaId,
  findEpisodesBySeasonId,
  deleteEpisodeById,
} from '@/api/data/episodes'

import {
  createLink,
  updateLinkById,
  findLinksByEpisodeId,
  findLinkById,
  deleteLinkById,
} from '@/api/data/links'

const useMediaContentStore = defineStore('mediaContent', {
  state: () => ({
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
    async getSeasonsByMediaId(mediaId, force = false) {
      const data = await handleStoreFetch({
        store: this,
        apiCall: findSeasonsByMediaId,
        args: mediaId,
        targetKey: 'seasons',
        defaultError: 'حدثت مشكلة اثناء جلب الموسم او المواسم',
        force,
      })

      // التعديل الأفضل (استخدام Array.isArray كما فعلت في الحلقات)
      if (Array.isArray(data)) {
        this.seasons = data.sort((a, b) => a.season_number - b.season_number)
      }

      return data
    },
    async getSeasonById(id, force = false) {
      return handleStoreFetch({
        store: this,
        apiCall: findSeasonById,
        args: id,
        targetKey: 'currentSeason',
        defaultError: 'حدثت مشكلة اثناء جلب الموسم',
        force
      })
    },
    async addSeason(media_id, data) {
      return handleStoreAdd({
        store: this,
        apiCall: createSeason,
        id: media_id,
        data,
        listKey: 'seasons',
        defaultError: 'حدثت مشكلة اثناء إضافة الموسم',
      })
    },
    async editSeasonById(id, data) {
      return handleStoreEdit({
        store: this,
        apiCall: updateSeasonById,
        id,
        data,
        listKey: 'seasons',
        defaultError: 'حدثت مشكلة اثناء تعديل الموسم',
      })
    },
    async removeSeasonById(id) {
      return handleStoreDelete({
        store: this,
        apiCall: deleteSeasonById,
        id,
        listKey: 'seasons',
        defaultError: 'حدث خطأ اثناء حذف الموسم',
      })
    },
    // --- Episodes ---
    async getEpisodeById(id, force= false) {
      const data = await handleStoreFetch({
        store: this,
        apiCall: findEpisodeById,
        args: id,
        targetKey: 'currentEpisode',
        defaultError: 'حدثت مشكلة اثناء جلب الحلقة',
        force
      })

      if (data) {
        this.currentEpisodeId = data.id
      }

      return data
    },
    async getEpisodesByMediaId(media_id, params = {}, force = false) {
      if (typeof params === 'boolean') {
        params = {}
        force = true
      }

      const resultData = await handleStoreFetch({
        store: this,
        apiCall: findEpisodesByMediaId,
        args: [media_id, params],
        targetKey: 'episodes',
        defaultError: 'حدث خطأ أثناء جلب الحلقات',
        force,
      })

      // الترتيب فقط في حال نجاح الجلب ورجوع مصفوفة
      if (Array.isArray(resultData)) {
        this.episodes = resultData.sort((a, b) => a.episode_number - b.episode_number)
      }

      return resultData
    },
    async getEpisodesBySeasonId(season_id, force = false) {
      const resultData = await handleStoreFetch({
        store: this,
        apiCall: findEpisodesBySeasonId,
        args: season_id,
        targetKey: 'episodes',
        defaultError: 'حدث خطأ أثناء جلب الحلقات',
        force,
      })

      // الترتيب فقط في حال نجاح الجلب ورجوع مصفوفة
      if (Array.isArray(resultData)) {
        this.episodes = resultData.sort((a, b) => a.episode_number - b.episode_number)
      }

      return resultData
    },
    async addEpisode(mediaId, data) {
      return handleStoreAdd({
        store: this,
        apiCall: createEpisode,
        id: mediaId,
        data,
        listKey: 'episodes',
        defaultError: 'حدث خطأ اثناء اضافة الحلقة!',
      })
    },
    async editEpisodeById(id, data) {
      return handleStoreEdit({
        store: this,
        apiCall: updateEpisodeById,
        id,
        data,
        listKey: 'episodes',
        defaultError: 'حدث خطأ اثناء تعديل الحلقة!',
      })
    },
    async removeEpisodeById(id) {
      return handleStoreDelete({
        store: this,
        apiCall: deleteEpisodeById,
        id,
        listKey: 'episodes',
        defaultError: 'حدث خطأ اثناء حذف الحلقة',
      })
    },
    // --- Links ---
    async getLinksByEpisodeId(episode_id, force = false ) {
      const data = await handleStoreFetch({
        store: this,
        apiCall: findLinksByEpisodeId,
        args: episode_id,
        targetKey: 'links',
        defaultError: 'حدثت مشكلة اثناء جلب اللينكات',
        force
      })

      if (data && Array.isArray(this.links)) {
        this.links.sort((a, b) => {
          if (!a.last_check_at) return 1
          if (!b.last_check_at) return -1
          return new Date(b.last_check_at) - new Date(a.last_check_at)
        })
      }

      return data
    },
    async getLinkById(id, force = false) {
      return handleStoreFetch({
        store: this,
        apiCall: findLinkById,
        args: id,
        targetKey: 'currentLink',
        defaultError: 'حدثت مشكلة اثناء جلب اللينك',
        force
      })
    },
    async addLink(episode_id, data = {}) {
      const resultData = await handleStoreAdd({
        store: this,
        apiCall: createLink,
        id: episode_id,
        data,
        listKey: 'links',
        defaultError: 'حدثت مشكلة اثناء اضافة الرابط',
      })

      if (resultData) {
        this.links.sort((a, b) => {
          if (!a.last_check_at) return 1
          if (!b.last_check_at) return -1
          return new Date(b.last_check_at) - new Date(a.last_check_at)
        })
      }

      return resultData
    },
    async editLinkById(id, data = {}) {
      const resultData = await handleStoreEdit({
        store: this,
        apiCall: updateLinkById,
        id,
        data,
        listKey: 'links',
        defaultError: 'حدث خطأ اثناء تعديل الرابط',
      })

      // إعادة الترتيب بعد نجاح التعديل
      if (resultData) {
        this.links.sort((a, b) => {
          if (!a.last_check_at) return 1
          if (!b.last_check_at) return -1
          return new Date(b.last_check_at) - new Date(a.last_check_at)
        })
      }

      return resultData
    },
    async removeLinkById(id) {
      return handleStoreDelete({
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
