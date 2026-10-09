<script setup>
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, Loader } from '@lucide/vue'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import { formatDate } from '@/utils/global'

import AppPagination from '@/components/utils/AppPagination.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const analyticsStore = useAnalyticsStore()
const { brokenLinksList, pagination, isLoading } = storeToRefs(analyticsStore)

// 1. تحديد السيرفر الحالي المختار
const selectedServer = ref('mixdrop')

const availableServers = [
    { label: 'تليجرام مباشر', value: 'telegram_direct' },
    { label: 'Doodstream', value: 'doodstream' },
    { label: 'Lulustream', value: 'lulustream' },
    { label: 'Mixdrop', value: 'mixdrop' },
    { label: 'Streamtape', value: 'streamtape' },
    { label: 'Voe', value: 'voe' },
    { label: 'VK', value: 'vk' },
    { label: 'archive', value: 'archive' },
]

const columns = [
    { label: t('brokenLinks.table.name'), key: 'title' },
    { label: t('brokenLinks.table.type'), key: 'type' },
    { label: t('brokenLinks.table.serverQuality'), key: 'server_name' },
    { label: t('brokenLinks.table.url'), key: 'url' },
    { label: t('brokenLinks.table.errorReason'), key: 'error_message' },
    { label: t('brokenLinks.table.lastCheck'), key: 'last_check_at' },
    { label: t('brokenLinks.table.status'), key: 'is_ready' },
]

const query = ({ page = 1, limit = 20, serverName }) => {
    router.push({
        name: 'dashboard',
        query: {
            page,
            limit,
            serverName,
        },
    })
}

// 2. دالة مركزية لجلب البيانات
const loadBrokenLinks = (page = 1) => {
    analyticsStore.fetchBrokenLinks({
        serverName: selectedServer.value,
        page: page,
    })
    query({ serverName: selectedServer.value })
}

const handleRowClick = (row) => {
    router.push(`/media/${row.media_id}/details`)
}

const handleServerChange = () => {
    loadBrokenLinks(1)
}

const handlePageChange = (newPage) => {
    loadBrokenLinks(newPage)
}

const handleExport = async () => {
    await analyticsStore.exportBrokenLinks(route.query)
}

const handleRefresh = async () => {
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
        <div
            :class="
                useAuthStore.isEditorAndAbove
                    ? 'xs:grid-cols-3 md:grid-cols-15'
                    : 'xs:grid-cols-2 md:grid-cols-30'
            "
            class="grid grid-cols-2 gap-fluid-gap w-full"
        >
            <!-- 1111 -->
            <!-- refreshData -->
            <button
                @click="handleRefresh"
                :disabled="isLoading"
                type="button"
                class="md:col-span-5 btn-outline gap-1 px-0 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
            >
                <Loader
                    class="size-5 text-accent"
                    :class="{ 'animate-spin': isLoading }"
                    :stroke-width="2"
                />
                {{ t('common.refreshData') }}
            </button>

            <!-- 2222 -->
            <!-- server-select -->
            <select
                id="server-select"
                v-model="selectedServer"
                @change="handleServerChange"
                :disabled="isLoading"
                class="md:col-span-5 px-3 py-1.5 rounded-xl border border-line bg-card text-fluid-xsfocus:outline-none focus:border-accent font-medium min-w-[180px] cursor-pointer transition-colors"
            >
                <option
                    v-for="server in availableServers"
                    :key="server.value"
                    :value="server.value"
                >
                    {{ server.label }}
                </option>
            </select>

            <!-- 3333 -->
            <!-- Export -->
            <div v-if="authStore.isAdmin" class="md:col-span-5 self-center flex md:justify-end">
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
        <div></div>
        <!-- الجدول -->
        <BaseTable
            :columns="columns"
            :rows="brokenLinksList"
            :isLoading="isLoading"
            storeKey="brokenLinks"
            @row-click="handleRowClick"
        >
            <!-- title, season_number, episode_number -->
            <template #cell-title="{ value, row }">
                <div class="text-center cursor-pointer">
                    <div class="font-bold mb-0.5 whitespace-nowrap">
                        {{ value || t('brokenLinks.unknownWork') }}
                    </div>
                    <div class="text-sub">
                        <span v-if="row.media_type === 'series'">
                            <span v-if="row.season_number"
                                >{{ t('brokenLinks.season') }} {{ row.season_number }} -
                            </span>
                            {{ t('brokenLinks.episode') }} #{{ row.episode_number }}
                        </span>
                        <span v-else class="text-sub/70">{{ t('brokenLinks.customMovie') }}</span>
                    </div>
                </div>
            </template>

            <!-- type -->
            <template #cell-type="{ row }">
                <span
                    :class="
                        row.media_type === 'series'
                            ? 'bg-accent/10 text-accent border-accent/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                    "
                    class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap cursor-pointer"
                >
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
                        class="font-mediumfont-mono text-fluid-xs bg-line/30 border-accent/20 px-2 py-0.5 rounded-md w-fit border"
                    >
                        {{ value }}
                    </div>
                </div>
            </template>

            <!-- url -->
            <template #cell-url="{ value }">
                <div class="text-center" @click.stop>
                    <a
                        :href="value"
                        target="_blank"
                        class="text-accent lg:hover:text-link-hover text-fluid-xs font-mono truncate max-w-xs block"
                    >
                        {{ value }}
                    </a>
                </div>
            </template>

            <!-- Error Reason -->
            <template #cell-error_message="{ value, row }">
                <div class="text-center cursor-pointer">
                    <span
                        class="px-2.5 py-1 whitespace-nowrap rounded-full text-fluid-xs font-semibold bg-danger/10 text-danger border border-danger/20 inline-block font-mono"
                    >
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
                <td class="whitespace-nowrap text-center cursor-pointer">
                    <span
                        v-if="value === true"
                        class="text-success font-semibold bg-success/10 px-2.5 py-1 rounded-lg border border-success/20 inline-block"
                    >
                        {{ t('brokenLinks.ready') }}
                    </span>
                    <span
                        v-else
                        class="text-danger text-center font-semibold bg-danger/10 px-2.5 py-1 rounded-lg border border-danger/20 inline-block"
                    >
                        {{ t('brokenLinks.notReady') }}
                    </span>
                </td>
            </template>
        </BaseTable>

        <!-- مكون الترقيم -->
        <AppPagination
            :pagination="pagination"
            :is-loading="isLoading"
            @change-page="handlePageChange"
        />
    </div>
</template>
