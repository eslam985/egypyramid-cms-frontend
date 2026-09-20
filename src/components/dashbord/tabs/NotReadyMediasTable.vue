<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import { formatDate } from '@/utils/global'

import AppPagination from '@/components/utils/AppPagination.vue'
import BaseTable from '@/components/ui/BaseTable.vue'

const { t } = useI18n()
const router = useRouter()

const analyticsStore = useAnalyticsStore()
const { mediasNotReadyList, pagination, isLoading } = storeToRefs(analyticsStore)

const handlePageChange = async (newPage) => {
  await analyticsStore.fetchNotReadyMedias(newPage)
}

const handleRowClick = (row) => {
  router.push(`/media/${row.id}/details`)
}

const columns = [
  { key: 'poster', label: t('notReady.table.poster'), sortable: false },
  { key: 'title', label: t('notReady.table.titleYear'), sortable: false },
  { key: 'type', label: t('notReady.table.typeGenre'), sortable: false },
  { key: 'tmdb', label: t('notReady.table.tmdb'), sortable: false },
  { key: 'created_at', label: t('notReady.table.addedAt'), sortable: true },
  { key: 'status', label: t('notReady.table.status'), sortable: false },
]
</script>

<template>
  <div class="space-y-4">
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
          :class="row.media_type === 'series'
           ? 'bg-accent/10 text-accent border-accent/20'
            : 'bg-warning/10 text-warning border-warning/20'"
          class="px-2 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap mb-1"
        >
          {{ row.media_type === 'series'? t('notReady.series') : t('notReady.movie') }}
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
