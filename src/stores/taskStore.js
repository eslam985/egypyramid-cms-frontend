import { defineStore } from 'pinia'
import { handleStoreDelete, handleStoreEdit, handleStoreAdd, handleStoreFetch } from '@/utils/store'

import {
  createTask,
  updateTaskById,
  getAllTasks,
  findByTaskId,
  deleteTaskById,
  deleteTasksByIds,
  deleteAllTasksFailed,
} from '@/api/data/downloadTasks'

const useTaskStore = defineStore('task', {
  state: () => ({
    allTasks: [],
    currentTask: null,
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
    async fetchAllTasks(data = {}, force = false) {
      // إذا تمرر boolean في البرامتر الأول اعتبره هو الـ force
      if (typeof data === 'boolean') {
        force = true
        data = {}
      }

      return handleStoreFetch({
        store: this,
        apiCall: getAllTasks,
        args: data,
        targetKey: 'allTasks',
        paginationKey: 'pagination', 
        defaultError: 'حدث خطأ اثناء جلب البيانات!',
        force,
      })
    },
    async fetchTaskById(id, force = false) {
      const data = await handleStoreFetch({
        store: this,
        apiCall: findByTaskId,
        args: id,
        targetKey: 'currentTask',
        defaultError: 'حدث خطأ اثناء جلب بيانات التاسك',
        force,
      })

      if (!data || data === undefined) {
        return null
      }

      if (data || Object.keys(data).length > 0) {
        this.allTasks = [data]
      }

      return data
    },

    async addTask(data = {}) {
      return handleStoreAdd({
        store: this,
        apiCall: createTask,
        data,
        listKey: 'allTasks',
        defaultError: 'حدث خطا اثناء اضافة تاسك جديد!',
      })
    },
    async editTaskById(id, data) {
      return handleStoreEdit({
        store: this,
        apiCall: updateTaskById,
        id,
        data,
        listKey: 'allTasks',
        defaultError: 'حدث خطأ اثناء تعديل التاسك!',
      })
    },
    async removeTaskById(id) {
      return handleStoreDelete({
        store: this,
        apiCall: deleteTaskById,
        id,
        listKey: 'allTasks',
        defaultError: 'حدث خطأ اثناء حذف التاسك!',
      })
    },

    async removeAllFailedTasks() {
      return handleStoreDelete({
        store: this,
        apiCall: deleteAllTasksFailed,
        listKey: 'allTasks',
        defaultError: 'حدث خطأ اثناء حذف التاسكات الفاشلة!',
        filterFn: (tasks) => tasks.filter((t) => t.status !== 'failed'),
      })
    },

    async removeTasksByIds(ids) {
      return handleStoreDelete({
        store: this,
        apiCall: deleteTasksByIds,
        id: ids, // [1,5,10]
        listKey: 'allTasks',
        defaultError: 'حدث خطأ اثناء حذف التاسكات!',
      })
    },
  },
})

export { useTaskStore }
