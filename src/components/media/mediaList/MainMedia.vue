<!-- تعديل ملف العرض الخاص بك ليدعم التبديل والكروت -->
<script setup>
import { ref } from 'vue' // 💡 ضفنا ref
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Info, Trash, LayoutGrid, List } from '@lucide/vue' // 💡 ضفنا أيقونات التبديل

const { t } = useI18n()

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate, confirmAndDelete } from '@/utils/global'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseGrid from '@/components/ui/BaseGrid.vue' // 💡 استيراد الكومبوننت الجديد
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const mediaStore = useMediaStore()
const notiStore = useNotificationStore()
const router = useRouter()

// 💡 الـ State المسؤول عن التحكم في طريقة العرض الافتراضية
const currentView = ref('grid') // الخيارات: 'table' أو 'grid'

const columns = [
  { key: 'poster', label: t('media.table.poster'), sortable: false },
  { key: 'title', label: t('media.table.title'), sortable: true },
  { key: 'category', label: t('media.table.categoryType'), sortable: true },
  { key: 'year', label: t('media.table.year'), sortable: true },
  { key: 'is_ready', label: t('media.table.status'), sortable: true },
  { key: 'created_at', label: t('media.table.createdAt'), sortable: true },
  { key: 'actions', label: t('media.table.actions'), sortable: false },
]

