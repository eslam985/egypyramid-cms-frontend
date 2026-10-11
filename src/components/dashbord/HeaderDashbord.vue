<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { Loader } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import type { StatusTasksRequest } from '@/types/globalTypes'

const { t } = useI18n()
const analyticsStore = useAnalyticsStore()
const router = useRouter()
const { isLoading } = storeToRefs(analyticsStore)


const loadDashboardData = async () => {

    router.push({
        name: 'dashboard',
        query: {},
    })

    await analyticsStore.fetchAllCounters(true)
    await analyticsStore.fetchTotalCountersStatusServers('broken' as StatusTasksRequest, true)
}
</script>
<template>
    <main class="space-y-6">
        <!-- عنوان الصفحة -->
        <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
                <h1 class="text-fluid-h3 font-bold">{{ t('dashboard.overview.title') }}</h1>
                <p class="text-[9px] md:text-fluid-p text-sub mt-1">
                    {{ t('dashboard.overview.subtitle') }}
                </p>
            </div>

            <button @click="loadDashboardData"
                class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                :disabled="isLoading">
                <Loader class="size-5 text-accent" :class="{ 'animate-spin': isLoading }" :stroke-width="2" />
                <span>{{ t('dashboard.overview.refresh') }}</span>
            </button>
        </div>

        <!-- رسائل الخطأ -->
        <div v-if="analyticsStore.errorMessage"
            class="p-fluid bg-danger/10! border border-danger/20 text-danger rounded-2xl text-fluid-xs font-medium">
            {{ analyticsStore.errorMessage }}
        </div>
    </main>
</template>
