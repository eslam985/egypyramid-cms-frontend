<script setup>
import { useGenresStore } from '@/stores/genreStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate, confirmAndDelete } from '@/utils/global'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
</script>
<template>
  <div
    class="bg-card border border-line rounded-card shadow-soft overflow-hidden transition-colors duration-300"
  >
    <!-- حالة جاري التحميل -->
    <div v-if="genresStore.isLoading" class="p-8 text-center text-sub font-medium animate-pulse">
      {{ t('genres.loading') }}
    </div>

    <!-- جدول التصنيف عند توفر البيانات -->
    <div
      v-else-if="genresStore.allGenres && genresStore.allGenres.length > 0"
      class="overflow-x-auto"
    >
      <table class="w-full text-start text-sm">
        <thead class="bg-background-alt border-b border-line text-sub font-semibold">
          <tr>
            <th class="p-fluid text-center">{{ t('genres.table.actions') }}</th>
            <th class="p-fluid">{{ t('genres.table.createdAt') }}</th>
            <th class="p-fluid">{{ t('genres.table.slug') }}</th>
            <th class="p-fluid">{{ t('genres.table.name') }}</th>
            <th class="p-fluid">{{ t('genres.table.id') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr
            v-for="genre in genresStore.allGenres"
            :key="genre.id"
            class="hover:bg-card-hover/60 transition-colors duration-150"
          >
            <!-- أزرار الإجراءات -->
            <td class="p-fluid whitespace-nowrap text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  type="button"
                  @click="handleDelete(genre.id)"
                  class="px-3 py-1.5 text-fluid-xs font-semibold text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                >
                  {{ t('common.delete') }}
                </button>

                <router-link
                  :to="`/edit-genre/${genre.id}`"
                  class="px-3 py-1.5 text-fluid-xs font-semibold text-title hover:text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
                >
                  {{ t('common.edit') }}
                </router-link>
              </div>
            </td>

            <!-- تاريخ الإنشاء -->
            <td class="p-fluid whitespace-nowrap text-sub dir-ltr text-right">
              {{ formatDate(genre.created_at) }}
            </td>

            <!-- الرابط المختصر-->
            <td class="p-fluid max-w-xs truncate text-sub" :title="genre.slug">
              {{ genre.slug || '-' }}
            </td>

            <!-- اسم التصنيف -->
            <td class="p-4">
              <div class="font-semibold text-title leading-snug max-w-xs sm:max-w-md truncate">
                {{ genre.name }}
              </div>
            </td>

            <!-- معرف التصنيف -->
            <td class="p-fluid whitespace-nowrap text-sub dir-ltr text-right">
              {{ genre.id }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- حالة عدم وجود بيانات -->
    <div v-else class="p-12 text-center text-sub font-medium">{{ t('genres.noData') }}</div>
  </div>
</template>
