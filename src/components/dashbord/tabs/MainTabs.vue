<script setup lang="ts">
import { CircleOff, BoneFracture, Lock, FileX } from '@lucide/vue'
import { useRouter, useRoute } from 'vue-router'
import { defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import { fromRouteQuery } from '@/utils/routerHelpers'


const BrokenLinksTable = defineAsyncComponent(
    () => import('@/components/dashbord/tabs/BrokenLinksTable.vue'),
)
const MissingEpisodesTable = defineAsyncComponent(
    () => import('@/components/dashbord/tabs/MissingEpisodesTable.vue'),
)
const NotReadyMediasTable = defineAsyncComponent(
    () => import('@/components/dashbord/tabs/NotReadyMediasTable.vue'),
)
const TelegramLockedTable = defineAsyncComponent(
    () => import('@/components/dashbord/tabs/TelegramLockedTable.vue'),
)

import type { ServerNameRequest } from '@/types/analyticsType'
import type { BaseQueryRequest } from '@/types/globalTypes'

const analyticsStore = useAnalyticsStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const { mediasNotReadyList, brokenLinksList, telegramLocked, missingLinksByServer } =
    storeToRefs(analyticsStore)

// 1. جعل التبويب الافتراضي فارغاً عند البداية
const activeTab = ref<string | null>(null)

const resetRouterQuery = (): void => {
    router.push({
        query: {},
    })
}

// 2. جلب بيانات التبويب فقط لحظة الضغط عليه
const switchTab = async (tab: string | null): Promise<void | null | undefined> => {
    if (!tab) return null

    activeTab.value = tab

    const paramsWithServerName: ServerNameRequest = {
        page: 1,
        limit: 20,
        serverName: fromRouteQuery(route.query.serverName)
    }

    const params: BaseQueryRequest = {
        page: 1,
        limit: 20,
    }


    if (tab === 'notReady' && !mediasNotReadyList.value.length) {
        resetRouterQuery()
        await analyticsStore.fetchNotReadyMedias(params)
    } else if (tab === 'broken' && !brokenLinksList.value.length) {
        await analyticsStore.fetchBrokenLinks(paramsWithServerName)
    } else if (tab === 'telegram' && !telegramLocked.value.length) {
        resetRouterQuery()
        await analyticsStore.fetchLockedTelegramLinks(params)
    } else if (tab === 'missing') {
        // الكومبوننت سيقوم بالجلب بنفسه مع تحديد السيرفر
    }
}
</script>
<template>
    <div class="rounded-2xl space-y-4 shadow-soft">
        <!-- أزرار التبويبات -->
        <div class="flex flex-wrap items-center gap-fluid-gap">
            <!-- الأعمال غير الجاهزة -->
            <button @click="switchTab('notReady')"
                class="max-w-[250px] px-2! flex items-center justify-center gap-1 py-fluid md:px-4 rounded-xl text-fluid-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 select-none"
                :class="activeTab === 'notReady'
                    ? 'btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70'
                    : 'bg-line/20 border border-line text-sub hover:text-main hover:bg-line/40'
                    ">
                <span class="text-fluid-xs md:text-fluid-p">{{
                    t('dashboard.tabs.notReady', {
                        count: mediasNotReadyList.length,
                    })
                }}</span>
                <CircleOff class="size-4 shrink-0" />
            </button>

            <!-- الروابط المكسورة -->
            <button @click="switchTab('broken')"
                class="max-w-[255px] px-2! flex items-center justify-center gap-1 py-fluid md:px-4 rounded-xl text-fluid-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 select-none"
                :class="activeTab === 'broken'
                    ? 'btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70'
                    : 'bg-line/20 border border-line text-sub hover:text-main hover:bg-line/40'
                    ">
                <span class="text-fluid-xs md:text-fluid-p">{{
                    t('dashboard.tabs.broken', { count: brokenLinksList.length })
                }}</span>
                <BoneFracture class="size-4 shrink-0" />
            </button>

            <!-- روابط تليجرام المقفولة -->
            <button @click="switchTab('telegram')"
                class="max-w-[275px] px-2! flex items-center justify-center gap-1 py-fluid md:px-4 rounded-xl text-fluid-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 select-none"
                :class="activeTab === 'telegram'
                    ? 'btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70'
                    : 'bg-line/20 border border-line text-sub hover:text-main hover:bg-line/40'
                    ">
                <span class="text-fluid-xs md:text-fluid-p">{{
                    t('dashboard.tabs.telegram', { count: telegramLocked.length })
                }}</span>
                <Lock class="size-4 shrink-0" />
            </button>

            <!-- الحلقات المفقودة -->
            <button @click="switchTab('missing')"
                class="max-w-[255px] px-2! flex items-center justify-center gap-1 py-fluid md:px-4 rounded-xl text-fluid-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 select-none"
                :class="activeTab === 'missing'
                    ? 'btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70'
                    : 'bg-line/20 border border-line text-sub hover:text-main hover:bg-line/40'
                    ">
                <span class="text-fluid-xs md:text-fluid-p">{{
                    t('dashboard.tabs.missing', {
                        count: missingLinksByServer.length,
                    })
                }}</span>
                <FileX class="size-4 shrink-0" />
            </button>
        </div>

        <!-- عرض الجدول المناسب -->
        <div class="overflow-x-auto">
            <NotReadyMediasTable v-if="activeTab === 'notReady'" />
            <BrokenLinksTable v-if="activeTab === 'broken'" />
            <TelegramLockedTable v-if="activeTab === 'telegram'" />
            <MissingEpisodesTable v-if="activeTab === 'missing'" />
        </div>
    </div>
</template>
