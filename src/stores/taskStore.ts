import { defineStore } from 'pinia'
import type { CreateTaskInputsType, UpdateTaskInputsType } from '@/schemas/downloadTaskSchema'

import type {
    DownloadTasksResponse,
    TasksQueryRequest,
    BaseStore,
    DeleteTaskResponseData,
} from '@/types/globalTypes'

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

export interface TasksState extends BaseStore {
    allTasks: DownloadTasksResponse[] | null
    currentTask: null
    pagination: {
        total: number
        page: number
        limit: number
        totalPage: number
    }
    isLoading: boolean
    successMessage: string
    errorMessage: string
}
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
    actions: {
        // 💡 أكشن تصدير مهام التنزيل المعتمد على الفلاتر الحالية المطبقة في الـ UI
        async exportTasks(filters: TasksQueryRequest): Promise<boolean> {
            const date: string = new Date().toISOString().slice(0, 10)

            return handleStoreExport<TasksQueryRequest, TasksState>({
                store: this,
                apiCall: exportTasksToCSV,
                args: filters, // تمرير نفس كائن الفلاتر (البحث، الحالة، الترتيب)
                defaultFileName: `download-tasks-${date}.csv`,
                defaultError: 'حدثت مشكلة أثناء تصدير مهام التنزيل!',
            })
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

            return handleStoreFetch<DownloadTasksResponse[], TasksQueryRequest , TasksState>({
                store: this,
                apiCall: getAllTasks,
                args: data,
                targetKey: 'allTasks',
                paginationKey: 'pagination',
                defaultError: 'حدث خطأ اثناء جلب البيانات!',
                force,
            })
        },
        async fetchTaskById(
            id: number,
            force: boolean = false,
        ): Promise<DownloadTasksResponse | null> {
            const data: DownloadTasksResponse | null = await handleStoreFetch<DownloadTasksResponse,number, TasksState >({
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

        async addTask(data: CreateTaskInputsType): Promise<DownloadTasksResponse | null> {
            return handleStoreAdd<DownloadTasksResponse, CreateTaskInputsType, TasksState>({
                store: this,
                apiCall: createTask,
                data,
                listKey: 'allTasks',
                defaultError: 'حدث خطا اثناء اضافة تاسك جديد!',
            })
        },
        async editTaskById(
            id: number,
            data: UpdateTaskInputsType,
        ): Promise<DownloadTasksResponse | null> {
            return handleStoreEdit<DownloadTasksResponse, UpdateTaskInputsType, number ,TasksState>({
                store: this,
                apiCall: updateTaskById,
                id,
                data,
                listKey: 'allTasks',
                defaultError: 'حدث خطأ اثناء تعديل التاسك!',
            })
        },
        async removeTaskById(id: number): Promise<boolean> {
            return handleStoreDelete<DeleteTaskResponseData, number, TasksState>({
                store: this,
                apiCall: deleteTaskById,
                id,
                listKey: 'allTasks',
                defaultError: 'حدث خطأ اثناء حذف التاسك!',
            })
        },

        async removeAllFailedTasks(): Promise<boolean> {
            return handleStoreDelete<DownloadTasksResponse, never, TasksState>({
                store: this,
                apiCall: deleteAllTasksFailed,
                listKey: 'allTasks',
                defaultError: 'حدث خطأ اثناء حذف التاسكات الفاشلة!',
                filterFn: (tasks) => tasks.filter((t) => t.status !== 'failed'),
            })
        },

        async removeTasksByIds(ids: number[]): Promise<boolean> {
            return handleStoreDelete<DownloadTasksResponse, number[], TasksState>({
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
