<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Download, Loader } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppPagination from '@/components/utils/AppPagination.vue'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import BaseTable from '@/components/ui/BaseTable.vue'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/utils/global'

import type { BaseQueryRequest } from '@/types/globalTypes'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const analyticsStore = useAnalyticsStore()
const { mediasNotReadyList, pagination, isLoading } = storeToRefs(analyticsStore)

const columns: { key: string; label: string; sortable: boolean }[] = [
    { key: 'poster', label: t('notReady.table.poster'), sortable: false },
    { key: 'title', label: t('notReady.table.titleYear'), sortable: false },
    { key: 'type', label: t('notReady.table.typeGenre'), sortable: false },
    { key: 'tmdb', label: t('notReady.table.tmdb'), sortable: false },
    { key: 'created_at', label: t('notReady.table.addedAt'), sortable: true },
]

let action: { key: string; label: string; sortable: boolean } = {
    key: 'status',
    label: t('notReady.table.status'),
    sortable: false,
}

if (authStore.isEditorAndAbove) {
    columns.push(action)
}

const handlePageChange = async (newPage: BaseQueryRequest) => {
    await analyticsStore.fetchNotReadyMedias(newPage)
}

const handleRowClick = (row: Record<string, null>): void => {
    router.push(`/media/${row.id}/details`)
}

const handleExport = async (): Promise<void> => {
    router.push({
        params: {},
    })

    await analyticsStore.exportNotReadyMedia(route.query)
}

const handleRefresh = async (): Promise<void> => {
    router.push({
        params: {},
    })

    const params: BaseQueryRequest = {
        page: 1,
        limit: 20,
    }

    await analyticsStore.fetchNotReadyMedias(params, true)
}
</script>

<template>
    <div class="space-y-4">
        <div v-if="mediasNotReadyList.length > 0" class="flex justify-between gap-fluid-gap w-full">
            <!-- 1111 -->
            <!-- refreshData -->
            <button type="button"
                class="btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                @click="handleRefresh" :disabled="analyticsStore.isLoading">
                <Loader class="size-4 text-accent" :class="{ 'animate-spin': analyticsStore.isLoading }" :stroke-width="2" />
                <span class="text-fluid-xs">{{ t('media.toolbar.refreshData') }}</span>
            </button>

            <!-- 2222 -->
            <!-- Export -->
            <div
                v-if="authStore.isEditorAndAbove"
                class="md:col-span-5 self-center flex md:justify-end"
            >
                <button
                    type="button"
                    class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                    @click="handleExport"
                >
                    <Download class="size-5 text-accent" :stroke-width="2" />
                    Export
                </button>
            </div>
        </div>

        <BaseTable
            :columns="columns"
            :rows="mediasNotReadyList"
            :isLoading="isLoading"
            storeKey="notReady"
            @row-click="handleRowClick"
        >
            <template #cell-poster="{ row }">
                <img
                    v-if="row.poster_url"
                    :src="row.poster_url"
                    :alt="row.title"
                    class="w-10 h-14 object-cover rounded-xl border border-line shadow-soft mx-auto"
                />
                <div
                    v-else
                    class="w-10 h-14 bg-line/20 rounded-xl border border-line flex items-center justify-center text- text-sub text-center leading-tight mx-auto"
                >
                    {{ t('notReady.noImage') }}
                </div>
            </template>

            <template #cell-title="{ row }">
                <div class="font-bold capitalize text-center">{{ row.title }}</div>
                <div class="text-sub text-center" v-if="row.year">{{ row.year }}</div>
            </template>

            <template #cell-type="{ row }">
                <span
                    :class="
                        row.media_type === 'series'
                            ? 'bg-accent/10 text-accent border-accent/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                    "
                    class="px-2 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap mb-1"
                >
                    {{ row.media_type === 'series' ? t('notReady.series') : t('notReady.movie') }}
                </span>
                <div class="text-sub/70 truncate max-w- text-center mx-auto" v-if="row.labels">
                    {{ row.labels }}
                </div>
            </template>

            <template #cell-tmdb="{ row }">
                <span class="font-mono text-sub">{{ row.tmdb_id ? `#${row.tmdb_id}` : '-' }}</span>
            </template>

            <template #cell-created_at="{ value }">
                {{ formatDate(value) }}
            </template>

            <template #cell-status>
                <span
                    class="px-2.5 py-1 rounded-full text-fluid-xs text-center font-semibold bg-warning/10 text-warning border border-warning/20 inline-block"
                >
                    {{ t('notReady.notReadyBadge') }}
                </span>
            </template>
        </BaseTable>

        <AppPagination
            :pagination="pagination"
            :is-loading="isLoading"
            @change-page="handlePageChange"
        />
    </div>
</template>
