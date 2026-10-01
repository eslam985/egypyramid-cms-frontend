<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { Download, Loader } from '@lucide/vue'

import BaseTable from '@/components/ui/BaseTable.vue'
import AppPagination from '@/components/utils/AppPagination.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const analyticsStore = useAnalyticsStore()
const notiStore = useNotificationStore()

const { missingLinksByServer, pagination, isLoading } = storeToRefs(analyticsStore)

const servers = [
  { label: 'تليجرام مباشر', value: 'telegram_direct' },
  { label: 'Doodstream', value: 'doodstream' },
  { label: 'Lulustream', value: 'lulustream' },
  { label: 'Mixdrop', value: 'mixdrop' },
  { label: 'Streamtape', value: 'streamtape' },
  { label: 'Voe', value: 'voe' },
  { label: 'VK', value: 'vk' },
]
const columns = [
  { label: t('missingEpisodes.table.title'), key: 'title' },
  { label: t('missingEpisodes.table.seasonEpisode'), key: 'season_number' },
  { label: t('missingEpisodes.table.type'), key: 'media_type' },
  { label: t('missingEpisodes.table.workStatus'), key: 'is_ready' },
  { label: t('missingEpisodes.table.identifier'), key: 'identifier' },
  { label: t('missingEpisodes.table.status'), key: 'status' },
]

const selectedServer = ref('telegram_direct')
const query = ({ page = 1, limit = 20, serverName }) => {
  router.push({
    name: "dashboard",
    query: {
      page,
      limit,
      serverName
    }
  })
}

const loadMissingEpisodes = async () => {
  if (selectedServer.value) {
    query({ serverName: selectedServer.value })
    await analyticsStore.fetchMissingEpisodesByServer({ serverName: selectedServer.value }, true)
  }
}


const handlePageChange = async (newPage) => {
  query({ serverName: "telegram_direct" })
  await analyticsStore.fetchMissingEpisodesByServer({
    page: newPage,  // غيرتها من newPage لـ page
    serverName: selectedServer.value
  }, true)
}

const handleRowClick = (row) => {
  router.push(`/media/${row.media_id}/details`)
}

onMounted(() => {
  query({ serverName: "telegram_direct" })
  loadMissingEpisodes()
})


const handleExport = async () => {
  const isSuccess = await analyticsStore.exportMissingEpisodesByServer(route.query)
  if (isSuccess) {
    notiStore.triggerNotification(analyticsStore.successMessage || 'تم تحميل البيانات بنجاح!')
  } else {
    notiStore.triggerNotification(analyticsStore.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
  }
}

const handleRefresh = async () => {
  const data = loadMissingEpisodes()
  if (data) {
    notiStore.triggerNotification(analyticsStore.successMessage || 'تم تحديث البيانات بنجاح!')

  } else {
    notiStore.triggerNotification(analyticsStore.errorMessage || 'حدث خطأ اثناء تحديث البيانات!')

  }

}
</script>

<template>
  <div class="space-y-4">
    <!-- فلتر اختيار السيرفر -->
    <!-- قائمة اختيار السيرفر -->
    <div
      class="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-15 gap-fluid-gap w-full bg-card border border-line rounded-2xl p-fluid shadow-soft">
      <!-- 1111 -->
      <!-- refreshData -->
      <button @click="handleRefresh" :disabled="isLoading" type="button"
        class="md:col-span-5 btn-outline gap-1 px-0 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
        <Loader class="size-5 text-accent" :class="{ 'animate-spin': isLoading }" :stroke-width="2" />
        {{ t('common.refreshData') }}
      </button>

      <!-- 2222 -->
      <!-- server-select -->
      <select id="server-select" v-model="selectedServer" @change="loadMissingEpisodes"
        class="md:col-span-5 px-3 py-1.5 rounded-xl border border-line bg-card text-fluid-xsfocus:outline-none focus:border-accent font-medium min-w-[180px] cursor-pointer transition-colors">
        <option v-for="server in servers" :key="server.value" :value="server.value">
          {{ server.label }}
        </option>
      </select>

      <!-- 3333 -->
      <!-- Export -->
      <div class="md:col-span-5 self-center flex md:justify-end">
        <button type="button"
          class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
          @click="handleExport">
          <Download class="size-5 text-accent" :stroke-width="2" />
          Export
        </button>
      </div>
    </div>


    <!-- الجدول -->
    <BaseTable :columns="columns" :rows="missingLinksByServer" :is-loading="isLoading" @row-click="handleRowClick">

      <!-- Season / Episode -->
      <template #cell-season_number="{ row }">
        <div class="text-sub whitespace-nowrap text-center">
          <span v-if="row.season_number">
            {{ t('missingEpisodes.season') }} {{ row.season_number }} -
          </span>
          {{
            row.media_type !== 'movie'
              ? t('missingEpisodes.episode') + ' #' + row.episode_number
              : t('missingEpisodes.movie')
          }}
        </div>
      </template>
      <!-- Type -->
      <template #cell-media_type="{ value }">
        <div class="text-center">
          <span :class="value === 'series'
            ? 'bg-accent/10 text-accent border-accent/20'
            : 'bg-warning/10 text-warning border-warning/20'
            " class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap">
            {{
              value === 'series'
                ? t('missingEpisodes.series')
                : value === 'movie'
                  ? t('missingEpisodes.movie')
                  : '-'
            }}
          </span>
        </div>
      </template>

      <!-- Work Status -->
      <template #cell-is_ready="{ value }">
        <div class="whitespace-nowrap text-center">
          <span v-if="value === true"
            class="text-success font-semibold bg-success/10 px-2.5 py-1 rounded-lg border border-success/20 inline-block">
            {{ t('missingEpisodes.ready') }}
          </span>
          <span v-else
            class="text-danger font-semibold bg-danger/10 px-2.5 py-1 rounded-lg border border-danger/20 inline-block">
            {{ t('missingEpisodes.notReady') }}
          </span>
        </div>
      </template>

      <!-- الحالة -->
      <template #cell-status="value">
        <div class="whitespace-nowrap text-center">
          <span v-if="value"
            class="px-2.5 py-1 rounded-full text-fluid-xs font-semibold bg-danger/10 text-danger border border-danger/20 inline-block">
            {{ t('missingEpisodes.missing') }}
          </span>
        </div>
      </template>
    </BaseTable>


    <AppPagination :pagination="pagination" :is-loading="isLoading" @change-page="handlePageChange" />
  </div>
</template>
