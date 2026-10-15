<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Download, Loader } from '@lucide/vue'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppPagination from '@/components/utils/AppPagination.vue'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { fromRouteQuery } from '@/utils/routerHelpers'
import BaseTable from '@/components/ui/BaseTable.vue'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/utils/global'

import type { ServerNameRequest } from '@/types/globalTypes'

const analyticsStore = useAnalyticsStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const { brokenLinksList, pagination, isLoading } = storeToRefs(analyticsStore)

const selectedServer = ref<string>('mixdrop')
const availableServers: {
    label: string
    value: string
}[] = [
        { label: 'تليجرام مباشر', value: 'telegram_direct' },
        { label: 'Doodstream', value: 'doodstream' },
        { label: 'Lulustream', value: 'lulustream' },
        { label: 'Streamtape', value: 'streamtape' },
        { label: 'archive', value: 'archive' },
        { label: 'Mixdrop', value: 'mixdrop' },
        { label: 'Voe', value: 'voe' },
        { label: 'VK', value: 'vk' },
    ]

const columns: {
    label: string
    key: string
}[] = [
        { label: t('brokenLinks.table.errorReason'), key: 'error_message' },
        { label: t('brokenLinks.table.serverQuality'), key: 'server_name' },
        { label: t('brokenLinks.table.lastCheck'), key: 'last_check_at' },
        { label: t('brokenLinks.table.status'), key: 'is_ready' },
        { label: t('brokenLinks.table.name'), key: 'title' },
        { label: t('brokenLinks.table.type'), key: 'type' },
        { label: t('brokenLinks.table.url'), key: 'url' },

    ]

const query = (query: ServerNameRequest): void => {
    const params: ServerNameRequest = {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        serverName: query.serverName,
    }

    router.push({
        name: 'dashboard',
        query: { ...params },
    })
}

// 2. دالة مركزية لجلب البيانات
const loadBrokenLinks = (page = 1): void => {
    analyticsStore.fetchBrokenLinks({
        serverName: selectedServer.value,
        page: page,
    })
    query({ serverName: selectedServer.value })
}

// تعديل دالة handleRowClick لتتوافق مع TableRow
const handleRowClick = (row: Record<string, any>): void => {
    router.push(`/media/${row.media_id}/details`)
}

const handleServerChange = (): void => {
    loadBrokenLinks(1)
}

const handlePageChange = (newPage: number): void => {
    loadBrokenLinks(newPage)
}


const handleExport = async (): Promise<void> => {
    if (!route.query.serverName) return
    const params: ServerNameRequest = {
        serverName: fromRouteQuery(route.query.serverName)
    };

    await analyticsStore.exportBrokenLinks(params)

}

const handleRefresh = async (): Promise<void> => {
    loadBrokenLinks()
}

onMounted(() => {
    query({ serverName: 'mixdrop' })
    loadBrokenLinks()
})
</script>

<template>
    <div class="space-y-4">
        <!-- قائمة اختيار السيرفر -->
        <div class="flex gap-fluid-gap">
            <!-- 1111 -->
            <!-- refreshData -->
            <button @click="handleRefresh" :disabled="isLoading" type="button"
                class="btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
                <Loader class="size-5 text-accent" :class="{ 'animate-spin': isLoading }" :stroke-width="2" />
                {{ t('common.refreshData') }}
            </button>

            <!-- 2222 -->
            <!-- server-select -->
            <select id="server-select" v-model="selectedServer" @change="handleServerChange" :disabled="isLoading"
                class="form-select rounded-xl border border-line text-fluid-xs focus:outline-none focus:border-accent font-medium cursor-pointer">
                <option v-for="server in availableServers" :key="server.value" :value="server.value">
                    {{ server.label }}
                </option>
            </select>

            <!-- 3333 -->
            <!-- Export -->
            <div v-if="authStore.isAdmin" class=" self-center flex md:justify-end">
                <button type="button"
                    class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                    @click="handleExport">
                    <Download class="size-5 text-accent" :stroke-width="2" />
                    Export
                </button>
            </div>
        </div>
        <div></div>
        <!-- الجدول -->
        <BaseTable :columns="columns" :rows="brokenLinksList ?? []" :isLoading="isLoading" storeKey="brokenLinks"
            @row-click="handleRowClick">
            <!-- title, season_number, episode_number -->
            <!-- استخدمنا تحديد النوع صراحة (row: any) أو بالنوع الصحيح مباشرة -->
            <template #cell-title="{ value, row }">
                <div class="text-center cursor-pointer">
                    <div class="font-bold mb-0.5 whitespace-nowrap">
                        {{ value || t('brokenLinks.unknownWork') }}
                    </div>
                    <div class="text-sub">
                        <span v-if="row.media_type === 'series'">
                            <span v-if="row.season_number">
                                {{ t('brokenLinks.season') }} {{ row.season_number }} -
                            </span>
                            {{ t('brokenLinks.episode') }} #{{ row.episode_number }}
                        </span>
                        <span v-else class="text-sub/70">{{ t('brokenLinks.customMovie') }}</span>
                    </div>
                </div>
            </template>

            <!-- type -->
            <template #cell-type="{ row }">
                <span :class="row.media_type === 'series'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'bg-warning/10 text-warning border-warning/20'
                    "
                    class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap cursor-pointer">
                    {{
                        row.media_type === 'series'
                            ? t('brokenLinks.series')
                            : t('brokenLinks.movie')
                    }}
                </span>
            </template>

            <!--  Server -->
            <template #cell-server_name="{ value }">
                <div class="text-sub cursor-pointer">
                    <div
                        class="font-medium font-mono text-fluid-xs bg-line/30 border-accent/20 px-2 py-0.5 rounded-md w-fit border">
                        {{ value }}
                    </div>
                </div>
            </template>

            <!-- url -->
            <template #cell-url="{ value }">
                <div class="text-center" @click.stop>
                    <a :href="value" target="_blank"
                        class="text-accent lg:hover:text-link-hover text-fluid-xs font-mono truncate max-w-xs block">
                        {{ value }}
                    </a>
                </div>
            </template>

            <!-- Error Reason -->
            <template #cell-error_message="{ value, row }">
                <div class="text-center cursor-pointer">
                    <span
                        class="px-2.5 py-1 whitespace-nowrap rounded-full text-fluid-xs font-semibold bg-danger/10 text-danger border border-danger/20 inline-block font-mono">
                        {{ value || 'BROKEN' }}
                    </span>
                    <span class="text-[10px] text-sub mt-1 block">{{
                        t('brokenLinks.checkedCount', { count: row.check_count })
                    }}</span>
                </div>
            </template>

            <!-- Date -->
            <template #cell-last_check_at="{ value }">
                <span class="cursor-pointer">
                    {{ formatDate(value) }}
                </span>
            </template>

            <!-- Is Ready -->
            <template #cell-is_ready="{ value }">
                <span v-if="value === true"
                    class="text-success font-semibold bg-success/10 px-2.5 py-1 rounded-lg border border-success/20 inline-block">
                    {{ t('brokenLinks.ready') }}
                </span>
                <span v-else
                    class="text-danger text-center font-semibold bg-danger/10 px-2.5 py-1 rounded-lg border border-danger/20 inline-block">
                    {{ t('brokenLinks.notReady') }}
                </span>
            </template>
        </BaseTable>

        <!-- مكون الترقيم -->
        <AppPagination :pagination="pagination" :is-loading="isLoading" @change-page="handlePageChange" />
    </div>
</template>
