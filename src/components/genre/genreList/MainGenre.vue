<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useGenresStore } from '@/stores/genreStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate, confirmAndDelete } from '@/utils/global'

import BaseTable from '@/components/ui/BaseTable.vue'
import { Info, Trash } from '@lucide/vue'

const { t } = useI18n()
const genresStore = useGenresStore()
const notiStore = useNotificationStore()
const router = useRouter()

// التعامل مع حذف تاسك
const handleDelete = async (id) => {
  if (!id) {
    notiStore.triggerNotification(t('genres.noGenreToDelete'))
    return
  }

  confirmAndDelete({
    message: t('genres.confirmDelete'),
    action: () => genresStore.removeGenreById(id),
    store: genresStore,
    notiStore,
    onSuccess: () => router.push({ name: 'genresList' }),
  })
}

const columns = [
  { label: t('genres.table.id'), key: 'id' },
  { label: t('genres.table.name'), key: 'name' },
  { label: t('genres.table.slug'), key: 'slug' },
  { label: t('genres.table.createdAt'), key: 'created_at' },
  { label: t('genres.table.actions'), key: 'actions' },
]
</script>
<template>
  <div>
    <BaseTable
    :columns="columns"
    :rows="genresStore.allGenres"
    :isLoading="genresStore.isLoading"
    storeKey="genres"
    >

    <template #cell-created_at="{ value }">
      {{ formatDate(value) }}
    </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center justify-center gap-fluid-gap">
            <router-link :to="`/edit-genre/${row.id}`"
              class="flex gap-2 px-3 py-1.5 rounded-xl border border-line font-mediumbg-card hover:bg-line/20 transition-all active:scale-95">
              <Info class="self-center text-accent" />
              <span class="self-center"> {{ t('common.edit') }}</span>
            </router-link>

            <button type="button" @click="handleDelete(row.id)" :disabled="genresStore .isLoading"
              class="flex gap-2 px-3 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
              <Trash class="self-center text-danger" />
              <span class="self-center">{{ t('common.delete') }}</span>
            </button>
          </div>
      </template>
    </BaseTable>
  </div>
</template>
