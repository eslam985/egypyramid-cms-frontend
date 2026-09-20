<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { formatDate } from '@/utils/global'

import AppPagination from '@/components/utils/AppPagination.vue'
import BaseTable from '@/components/ui/BaseTable.vue'

const { t } = useI18n()
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

// 2. دالة مركزية لجلب البيانات
const loadBrokenLinks = (page = 1) => {
  analyticsStore.fetchBrokenLinks(
    {
      serverName: selectedServer.value,
      page: page,
    },
    true,
  )
}

const handleRowClick = (row) => {
  router.push(`/media/${row.media_id}/details`)
}
onMounted(() => {
  loadBrokenLinks()
})

const handleServerChange = () => {
  loadBrokenLinks(1)
}

const handlePageChange = (newPage) => {
  loadBrokenLinks(newPage)
}

const columns = [
  { label: t('brokenLinks.table.name'), key: 'title' },
  { label: t('brokenLinks.table.type'), key: 'type' },
  { label: t('brokenLinks.table.serverQuality'), key: 'server_name' },
  { label: t('brokenLinks.table.url'), key: 'url' },
  { label: t('brokenLinks.table.errorReason'), key: 'error_message' },
  { label: t('brokenLinks.table.lastCheck'), key: 'last_check_at' },
  { label: t('brokenLinks.table.status'), key: 'is_ready' },
]

</script>

<template>
  <div class="space-y-4">
    <!-- قائمة اختيار السيرفر -->
    <div
      class="flex items-center justify-between flex-wrap gap-3 bg-card/80 p-fluid rounded-2xl border border-line shadow-soft">
      <label for="server-select" class="whitespace-nowrap text-fluid-xs font-semibold text-main">{{
        t('brokenLinks.filterByServer')
        }}</label>
      <select id="server-select" v-model="selectedServer" @change="handleServerChange"
        class="px-3 py-1.5 rounded-xl border border-line bg-card text-fluid-xsfocus:outline-none focus:border-accent font-medium min-w-[180px] cursor-pointer transition-colors"
        :disabled="isLoading">
        <option v-for="server in availableServers" :key="server.value" :value="server.value">
          {{ server.label }}
        </option>
      </select>
    </div>

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
        <div class="p-fluid text-center">
          <div class="font-bold mb-0.5 whitespace-nowrap">
            {{ value || t('brokenLinks.unknownWork') }}
          </div>
          <div class="text-sub">
            <span v-if="row.media_type === 'series'">
              <span v-if="row.season_number">{{ t('brokenLinks.season') }} {{ row.season_number }} - </span>
              {{ t('brokenLinks.episode') }} #{{ row.episode_number }}
            </span>
            <span v-else class="text-sub/70">{{ t('brokenLinks.customMovie') }}</span>
          </div>
        </div>
      </template>

      <!-- type -->
      <template #cell-type="{row }">
              <span
                :class="
                  row.media_type === 'series'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'bg-warning/10 text-warning border-warning/20'
                "
                class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap"
              >
                {{
                  row.media_type === 'series' ? t('brokenLinks.series') : t('brokenLinks.movie')
                }}
              </span>
      </template>

      <!--  Server -->
      <template #cell-server_name="{ value }">
            <div class="p-fluid text-sub">
              <div
                class="font-mediumfont-mono text-fluid-xs bg-line/30 border-accent/20 px-2 py-0.5 rounded-md w-fit border"
              >
                {{ value }}
              </div>
            </div>
      </template>

      <!-- url -->
      <template #cell-url="{ value }">
            <div class="p-fluid  text-center" @click.stop>
              <a
                :href="value"
                target="_blank"
                class="text-accent hover:underline text-fluid-xs font-mono truncate max-w-xs block"
              >
                {{ value }}
              </a>
            </div>
      </template>

      <!-- Error Reason -->
      <template #cell-error_message="{ value, row }">
            <div class="p-fluid  text-center">
              <span
                class="px-2.5 py-1 whitespace-nowrap rounded-full text-fluid-xs font-semibold bg-danger/10 text-danger border border-danger/20 inline-block font-mono"
              >
                {{ value|| 'BROKEN' }}
              </span>
              <span class="text-[10px] text-sub mt-1 block ">{{
                t('brokenLinks.checkedCount', { count: row.check_count })
              }}</span>
            </div>
      </template>

      <!-- Date -->
      <template #cell-last_check_at="{ value }">
      {{ formatDate(value) }}
      </template>

      <!-- Is Ready -->
      <template #cell-is_ready="{ value }">
            <td class="p-fluid whitespace-nowrap  text-center">
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
    <AppPagination :pagination="pagination" :is-loading="isLoading" @change-page="handlePageChange" />
  </div>
</template>
