import { defineStore } from 'pinia'
import { handleStoreDelete, handleStoreEdit, handleStoreAdd, handleStoreFetch } from '@/utils/store'

import {
  handleFindUserById,
  handleGetSessionsByUserId,
  handleUpdateUserInfo,
  handleChangePassword,
  handleRemoveSessionById,
  handleUploadAvatar,
  handleDeleteAvatar,
  handleSetAvatarFromHistory, // 👈 أضف هذا السطر
} from '@/api/auth/userApi'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoading: false,
    successMessage: '',
    errorMessages: '',
    userInfo: null,
    sessions: [],
    filters: {
      sortBy: 'created_at',
      sortOrder: 'ASC',
    },
  }),
  actions: {
    async updateUserInfo(data = {}, force = true) {
      return handleStoreEdit({
        store: this,
        apiCall: handleUpdateUserInfo,
        data,
        listKey: 'userInfo',
        defaultError: 'حدثت مشكلة اثناء تعديل بيانات المستخدم',
        force,
      })
    },

    async ChangePassword(data, force = true) {
      return handleStoreEdit({
        store: this,
        apiCall: handleChangePassword,
        data,
        defaultError: 'حدثت مشكلة اثناء تغيير كلمة مرور المستخدم',
        force,
      })
    },
    async getUserById(force = true) {
      return handleStoreFetch({
        store: this,
        apiCall: handleFindUserById,
        targetKey: 'userInfo',
        defaultError: 'حدثت مشكلة اثناء جلب بيانات المستخدم!',
        force,
      })
    },

    // 💡 أضفنا = {} في نهاية القوس لحماية الدالة
    async getSessionsByUserId({ sortBy = 'expires_at', sortOrder = 'ASC', force = true } = {}) {
      return handleStoreFetch({
        store: this,
        apiCall: handleGetSessionsByUserId,
        // نمرر الكائن مباشرة كما تتوقعه دالة الـ API
        args: [{ sortBy, sortOrder }],
        targetKey: 'sessions',
        defaultError: 'حدثت مشكلة اثناء جلب جلسات المستخدم!',
        force,
      })
    },

    async removeSessionById(sessionId, force = true) {
      return handleStoreDelete({
        store: this,
        apiCall: handleRemoveSessionById,
        id: sessionId,
        listKey: 'sessions',
        defaultError: 'حدث خطأ اثناء حذف جلسة المستخدم!',
        force,
      })
    },
    async uploadAvatar(data, force = true) {
      return handleStoreEdit({
        store: this,
        apiCall: handleUploadAvatar,
        data,
        listKey: 'userInfo',
        defaultError: 'حدثت مشكلة اثناء رفع صورة الافاتار!',
        force,
      })
    },
    async deleteAvatar(force = true) {
      return handleStoreDelete({
        store: this,
        apiCall: handleDeleteAvatar,
        listKey: 'userInfo',
        defaultError: 'حدث خطأ اثناء حذف صورة المستخدم!',
        force,
      })
    },
    async setAvatarFromHistory(avatarUrl, force = true) {
      return handleStoreEdit({
        store: this,
        apiCall: handleSetAvatarFromHistory,
        data: avatarUrl, // نمرر الرابط النصي مباشرة
        listKey: 'userInfo', // دالة المساعدة ستقوم بعمل Merge تلقائي للبيانات داخل userInfo
        defaultError: 'حدثت مشكلة أثناء تعيين الصورة من السجل!',
        force,
      })
    },

    async setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }

      return await this.getSessionsByUserId({ ...this.filters })
    },
    async setSort(column) {
      if (this.filters.sortBy === column) {
        this.filters.sortOrder = this.filters.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      } else {
        this.filters.sortBy = column
        this.filters.sortOrder = 'ASC'
      }

      return await this.getSessionsByUserId({ ...this.filters })
    },
  },
})
