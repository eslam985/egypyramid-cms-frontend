<script setup lang="ts">

import { Search, Loader, Download } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useNotificationStore } from '@/stores/notificationStore'
import { handleSearch } from '@/composables/useSearch'
import { useTaskStore } from '@/stores/taskStore'
import { confirmAndDelete } from '@/utils/global'
import { useAuthStore } from '@/stores/authStore'

import type { DownloadTasksResponse, TasksQueryRequest, SearchResultData } from '@/types/globalTypes'

const notiStore = useNotificationStore()
const taskStore = useTaskStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// 💡 جعل القيمة الابتدائية تقرأ من الرابط مباشرة عند التحميل (الـ Reload)
const selectState = ref(typeof route.query.status === 'string' ? route.query.status : '')
let searchInput = ref<string | number>('')

const handleChooseState = async (value: string): Promise<void> => {

    router.push({
        query: {
            ...route.query,
            status: value || undefined,
            page: 1,
        },
    })

    const isSuccess: DownloadTasksResponse[] | null =
        await taskStore.fetchAllTasks({ status: value as TasksQueryRequest['status'] }, true)

    // 2. معالجة الإشعارات
    if (isSuccess) {
        notiStore.triggerNotification(taskStore.successMessage || t('tasks.toolbar.allStatusesShown'))
    } else {
        // يمكنك هنا ترك رسالة نجاح عامة للفلترة
        notiStore.triggerNotification(taskStore.successMessage || t('tasks.toolbar.filterSuccess'))
    }


    if (!value) {
        handleRefresh()
    }

}

const handleRefresh = async (): Promise<void> => {
    searchInput.value = ''
    selectState.value = ''

    router.push({
        name: 'tasksList',
        query: {},
    })

    await taskStore.fetchAllTasks({}, true)

    notiStore.triggerNotification(t('common.refreshSuccess'))
}

const sreach = async () => {
    const data: false | SearchResultData = await handleSearch({
        searchInput: searchInput.value,
        notiStore: notiStore,
        targetStore: taskStore,
        apiCallById: (targetId) => taskStore.fetchTaskById(targetId, true),
        apiCallAll: () => taskStore.fetchAllTasks(undefined, true),
        apiCallByName: (value) => taskStore.fetchAllTasks({ search: value }),
        defaultErrorMsg: taskStore.errorMessage,
    })


    // if Search By Name
    if (data && data.rawValue) {
        router.push({
            name: 'tasksList',
            query: {
                ...route.query,
                search: data.rawValue,
                page: 1,
                limit: 20,
            },
        })
    }
    searchInput.value = ''
}

const failedCount = computed(() =>
    taskStore.allTasks ? taskStore.allTasks.filter((t) => t.status === 'failed').length : null
)

const handleDeleteFailed = async (): Promise<void> => {
    await confirmAndDelete({
        message: t('tasks.confirm.deleteFailed', { count: failedCount.value }),
        action: () => taskStore.removeAllFailedTasks(),
        store: taskStore,
        notiStore: notiStore,
        fallbackSuccess: t('tasks.confirm.deleteFailedSuccess', { count: failedCount.value }),
        fallbackError: t('tasks.confirm.deleteFailedError'),
    })
}

const handleExport = async (): Promise<void> => {
    const query = route.query
    await taskStore.exportTasks(query)
}

</script>
<template>
    <!-- أدوات الفلترة والبحث والتحديث -->
    <div :class="authStore.isEditorAndAbove ? 'grid grid-cols-2 xs:grid-cols-3 md:grid-cols-25' : 'flex '
        " class="gap-fluid-gap p-fluid">
        <!-- 1111 -->
        <!-- حقل البحث -->
        <div class="md:col-span-4 flex self-center relative text-fluid-xs">
            <input id="task-search" type="search" v-model="searchInput"
                :placeholder="t('tasks.toolbar.searchPlaceholder')"
                class="form-input pl-6 pr-0 text-center bg-line/10 border border-accent/20 border-linerounded-xl text-fluid-xs"
                @keyup.enter="sreach" />
            <Search @click="sreach" class="self-center absolute left-2 text-accent" />
        </div>

        <!-- 2222 -->
        <!-- select -->
        <div class="md:col-span-3 self-center">
            <select id="task-status" v-model="selectState"
                class="form-input w-full bg-line/10 border border-accent/20 border-linerounded-xl focus:ring-2 focus:ring-accent/20 cursor-pointer"
                @change="handleChooseState(selectState)">
                <option value="">{{ t('tasks.toolbar.allStatuses') }}</option>
                <option value="idle">{{ t('tasks.form.statusOptions.idle') }}</option>
                <option value="processing">{{ t('tasks.form.statusOptions.processing') }}</option>
                <option value="failed">{{ t('tasks.form.statusOptions.failed') }}</option>
            </select>
        </div>

        <!-- 3333 -->
        <!-- Export -->
        <div v-if="authStore.isEditorAndAbove" class="md:col-span-5 self-center">
            <button type="button"
                class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                @click="handleExport">
                <Download class="size-5 text-accent" :stroke-width="2" />
                Export
            </button>
        </div>

        <!-- 4444 -->
        <!-- refreshData -->
        <button type="button"
            class="md:col-span-4 btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
            @click="handleRefresh">
            <Loader class="size-5 text-accent" :class="{ 'animate-spin': taskStore.isLoading }" :stroke-width="2" />
            {{ t('common.refreshData') }}
        </button>

        <!-- 5555 -->
        <!-- addNew -->
        <router-link v-if="authStore.isEditorAndAbove" to="/new-task"
            class="md:col-span-4 btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
            {{ t('tasks.toolbar.addNew') }}
        </router-link>

        <!-- 6666 -->
        <!-- deleteFailed -->
        <button v-if="failedCount > 0 && authStore.isAdmin" @click="handleDeleteFailed" :disabled="taskStore.isLoading"
            class="md:col-span-4 btn-danger text-fluid-xs max-w-[150px]">
            {{
                taskStore.isLoading
                    ? t('tasks.toolbar.deleting')
                    : t('tasks.toolbar.deleteFailed', {
                        count: failedCount,
                    })
            }}
        </button>
    </div>
</template>
