<script setup>
// src/components/media/mediaDetail/SeasonInfo.vue
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import { computed, nextTick } from 'vue'

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useMediaContentStore } from '@/stores/mediaContentStore'
import { confirmAndDelete } from '@/utils/global'

const router = useRouter()
const route = useRoute()

const mediaContentStore = useMediaContentStore()
const mediaStore = useMediaStore()
const notiStore = useNotificationStore()

const mediaId = route.params.id

const isSeries = computed(() => {
  nextTick
  // نتأكد الأول إن البيانات موجودة، وبعدين نتحقق هل النوع يساوي 'series'
  return (
    mediaStore.currentMedia?.media_type === 'series' || mediaStore.currentMedia?.category === 'tv'
  )
})

const handleSelectSeason = async (seasonId) => {
  // تعيين الموسم المحدد محلياً بدون استعلام
  mediaContentStore.currentSeason = mediaContentStore.seasons?.find(
    (e) => String(e.id) === String(seasonId),
  )

  await nextTick()

  // التمرير السلس إلى الـ div الخاص بالروابط
  const targetElement = document.getElementById(String(seasonId))
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' })
  }

  await mediaContentStore.getEpisodesBySeasonId(seasonId, true)
}

const handleAddSeason = () => {
  router.push({ name: 'addSeason', params: { media_id: mediaId } })
}

const handleEditSeason = (seasonId) => {
  router.push({ name: 'editSeason', params: { id: seasonId } })
}

const handleDeleteSeason = async (seasonId) => {
  // 1. التأكد من وجود العنصر محلياً قبل الحذف
  if (!seasonId) {
    notiStore.triggerNotification(t('media.seasonInfo.noSeasonToDelete'))
    return
  }

  confirmAndDelete({
    message: t('media.seasonInfo.confirmDelete', { id: seasonId }),
    action: () => mediaContentStore.removeSeasonById(seasonId),
    store: mediaContentStore,
    notiStore,
    onSuccess: () => router.push({ name: 'mediaDetails' }),
  })
}
</script>

<template>
  <main v-if="mediaContentStore.seasons.length > 0" class="space-y-6">
    <!-- حالة جاري التحميل -->
    <div
      v-if="mediaStore.isLoading"
      class="p-fluid text-center text-sub font-medium bg-card rounded-2xl border border-line"
    >
      {{ t('media.seasonInfo.loading') }}
    </div>

    <div v-else class="bg-card rounded-2xl border border-line p-fluid md:p-6 shadow-soft space-y-6">
      <!-- الهيدر: عنوان القائمة وزر الإضافة -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-fluid pb-4 border-b border-line"
      >
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-fluid-h2 font-bold text-main">{{ t('media.seasonInfo.listTitle') }}</h2>
            <p class="text-fluid-xs text-sub">{{ t('media.seasonInfo.listSubtitle') }}</p>
          </div>
        </div>

        <button type="button" @click="handleAddSeason" class="btn-ghost">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>{{ t('media.seasonInfo.addNew') }}</span>
        </button>
      </div>

      <!-- عرض المواسم بنظام الشبكة (Grid Layout) -->
      <div
        v-if="mediaContentStore.seasons && mediaContentStore.seasons.length > 0 && isSeries"
        class="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-3 md:gap-fluid"
      >
        <div
          v-for="season in mediaContentStore.seasons"
          :key="season.id"
          :class="[
            'group bg-card hover:bg-line/10 border rounded-xl p-fluid transition-all duration-200 shadow-soft flex flex-col justify-between gap-3',
            mediaContentStore.currentSeason?.id === season.id
              ? 'border-accent bg-accent/10 ring-2 ring-accent/30'
              : 'border-line hover:border-accent/50',
          ]"
        >
          <!-- الجزء العلوي: رقم الموسم وعدد الحلقات -->
          <div
            @click="handleSelectSeason(season.id)"
            class="cursor-pointer flex items-start flex-wrap justify-between gap-2"
          >
              <span
                class="px-2 py-1 rounded-lg bg-accent/10 text-accent font-black text-fluid-xs flex items-center justify-center border border-accent/20 group-hover:scale-105 transition-transform"
              >
                #{{ season.season_number }}
              </span>
              <div>
                <span class="text-fluid-xs font-boldblock"
                  >{{ t('media.seasonInfo.seasonLabel', { number: season.season_number }) }}</span
                >
                <span class="text-[10px] text-sub/70 font-mono block">ID: {{ season.id }}</span>
              </div>


          </div>
            <!-- شارة عدد الحلقات المضافة -->
            <div
              class="px-2.5 py-1 rounded-full text-fluid-xs font-semibold bg-line/20 border border-line flex items-center gap-1 shrink-0"
              :title="t('media.seasonInfo.episodesCountTitle')"
            >
              <template v-if="season.episodes_count > 0">
                <span class="text-sub">{{ t('media.seasonInfo.episode') }}</span>
                <span class="text-success font-bold">{{ season.episodes_count }}</span>
              </template>
              <template v-else>
                <span class="text-danger text-fluid-xs">{{ t('media.seasonInfo.noEpisodes') }}</span>
              </template>
            </div>
          <!-- تفاصيل إضافية -->
          <div
            class="pt-2 border-t border-line/60 text-fluid-xs flex items-center justify-between text-sub"
          >
            <span>{{ t('media.seasonInfo.identifier') }}</span>
            <code
              class="text-[11px] font-mono bg-line/20 border border-line px-1.5 py-0.5 roundedtruncate max-w-[120px]"
            >
              {{ season.id }}
            </code>
          </div>

          <!-- الإجراءات (تعديل / حذف) -->
          <div class="pt-2 flex items-center justify-end gap-1 border-t border-line/40">
            <button
              type="button"
              @click="handleEditSeason(season.id)"
              class="p-1.5 rounded-lg text-sub hover:text-accent hover:bg-accent/10 transition-colors active:scale-95 cursor-pointer"
              :title="t('media.seasonInfo.editSeason')"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              type="button"
              @click="handleDeleteSeason(season.id)"
              class="p-1.5 rounded-lg text-sub hover:text-danger hover:bg-danger/10 transition-colors active:scale-95 cursor-pointer"
              :title="t('media.seasonInfo.deleteSeason')"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود مواسم -->
      <div
        v-else
        class="text-fluid-xs text-sub py-12 text-center bg-line/5 rounded-2xl border border-dashed border-line space-y-3"
      >
        <div
          class="w-12 h-12 mx-auto rounded-xl bg-line/20 flex items-center justify-center text-sub border border-line"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p class="font-medium">{{ isSeries? t('media.noSeasonsYet') : '' }}</p>
      </div>
    </div>
  </main>
</template>
