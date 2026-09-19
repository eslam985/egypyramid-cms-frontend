import { defineStore } from 'pinia'
import {
  getSystemCounters,
  getTotalBrokenAndValidAndPendingLinks, // (status)
  getNotReadyMedias, // { page = 1, limit = 20 } = {}
  getBrokenLinks, // { page = 1, limit = 20 } = {}
  getMissingEpisodesByServer, // { serverName, page = 1, limit = 20 } = {}
  getLockedTelegramLinks, // { page = 1, limit = 20 } = {}
} from '@/api/data/analytics'
import { handleStoreFetch } from '@/utils/store'

const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    systemCounters: {},
    totalCountersStatusServeres: [],
    mediasNotReadyList: [],
    brokenLinksList: [],
    missingLinksByServer: [],
    telegramLocked: [],
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
      this.systemCounters = {}
      this.totalCountersStatusServeres = []
      this.mediasNotReadyList = []
      this.brokenLinksList = []
      this.missingLinksByServer = []
      this.telegramLocked = []
    },

    async fetchAllCounters(force = false) {
      return handleStoreFetch({
        store: this,
        apiCall: getSystemCounters,
        targetKey: 'systemCounters',
        defaultError: 'حدث خطا أثناء جلب العدادات!',
        force,
      })
    },
    async fetchMissingEpisodesByServer(params = {}, force = false) {
      return handleStoreFetch({
        store: this,
        apiCall: getMissingEpisodesByServer,
        args: params,
        targetKey: 'missingLinksByServer',
        defaultError: 'حدث خطا أثناء جلب السرفرات المفقودة!',
        force,
      })
    },
    async fetchTotalCountersStatusServers(status = 'broken', force = false) {
      return handleStoreFetch({
        store: this,
        apiCall: getTotalBrokenAndValidAndPendingLinks,
        args: status,
        targetKey: 'totalCountersStatusServeres',
        defaultError: 'حدث خطا أثناء جلب الحالات!',
        force,
      })
    },
    async fetchNotReadyMedias(params = {}, force = false) {
      if (typeof params === 'boolean') {
        params = {}
        force = true
      }
      return handleStoreFetch({
        store: this,
        apiCall: getNotReadyMedias,
        args: params,
        targetKey: 'mediasNotReadyList',
        defaultError: 'حدث خطا أثناء جلب الاعمال الغير جاهزة!',
        force,
      })
    },
    async fetchBrokenLinks(params = {}, force = false) {
      if (params.serverName === undefined) {
        params.serverName = 'telegram_direct'
        force = true
      }
      return handleStoreFetch({
        store: this,
        apiCall: getBrokenLinks,
        args: params,
        targetKey: 'brokenLinksList',
        defaultError: 'حدث خطا أثناء جلب اللينكات المكسورة!',
        force,
      })
    },
    async fetchLockedTelegramLinks(params = {}, force = false) {
      if (typeof params === 'boolean') {
        params = {}
        force = true
      }
      return handleStoreFetch({
        store: this,
        apiCall: getLockedTelegramLinks,
        args: params,
        targetKey: 'telegramLocked',
        defaultError: 'حدث خطا أثناء جلب اللينكات المحجوزة!',
        force,
      })
    },
  },
})

export { useAnalyticsStore }
