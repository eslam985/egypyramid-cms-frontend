import { defineStore } from 'pinia'
import type { CreateTaskInputsType, UpdateTaskInputsType } from '@/schemas/downloadTaskSchema'
import { useNotificationStore } from '@/stores/notificationStore'

import type {
    DownloadTasksResponse,
    TasksQueryRequest,
    DeleteTaskResponseData,

} from '@/types/downloadTasksType'

import type { TasksState, } from "@/types/storeType"

import {
    handleStoreDelete,
    handleStoreEdit,
    handleStoreAdd,
    handleStoreFetch,
    handleStoreExport,
} from '@/utils/store'

import {
    createTask,
    updateTaskById,
    getAllTasks,
    findByTaskId,
    deleteTaskById,
    deleteAllTasksFailed,
    deleteTasksByIds,
    exportTasksToCSV,
} from '@/api/data/downloadTasks'


const useTaskStore = defineStore('task', {
    state: (): TasksState => ({
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
    getters: {
        notiStore: () => useNotificationStore(),
    },
    actions: {
        // 💡 أكشن تصدير مهام التنزيل المعتمد على الفلاتر الحالية المطبقة في الـ UI
        async exportTasks(filters: TasksQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            const isSuccess: boolean = await handleStoreExport<TasksQueryRequest, TasksState>({
                store: this,
                apiCall: exportTasksToCSV,
                args: filters, // تمرير نفس كائن الفلاتر (البحث، الحالة، الترتيب)
                defaultFileName: `download-tasks-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير مهام التنزيل!',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage || 'تعذر جلب البيانات')
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'تم تحميل البيانات بنجاح')
            }

            return isSuccess
        },

        async fetchAllTasks(
            data?: TasksQueryRequest,
            force: boolean = false,
        ): Promise<DownloadTasksResponse[] | null> {
            // إذا تمرر boolean في البرامتر الأول اعتبره هو الـ force
            if (typeof data === 'boolean') {
                force = true
                data = {}
            }

            const isSuccess: DownloadTasksResponse[] | null = await handleStoreFetch<
                DownloadTasksResponse[],
                TasksQueryRequest,
                TasksState
            >({
                store: this,
                apiCall: getAllTasks,
                args: data,
                targetKey: 'allTasks',
                paginationKey: 'pagination',
                defaultError: 'حدث خطأ اثناء جلب البيانات!',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage)
            }

            return isSuccess
        },
        async fetchTaskById(
            id: number,
            force: boolean = false,
        ): Promise<DownloadTasksResponse | null> {
            if (!id) {
                this.notiStore.triggerNotification('Id is Required!')
                return null
            }

            const isSuccess: DownloadTasksResponse | null = await handleStoreFetch<
                DownloadTasksResponse,
                number,
                TasksState
            >({
                store: this,
                apiCall: findByTaskId,
                args: id,
                targetKey: 'currentTask',
                defaultError: 'حدث خطأ اثناء جلب بيانات التاسك',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage)
            }else {
                this.allTasks = [isSuccess]
            }

            return isSuccess
        },

        async addTask(data: CreateTaskInputsType): Promise<DownloadTasksResponse | null> {
            if (!data) {
                this.notiStore.triggerNotification('Data is Required!')
            }

            const isSuccess: DownloadTasksResponse | null = await handleStoreAdd<
                DownloadTasksResponse,
                CreateTaskInputsType,
                TasksState
            >({
                store: this,
                apiCall: createTask,
                data,
                listKey: 'allTasks',
                defaultError: 'حدث خطا اثناء اضافة تاسك جديد!',
            })

            if (isSuccess && Object.keys(isSuccess).length > 0) {
                this.notiStore.triggerNotification(this.successMessage || 'تم اضافة المهمه بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'لم يتم اضافة المهمة')
            }

            return isSuccess
        },
        async editTaskById(
            id: number,
            data: UpdateTaskInputsType,
        ): Promise<DownloadTasksResponse | null> {
            if (!id) {
                this.notiStore.triggerNotification('Id is Required!')
                return null
            }

            const isSuccess: DownloadTasksResponse | null = await handleStoreEdit<
                DownloadTasksResponse,
                UpdateTaskInputsType,
                number,
                TasksState
            >({
                store: this,
                apiCall: updateTaskById,
                id,
                data,
                listKey: 'allTasks',
                defaultError: 'حدث خطأ اثناء تعديل التاسك!',
            })

            if (isSuccess && Object.keys(isSuccess).length > 0) {
                this.notiStore.triggerNotification(this.successMessage || 'تم تعديل المهمه بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'لم يتم المهمه')
            }

            return isSuccess
        },
        async removeTaskById(id: number): Promise<boolean> {
            if (!id) {
                this.notiStore.triggerNotification('Id is Required!')
                return false
            }

            const isSuccess: boolean = await handleStoreDelete<
                DeleteTaskResponseData,
                number,
                TasksState
            >({
                store: this,
                apiCall: deleteTaskById,
                id,
                listKey: 'allTasks',
                defaultError: 'حدث خطأ اثناء حذف التاسك!',
            })

            if (isSuccess) {
                this.notiStore.triggerNotification(this.successMessage || 'تم حذف المهمه بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'لم يتم الحذف')
            }

            return isSuccess
        },

        async removeAllFailedTasks(): Promise<boolean> {
            const isSuccess: boolean = await handleStoreDelete<
                DownloadTasksResponse,
                never,
                TasksState
            >({
                store: this,
                apiCall: deleteAllTasksFailed,
                listKey: 'allTasks',
                defaultError: 'حدث خطأ اثناء حذف التاسكات الفاشلة!',
                filterFn: (tasks) => tasks.filter((t) => t.status !== 'failed'),
            })

            if (isSuccess) {
                this.notiStore.triggerNotification(this.successMessage || 'تم الحذف بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'لم يتم الحذف')
            }

            return isSuccess
        },

        async removeTasksByIds(ids: number[]): Promise<boolean> {
            if (!ids) {
                this.notiStore.triggerNotification('Id is Required!')
                return false
            }

            const isSuccess: boolean = await handleStoreDelete<
                DownloadTasksResponse,
                number[],
                TasksState
            >({
                store: this,
                apiCall: deleteTasksByIds,
                id: ids, // [1,5,10]
                listKey: 'allTasks',
                defaultError: 'حدث خطأ اثناء حذف التاسكات!',
            })

            if (isSuccess) {
                this.notiStore.triggerNotification(this.successMessage || 'تم الحذف بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage || 'لم يتم الحذف')
            }

            return isSuccess
        },
    },
})

export { useTaskStore }
