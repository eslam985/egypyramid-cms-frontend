<script setup lang="ts">
import { onUnmounted, watch, computed } from 'vue' // ضفنا computed
import { useRoute } from 'vue-router'
import { useMediaContentStore } from '@/stores/mediaContentStore'
import { useMediaStore } from '@/stores/mediaStore'

import MediaInfoCard from '@/components/media/mediaDetail/MediaInfoCard.vue'
import SeasonInfo from '@/components/media/mediaDetail/SeasonInfo.vue'
import episodeInfo from '@/components/media/mediaDetail/episodeInfo.vue' // يفضل تبدأ بحرف كابيتال EpisodeInfo
import LinksInfo from '@/components/media/mediaDetail/LinksInfo.vue'

const route = useRoute()
const mediaStore = useMediaStore()
const mediaContentStore = useMediaContentStore()

// عملنا متغير ديناميكي بيشوف هل الميديا دي مسلسل ولا لأ
const isSeries = computed(() => {
    return (
        mediaStore.currentMedia?.category === 'tv' ||
        mediaStore.currentMedia?.media_type === 'series'
    )
})

const fetchMediaDetails = async (id: number): Promise<void> => {
    mediaContentStore.resetContentState()
    await mediaStore.getMediaById(id)

    if (isSeries.value) {
        // استخدمنا المتغير هنا
        await mediaContentStore.getSeasonsByMediaId(id, true)
    } else {
        await mediaContentStore.getEpisodesByMediaId(id, { page: 1, limit: 20 }, true)
    }
}

watch(
    (): string | string[] | undefined => route.params.id,
    (newId: string | string[] | undefined) => {
        const id: string | undefined = Array.isArray(newId) ? newId[0] : newId
        const mediaId: number = Number(id)

        if (id && Number.isFinite(mediaId) && route.name === 'mediaDetails') {
            fetchMediaDetails(mediaId)
        }
    },
    { immediate: true },
)

onUnmounted(() => {
    mediaContentStore.resetContentState()
})
</script>
<template>
    <div class="space-y-6 max-w-[1600px] mx-auto w-full min-w-0 overflow-x-hidden">
        <!--
      استخدمنا Grid بدلاً من Flex
      items-start: عشان لو كارت طويل والتاني قصير، القصير ميتمدش ويبقى شكله وحش
      gap-6: بتعمل مسافة محترمة بين الكروت
    -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <!-- 1. كارت بيانات الميديا (بيظهر دايماً في الأول) -->
            <MediaInfoCard />

            <!-- 2. كارت المواسم (بيظهر فقط لو مسلسل) -->
            <!-- لو فيلم، الكارت ده مش هيترندر، والـ Grid هيسحب الحلقات يحطها هنا أوتوماتيك! -->
            <SeasonInfo v-if="isSeries" />

            <!-- 3. كارت الحلقات (أو الأجزاء لو فيلم) -->
            <episodeInfo />

            <!-- 4. كارت الروابط -->
            <!--
        تريك احترافية: لو ده فيلم (يعني 3 سكاشن بس)، الروابط هتبقى لوحدها تحت.
        ممكن نخليها تاخد عرض الشاشتين تحت عشان الشكل يبقى متناسق باستخدام class ديناميكي
      -->
            <LinksInfo :class="{ 'lg:col-span-2 w-full': !isSeries }" />
        </div>
    </div>
</template>
