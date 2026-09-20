<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate, confirmAndDelete } from '@/utils/global'
import BaseTable from '@/components/ui/BaseTable.vue'
import { Info, Trash } from '@lucide/vue'

const mediaStore = useMediaStore()
const notiStore = useNotificationStore()
const router = useRouter()

// دالة الحذف مع التأكيد
const handleDelete = async (id, title) => {
  // 1. التأكد من وجود العنصر محلياً قبل الحذف
  if (!id) {
    notiStore.triggerNotification(t('media.noMediaToDelete'))
    return
  }

  confirmAndDelete({
    message: t('media.confirmDelete', { title: title || t('media.thisMedia') }),
    action: () => mediaStore.removeMediaById(id),
    store: mediaStore,
    notiStore,
    onSuccess: () => router.push({ name: 'mediaList' }),
  })
}

// دالة الترتيب عند الضغط على الهيدر
const handleSort = (column) => {
  mediaStore.setSort(column)
}
// في الـ script
const columns = [
  { key: 'poster', label: t('media.table.poster'), sortable: false },
  { key: 'title', label: t('media.table.title'), sortable: true },
  { key: 'category', label: t('media.table.categoryType'), sortable: true },
  { key: 'year', label: t('media.table.year'), sortable: true },
  { key: 'is_ready', label: t('media.table.status'), sortable: true },
  { key: 'created_at', label: t('media.table.createdAt'), sortable: true },
  { key: 'actions', label: t('media.table.actions'), sortable: false },
]

</script>
<template>
  <div>
    <BaseTable
      :columns="columns"
      :rows="mediaStore.medias"
      :isLoading="mediaStore.isLoading"
      :sortBy="mediaStore.filters.sortBy"
      :sortOrder="mediaStore.filters.sortOrder"
      storeKey="media"
      @sort="handleSort"
      >

    <template #cell-title="{ row }">
      <div class="flex flex-col items-center gap-1">
        <div class="font-bold text-fluid-p text-accent">{{ row.title }}</div>

        <div v-if="row.slug" class="text-sub/70 text-fluid-xs ltr text-start font-mono">
          /{{ row.slug }}
        </div>

        <div class="text-fluid-xs flex justify-center">
          <div v-if="row.seasons_count && row.seasons_count > 0" class="flex justify-center items-center gap-1 text-sub">
            <span>{{ row.seasons_count > 1 ? t('media.seasons') + ':' : t('media.season') + ':' }}</span>
            <span class="text-success font-semibold">{{ row.seasons_count }}</span>
          </div>
          <div v-else-if="row.seasons_count === 0 && row.category === 'tv'" class="text-danger/80">
            {{ t('media.noSeasonsYet') }}
          </div>
        </div>
      </div>
    </template>

      <template #cell-created_at="{ value }">
        <!-- التاريخ -->
        {{ formatDate(value) }}
      </template>


      <template #cell-is_ready="{ value }">
        <span :class="[
          'px-2.5 py-1 rounded-full text-fluid-xs font-semibold border inline-block',
          value
            ? 'bg-success/10 text-success border-success/20'
            : 'bg-warning/10 text-warning border-warning/20',
        ]">
          {{ value ? t('media.ready') : t('media.draft') }}
        </span>
      </template>

        <template #cell-poster="{ row }">
          <div>
            <img
              v-if="row.poster_url"
              :src="row.poster_url"
              :alt="row.title"
              class="w-10 h-14 object-cover rounded-xl border border-line shadow-soft shrink-0" />
            <div v-else
              class="w-10 h-14 bg-line/20 rounded-xl border border-line flex items-center justify-center text-[10px] text-sub text-center leading-tight">
              {{ t('media.noImage') }}
            </div>
          </div>
        </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center gap-fluid-gap">
          <router-link :to="`/media/${row.id}/details`"
            class="flex gap-2 px-3 py-1.5 rounded-xl border border-line font-mediumbg-card hover:bg-line/20 transition-all active:scale-95">
            <Info class="self-center text-accent" />
            <span class="self-center">{{ t('common.edit') }}</span>
          </router-link>

          <button type="button" @click="handleDelete(row.id, row.title)" :disabled="mediaStore.isLoading"
            class="flex gap-2 px-3 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
            <Trash class="self-center text-danger" />
            <span class="self-center">{{ t('common.delete') }}</span>
          </button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>
