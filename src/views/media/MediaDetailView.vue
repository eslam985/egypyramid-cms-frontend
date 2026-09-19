<script setup>
import { onUnmounted, watch } from 'vue'

import { useRoute } from 'vue-router'

import { useMediaContentStore } from '@/stores/mediaContentStore'
import { useMediaStore } from '@/stores/mediaStore'

import MediaInfoCard from '@/components/media/mediaDetail/MediaInfoCard.vue'
import SeasonInfo from '@/components/media/mediaDetail/SeasonInfo.vue'
import episodeInfo from '@/components/media/mediaDetail/episodeInfo.vue'
import LinksInfo from '@/components/media/mediaDetail/LinksInfo.vue'

const route = useRoute()
const mediaStore = useMediaStore()
const mediaContentStore = useMediaContentStore()

const fetchMediaDetails = async (id) => {
  // 1. تفريغ البيانات القديمة فوراً قبل جلب الجديدة
  mediaContentStore.resetContentState()

  // 2. جلب البيانات الجديدة
  await mediaStore.getMediaById(id)
  if (
    mediaStore.currentMedia?.category === 'tv' ||
    mediaStore.currentMedia?.media_type === 'series'
  ) {
    await mediaContentStore.getSeasonsByMediaId(id, true)
  } else {
    await mediaContentStore.getEpisodesByMediaId(id, true)
  }
}

// مراقبة تغير الـ ID في المسار عند التنقل المباشر بين ميديا وأخرى
watch(
  () => route.params.id,
  (newId) => {
    if (newId && route.name === 'mediaDetails') {
      fetchMediaDetails(newId)
    }
  },
  { immediate: true },
)

// تفريغ البيانات عند مغادرة الصفحة كلياً
onUnmounted(() => {
  mediaContentStore.resetContentState()
})
</script>
<template>
  <div class="space-y-6 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
    <MediaInfoCard />

    <SeasonInfo />

    <episodeInfo />

    <LinksInfo />
  </div>
</template>
