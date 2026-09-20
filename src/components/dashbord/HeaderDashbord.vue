<script setup>
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { Loader } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const analyticsStore = useAnalyticsStore()

const { isLoading } = storeToRefs(analyticsStore)

const loadDashboardData = async () => {
  await analyticsStore.fetchAllCounters(true)
  await analyticsStore.fetchNotReadyMedias(true)
  await analyticsStore.fetchBrokenLinks({ serverName: 'telegram_direct' }, true)
  await analyticsStore.fetchLockedTelegramLinks(true)
  await analyticsStore.fetchTotalCountersStatusServers('broken', true)
}
</script>
<template>
  <main class="space-y-6">
    <!-- عنوان الصفحة -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-fluid-h3 font-bold">{{ t('dashboard.overview.title') }}</h1>
        <p class="text-[9px] md:text-fluid-p text-sub mt-1 ">
          {{ t('dashboard.overview.subtitle') }}
        </p>
      </div>

      <button
        @click="loadDashboardData"
        class="btn-secondary flex items-center justify-center gap-2 text-fluid-xs min-w-[120px] cursor-pointer"
        :disabled="isLoading"
      >
        <Loader
          class="size-5 text-accent"
          :class="{ 'animate-spin': isLoading }"
          :stroke-width="2"
        />
        <span class="btn-ghost">{{ t('dashboard.overview.refresh') }}</span>
      </button>
    </div>

    <!-- رسائل الخطأ -->
    <div
      v-if="errorMessage"
      class="p-fluid bg-danger/10! border border-danger/20 text-danger rounded-2xl text-fluid-xs font-medium"
    >
      {{ errorMessage }}
    </div>
  </main>
</template>
