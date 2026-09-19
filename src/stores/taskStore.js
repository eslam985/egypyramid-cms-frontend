import { defineStore } from 'pinia'
import { getTasksByStatus } from '@/api/data/analytics'
import { handleStoreDelete, handleStoreEdit, handleStoreAdd, handleStoreFetch } from '@/utils/store'

import {
  createTask,
  updateTaskById,
  getAllTasks,
  findByTaskId,
  findByTaskByName,
  deleteTaskById,
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
        defaultError: 'حدث خطأ اثناء جلب البيانات!',
        force,
      })
    },
    async fetchTasksByStatus(statusOrParams, force = false) {
      const params =
        typeof statusOrParams === 'string' ? { status: statusOrParams } : statusOrParams

      return handleStoreFetch({
        store: this,
        apiCall: getTasksByStatus,
        args: params,
        targetKey: 'allTasks',
        paginationKey: 'pagination',
        defaultError: 'حدث خطأ أثناء جلب الحالات!',
        force,
      })
    },
    async fetchTaskById(id, force = false) {
      return handleStoreFetch({
        store: this,
        apiCall: findByTaskId,
        args: id,
        targetKey: 'currentTask',
        defaultError: 'حدث خطأ اثناء جلب بيانات التاسك',
        force,
      })
    },
    async fetchByTaskName(taskName, page = 1, limit = 20, force = false) {
      // إذا تم تمرير boolean في المعامل الثاني نعتبره هو الـ force
      if (typeof page === 'boolean') {
        force = true
        page = 1
      }

      return handleStoreFetch({
        store: this,
        apiCall: findByTaskByName,
        args: { taskName, page, limit },
        targetKey: 'allTasks',
        paginationKey: 'pagination',
        defaultError: 'حدث خطأ اثناء جلب بيانات التاسك',
        force,
      })
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
  },
})

export { useTaskStore }
