<script setup>
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { Download, Loader } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/utils/global'

import AppPagination from '@/components/utils/AppPagination.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const notiStore = useNotificationStore()

const analyticsStore = useAnalyticsStore()
const { mediasNotReadyList, pagination, isLoading } = storeToRefs(analyticsStore)

const columns = [
  { key: 'poster', label: t('notReady.table.poster'), sortable: false },
  { key: 'title', label: t('notReady.table.titleYear'), sortable: false },
  { key: 'type', label: t('notReady.table.typeGenre'), sortable: false },
  { key: 'tmdb', label: t('notReady.table.tmdb'), sortable: false },
  { key: 'created_at', label: t('notReady.table.addedAt'), sortable: true },
]
let action =  { key: 'status', label: t('notReady.table.status'), sortable: false }
if(authStore.isEditorAndAbove) {
  columns.push(action)
}
const handlePageChange = async (newPage) => {
  await analyticsStore.fetchNotReadyMedias(newPage)
}

const handleRowClick = (row) => {
  router.push(`/media/${row.id}/details`)
}


const handleExport = async () => {
  router.push({
    params: {}
  })

  const isSuccess = await analyticsStore.exportNotReadyMedia(route.query)
  if (isSuccess) {
    notiStore.triggerNotification(analyticsStore.successMessage || 'تم تحميل البيانات بنجاح!')
  } else {
    notiStore.triggerNotification(analyticsStore.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
  }
}

const handleRefresh = async () => {
  router.push({
    params: {}
  })
  const data = await analyticsStore.fetchNotReadyMedias(true)
  if (data) {
    notiStore.triggerNotification(analyticsStore.successMessage || 'تم تحديث البيانات بنجاح!')
  } else {
    notiStore.triggerNotification(analyticsStore.errorMessage || 'حدث خطأ اثناء تحديث البيانات!')
  }

}
</script>

<template>
  <div class="space-y-4">
    <div v-if="mediasNotReadyList.length > 0"
      class="flex justify-between gap-fluid-gap w-full">
      <!-- 1111 -->
      <!-- refreshData -->
      <button @click="handleRefresh" :disabled="isLoading" type="button"
        class="md:col-span-5 btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
        <Loader class="size-5 text-accent" :class="{ 'animate-spin': isLoading }" :stroke-width="2" />
        {{ t('common.refreshData') }}
      </button>

      <!-- 2222 -->
      <!-- Export -->
      <div v-if="authStore.isEditorAndAbove" class="md:col-span-5 self-center flex md:justify-end">
        <button type="button"
          class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
          @click="handleExport">
          <Download class="size-5 text-accent" :stroke-width="2" />
          Export
        </button>
      </div>

    </div>

    <BaseTable :columns="columns" :rows="mediasNotReadyList" :isLoading="isLoading" storeKey="notReady"
      @row-click="handleRowClick">
      <template #cell-poster="{ row }">
        <img v-if="row.poster_url" :src="row.poster_url" :alt="row.title"
          class="w-10 h-14 object-cover rounded-xl border border-line shadow-soft mx-auto" />
        <div v-else
          class="w-10 h-14 bg-line/20 rounded-xl border border-line flex items-center justify-center text- text-sub text-center leading-tight mx-auto">
          {{ t('notReady.noImage') }}
        </div>
      </template>

      <template #cell-title="{ row }">
        <div class="font-bold capitalize text-center">{{ row.title }}</div>
        <div class="text-sub text-center" v-if="row.year">{{ row.year }}</div>
      </template>

      <template #cell-type="{ row }">
        <span :class="row.media_type === 'series'
          ? 'bg-accent/10 text-accent border-accent/20'
          : 'bg-warning/10 text-warning border-warning/20'"
          class="px-2 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap mb-1">
          {{ row.media_type === 'series' ? t('notReady.series') : t('notReady.movie') }}
        </span>
        <div class="text-sub/70 truncate max-w- text-center mx-auto" v-if="row.labels">
          {{ row.labels }}
        </div>
      </template>

      <template #cell-tmdb="{ row }">
        <span v-if="row.tmdb_id" class="font-mono text-sub">{{ `#${row.tmdb_id}` ?? '-' }}</span>
      </template>

      <template #cell-created_at="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #cell-status>
        <span
          class="px-2.5 py-1 rounded-full text-fluid-xs text-center font-semibold bg-warning/10 text-warning border border-warning/20 inline-block">
          {{ t('notReady.notReadyBadge') }}
        </span>
      </template>
    </BaseTable>

    <AppPagination :pagination="pagination" :is-loading="isLoading" @change-page="handlePageChange" />
  </div>
</template>
