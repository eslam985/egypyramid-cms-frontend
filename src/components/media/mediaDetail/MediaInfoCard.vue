<script setup>
// /frontend/vue-dashbord/src/components/media/mediaDetail/MediaInfoCard.vue
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { confirmAndDelete } from '@/utils/global'
const router = useRouter()

const mediaStore = useMediaStore()
const notiStore = useNotificationStore()

const handleBack = () => router.push({ name: 'mediaList' })
const handleEditMedia = (item) => router.push({ name: 'editMedia', params: { id: item.id } })

const handleDeleteMedia = () => {
  if (!mediaStore.currentMedia) {
    notiStore.triggerNotification(t('media.noMediaToDelete'))
    return
  }

  confirmAndDelete({
    message: t('media.detail.confirmDeleteWithId', { title: mediaStore.currentMedia.title, id: mediaStore.currentMedia.id }),
    action: () => mediaStore.removeMediaById(mediaStore.currentMedia.id),
    store: mediaStore,
    notiStore,
    onSuccess: () => router.push({ name: 'mediaList' }),
  })
}
</script>
<template>
  <div class="max-w-3xl max-h-3xl bg-card border border-line rounded-2xl shadow-soft overflow-hidden mb-6">
    <!-- حالة جاري التحميل -->
    <div v-if="mediaStore.isLoading" class="p-8 text-center text-sub font-medium">
      {{ t('media.loading') }}
    </div>

    <!-- تفاصيل الميديا -->
    <div v-else-if="mediaStore.currentMedia" class="p-fluid">

      <!-- header -->
      <!-- العنوان والتراجع -->
      <div class="flex items-center gap-3 justify-between mb-4 border-b border-line pb-4">
        <button type="button" @click="handleBack"
          class="p-2.5 rounded-xl bg-line/10 hover:bg-line/20 text-sub border border-line transition-all active:scale-95 cursor-pointer"
          :title="t('media.detail.backToList')">
          <svg class="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-fluid-p font-bold text-sub">
              {{ mediaStore.currentMedia.title }}
            </h1>
            <span class="text-fluid-xs px-2.5 py-0.5 rounded-full font-semibold bg-line/20 text-sub border border-line">
              {{ mediaStore.currentMedia.year }}
            </span>
          </div>
          <p class="text-fluid-xs text-sub font-mono mt-0.5">
            Slug: <span class="text-accent">/{{ mediaStore.currentMedia.slug }}</span>
          </p>
        </div>
      </div>


      <!-- main -->
      <!-- تفاصيل المحتوى -->
      <div class="flex flex-col gap-fluid-gap">

        <!-- left main -->
        <div class="flex">

          <!-- left -->
          <div class="flex flex-col gap-3">

            <!-- الشارات والتصنيفات (Badges) -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 rounded-lg text-fluid-xs font-semibold bg-line/20border border-line">
                {{ t('media.detail.typeLabel') }}: {{ mediaStore.currentMedia.media_type }} ({{
                  mediaStore.currentMedia.category
                }})
              </span>

              <span v-if="mediaStore.currentMedia.rating"
                class="px-3 py-1 rounded-lg text-fluid-xs font-semibold bg-warning/10 text-warning border border-warning/20">
                ⭐ {{ mediaStore.currentMedia.rating }}
              </span>

              <span v-if="mediaStore.currentMedia.runtime"
                class="px-3 py-1 rounded-lg text-fluid-xs font-semibold bg-line/20border border-line">
                ⏱️ {{ mediaStore.currentMedia.runtime }}
              </span>

              <span v-if="mediaStore.currentMedia.tmdb_id"
                class="px-3 py-1 rounded-lg text-fluid-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                TMDB: {{ mediaStore.currentMedia.tmdb_id }}
              </span>
            </div>

            <!-- Labels -->
            <div v-if="mediaStore.currentMedia.labels" class="flex items-center gap-2 text-fluid-xs text-sub">
              <span class="text-main font-semibold">{{ t('media.detail.labels') }}:</span>
              <span class="bg-line/10 px-2 py-0.5 rounded border border-line font-mono">{{
                mediaStore.currentMedia.labels
              }}</span>
            </div>



            <!-- حالات العمل (Flags) -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- Is Ready -->
              <span class="px-3 py-1 rounded-lg text-fluid-xs font-medium border flex items-center gap-1.5" :class="mediaStore.currentMedia.is_ready
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-danger/10 text-danger border-danger/20'
                ">
                <span class="w-2 h-2 rounded-full"
                  :class="mediaStore.currentMedia.is_ready ? 'bg-success' : 'bg-danger'"></span>
                {{ mediaStore.currentMedia.is_ready ? t('media.detail.readyForDisplay') :
                  t('media.detail.notReadyDisplay') }}
              </span>

              <!-- Is Notified -->
              <span class="px-3 py-1 rounded-lg text-fluid-xs font-medium border flex items-center gap-1.5" :class="mediaStore.currentMedia.is_notified
                ? 'bg-accent/10 text-accent border-accent/20'
                : 'bg-line/20 text-sub border-line'
                ">
                {{ mediaStore.currentMedia.is_notified ? t('media.detail.notified') : t('media.detail.notNotified') }}
              </span>

              <!-- Facebook Status -->
              <span class="px-3 py-1 rounded-lg text-fluid-xs font-medium border flex items-center gap-1.5" :class="mediaStore.currentMedia.is_facebook_posted
                ? 'bg-accent/10 text-accent border-accent/20'
                : 'bg-line/20 text-sub border-line'
                ">
                {{
                  mediaStore.currentMedia.is_facebook_posted
                    ? t('media.detail.facebookPosted')
                    : t('media.detail.facebookNotPosted')
                }}
              </span>
            </div>


          </div>


          <!-- البوستر / right  -->
          <div
            class="self-center content-center items-center align-center my-3 mx-auto aspect-1/1 w-50 h-50 rounded-xl overflow-hidden bg-line/10 border border-line relative shadow-soft">
            <img v-if="mediaStore.currentMedia.poster_url" :src="mediaStore.currentMedia.poster_url"
              :alt="mediaStore.currentMedia.title" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-sub gap-2">
              <svg class="w-10 h-10 text-sub/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
              </svg>
              <span class="text-fluid-xs font-medium">{{ t('media.detail.noPoster') }}</span>
            </div>

          </div>
        </div>

        <!-- right main -->



        <!-- Left -->
        <div class=" space-y-4">
          <!-- القصة والوصف -->
          <div class="py-3 mb-3 border-y border-line">
            <h3 class="text-fluid-xs font-boldmb-1">{{ t('media.detail.storyTitle') }}</h3>
            <p dir="rtl" class="text-fluid-xs text-sub leading-relaxed whitespace-pre-line">
              {{ mediaStore.currentMedia.story || t('media.detail.noStory') }}
            </p>
          </div>
        </div>
      </div>

      <!-- action / footer -->
      <!-- أزرار الإجراءات -->
      <div class="flex items-center gap-fluid-gap self-end md:self-auto shrink-0">
        <button type="button" @click="handleEditMedia" class="btn-secondary">
          <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>{{ t('common.edit') }}</span>
        </button>

        <button type="button" @click="handleDeleteMedia"
          class="flex gap-2 px-3 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
          <svg class="w-4 h-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>{{ t('common.delete') }}</span>
        </button>
      </div>

    </div>
    <!-- حالة عدم وجود بيانات -->
    <div v-else class="p-12 text-center text-sub italic">{{ t('media.detail.noData') }}</div>
  </div>
</template>