// دالة الحذف والترتيب الحالية كما هي بدون أي تغيير
const handleDelete = async (id, title) => {
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

const handleSort = (column) => {
  mediaStore.setSort(column)
}


const goToMediaDetails = (mediaId) => {
  return router.push(`/media/${mediaId}/details`)
}

</script>

<template>
  <div>
    <!-- 📊 شريط أدوات التبديل (Toolbar Controls) -->
    <div class="flex justify-end items-center mb-3 gap-2">
      <div class="flex items-center gap-1 bg-line/20 p-1 rounded-xl border border-line">
        <!-- زر عرض الجدول -->
        <button @click="currentView = 'table'"
          :class="['p-2 rounded-lg transition-all active:scale-95 cursor-pointer', currentView === 'table' ? 'bg-accent text-white shadow-soft' : 'text-sub hover:bg-line/40']"
          :title="t('common.listView')">
          <List class="w-4 h-4" />
        </button>

        <!-- زر عرض الكروت -->
        <button @click="currentView = 'grid'"
          :class="['p-2 rounded-lg transition-all active:scale-95 cursor-pointer', currentView === 'grid' ? 'bg-accent text-white shadow-soft' : 'text-sub hover:bg-line/40']"
          :title="t('common.gridView')">
          <LayoutGrid class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 1️⃣ طريقة العرض الأولى: الـ الجدول الحالي (Table View) -->
    <div v-if="currentView === 'table'">
      <BaseTable :columns="columns" :rows="mediaStore.medias" :isLoading="mediaStore.isLoading"
        :sortBy="mediaStore.filters.sortBy" :sortOrder="mediaStore.filters.sortOrder" storeKey="media"
        @sort="handleSort">
        <!-- الـ Slots الحالية للجدول كما هي بدون أي تغيير لتوفير وقتك وعملك -->
        <template #cell-title="{ row }">
          <div class="flex flex-col items-center gap-1">
            <div class="font-bold text-fluid-p text-accent">{{ row.title }}</div>
            <div v-if="row.slug" class="text-sub/70 text-fluid-xs ltr text-start font-mono">/{{ row.slug }}</div>
            <div class="text-fluid-xs flex justify-center">
              <div v-if="row.seasons_count && row.seasons_count > 0"
                class="flex justify-center items-center gap-1 text-sub">
                <span>{{ row.seasons_count > 1 ? t('media.seasons') + ':' : t('media.season') + ':' }}</span>
                <span class="text-success font-semibold">{{ row.seasons_count }}</span>
              </div>
              <div v-else-if="row.seasons_count === 0 && row.category === 'tv'" class="text-danger/80">{{
                t('media.noSeasonsYet') }}</div>
            </div>
          </div>
        </template>
        <template #cell-created_at="{ value }">{{ formatDate(value) }}</template>
        <template #cell-is_ready="{ value }">
          <span
            :class="['px-2.5 py-1 rounded-full text-fluid-xs font-semibold border inline-block', value ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20']">
            {{ value ? t('media.ready') : t('media.draft') }}
          </span>
        </template>
        <template #cell-poster="{ row }">
          <img v-if="row.poster_url" :src="row.poster_url" :alt="row.title"
            class="w-10 h-14 object-cover rounded-xl border border-line shadow-soft shrink-0" />
          <div v-else
            class="w-10 h-14 bg-line/20 rounded-xl border border-line flex items-center justify-center text-[10px] text-sub text-center leading-tight">
            {{ t('media.noImage') }}</div>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex items-center justify-center gap-fluid-gap">
            <router-link :to="`/media/${row.id}/details`"
              class="cursor-pointer flex gap-2 px-3 py-1.5 rounded-xl border border-line font-medium bg-card hover:bg-line/20 transition-all active:scale-95">
              <Info class="self-center text-accent" />
              <span class="self-center">{{ t('common.details') }}</span>
            </router-link>
            <button v-if="authStore.isEditorAndAbove" type="button" @click="handleDelete(row.id, row.title)"
              :disabled="mediaStore.isLoading"
              class="flex gap-2 px-3 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
              <Trash class="self-center text-danger" />
              <span class="self-center">{{ t('common.delete') }}</span>
            </button>
          </div>
        </template>
      </BaseTable>
    </div>

    <!-- 2️⃣ طريقة العرض الثانية: الـ كروت المطور الذكي (Grid/Cards View) -->
    <div v-else>
      <BaseGrid :rows="mediaStore.medias" :isLoading="mediaStore.isLoading">
        <template #card="{ row }">
          <!-- منطقة البوستر (Poster Header) -->
          <div @click="goToMediaDetails(row.id)"
            class="relative aspect-square w-full overflow-hidden bg-line/10 group-hover:scale-105 transition-transform duration-500 cursor-pointer">
            <img v-if="row.poster_url" :src="row.poster_url" :alt="row.title" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-sub text-fluid-xs">
              {{ t('media.noImage') }}
            </div>

            <!-- بادج الحالة فوق البوستر (Ready / Draft) -->
            <span
              :class="['absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold shadow-md border', row.is_ready ? 'bg-success/90 border-success text-white' : 'bg-warning/90 border-warning text-black']">
              {{ row.is_ready ? t('media.ready') : t('media.draft') }}
            </span>
          </div>

          <!-- تفاصيل الفيلم/المسلسل (Card Body) -->
          <div class="flex flex-col grow justify-between gap-3 p-fluid">
            <div class="flex flex-col gap-1">
              <!-- العنوان والسنة -->
              <h3
                @click="goToMediaDetails(row.id)"
                class="font-bold text-fluid-p text-accent line-clamp-1 cursor-pointer"
                :title="row.title">{{ row.title }}
              </h3>
              <div class="flex justify-between items-center text-fluid-xs text-sub/80 mt-1">
                <span class="uppercase font-mono bg-line/30 px-2 py-0.5 rounded text-[10px]">{{ row.category }}</span>
                <span>{{ row.year || formatDate(row.created_at) }}</span>
              </div>

              <!-- عدد المواسم لو متوفر -->
              <div v-if="row.category === 'tv'" class="text-fluid-xs text-sub mt-1">
                <span v-if="row.seasons_count > 0" class="text-success font-semibold">{{ row.seasons_count }} {{
                  t('media.seasons') }}</span>
                <span v-else class="text-danger/80">{{ t('media.noSeasonsYet') }}</span>
              </div>
            </div>

            <!-- أزرار التحكم (Card Actions) -->
            <div class="flex items-center gap-2 pt-2 border-t border-line/50 mt-auto">
              <router-link :to="`/media/${row.id}/details`"
                class="grow justify-center flex gap-1.5 px-2 py-2 rounded-xl border border-line text-fluid-xs font-medium bg-card hover:bg-line/10 transition-all active:scale-95">
                <Info class="w-3.5 h-3.5 self-center text-accent" />
                <span class="self-center">{{ t('common.details') }}</span>
              </router-link>

              <button v-if="authStore.isEditorAndAbove" type="button" @click="handleDelete(row.id, row.title)"
                :disabled="mediaStore.isLoading"
                class="p-2 rounded-xl border border-danger/20 hover:bg-danger/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
                <Trash class="w-3.5 h-3.5 text-danger" />
              </button>
            </div>
          </div>
        </template>
      </BaseGrid>
    </div>
  </div>
</template>
