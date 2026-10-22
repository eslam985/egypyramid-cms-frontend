<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Download, Loader } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import BaseTable from '@/components/ui/BaseTable.vue'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/utils/global'

import type { BaseQueryRequest } from '@/types/globalTypes'

const analyticsStore = useAnalyticsStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const { telegramLocked, isLoading } = storeToRefs(analyticsStore)

const columns: {
    label: string
    key: string
}[] = [
    { label: t('telegramLocked.table.titleEpisode'), key: 'title' },
    { label: t('telegramLocked.table.type'), key: 'media_type' },
    { label: t('telegramLocked.table.server'), key: 'server_name' },
    { label: t('telegramLocked.table.lockedUrl'), key: 'url' },
    { label: t('telegramLocked.table.workStatus'), key: 'is_ready' },
    { label: t('telegramLocked.table.addedAt'), key: 'created_at' },
]

const handleExport = async (): Promise<void> => {
    router.push({
        params: {},
    })

    await analyticsStore.exportLockedTelegramLinks(route.query)
}

const handleRefresh = async (): Promise<void> => {
    router.push({
        params: {},
    })

    const params: BaseQueryRequest = {
        page: 1,
        limit: 20,
    }
    await analyticsStore.fetchLockedTelegramLinks(params, true)
}

const handleRowClick = (row: Record<string, any>): void => {
    router.push(`/media/${row.media_id}/details`)
}
</script>
<template>
    <div class="space-y-4">
        <!-- أزرار التحكم -->
        <div class="flex justify-between gap-fluid-gap w-full mb-4">
            <!-- refreshData -->
            <button type="button"
                class="btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                @click="handleRefresh" :disabled="analyticsStore.isLoading">
                <Loader class="size-4 text-accent" :class="{ 'animate-spin': analyticsStore.isLoading }" :stroke-width="2" />
                <span class="text-fluid-xs">{{ t('media.toolbar.refreshData') }}</span>
            </button>

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

        <!-- استخدام BaseTable الموحد -->
        <BaseTable
            :columns="columns"
            :rows="telegramLocked ?? []"
            :isLoading="isLoading"
            storeKey="telegramLocked"
            @row-click="handleRowClick"
        >
            <!-- 1. اسم العمل ورقم الحلقة -->
            <template #cell-title="{ value, row }">
                <div class="text-center">
                    <div class="font-bold mb-0.5">{{ value }}</div>
                    <div class="text-sub text-fluid-xs">
                        <span v-if="row.media_type === 'series' && row.season_number">
                            {{ t('telegramLocked.season') }} {{ row.season_number }} -
                            {{ t('telegramLocked.episode') }} #{{ row.episode_number }}
                        </span>
                        <span v-else> {{ t('telegramLocked.customMedia') }} </span>
                    </div>
                </div>
            </template>

            <!-- 2. النوع -->
            <template #cell-media_type="{ value }">
                <span
                    :class="
                        value === 'series'
                            ? 'bg-accent/10 text-accent border-accent/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                    "
                    class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block"
                >
                    {{
                        value === 'series' ? t('telegramLocked.series') : t('telegramLocked.movie')
                    }}
                </span>
            </template>

            <!-- 3. السيرفر -->
            <template #cell-server_name="{ value }">
                <span
                    class="bg-line/20 border border-line px-2 py-1 rounded-lg font-mono text-fluid-xs"
                >
                    {{ value }}
                </span>
            </template>

            <!-- 4. الرابط المغلَق -->
            <template #cell-url="{ value }">
                <a
                    :href="value"
                    target="_blank"
                    dir="ltr"
                    @click.stop
                    class="text-link hover:text-link-hover underline underline-offset-2 text-fluid-xs font-mono truncate max-w-xs block"
                >
                    {{ value }}
                </a>
            </template>

            <!-- 5. حالة العمل -->
            <template #cell-is_ready="{ value }">
                <span
                    v-if="value === true"
                    class="text-success font-semibold bg-success/10 px-2.5 py-1 rounded-lg border border-success/20 inline-block"
                >
                    {{ t('telegramLocked.ready') }}
                </span>
                <span
                    v-else
                    class="text-danger font-semibold bg-danger/10 px-2.5 py-1 rounded-lg border border-danger/20 inline-block"
                >
                    {{ t('telegramLocked.notReady') }}
                </span>
            </template>

            <!-- 6. تاريخ الإضافة -->
            <template #cell-created_at="{ value }">
                <span class="text-sub">
                    {{ formatDate(value) }}
                </span>
            </template>
        </BaseTable>
    </div>
</template>
