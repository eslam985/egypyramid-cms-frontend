<script setup>
// /frontend/vue-dashbord/src/components/media/mediaDetail/MediaInfoCard.vue
import { useRouter } from 'vue-router'

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
        notiStore.triggerNotification('لا يوجد عمل لحذفه')
        return
    }

    confirmAndDelete({
        message: `هل أنت متأكد من حذف ${mediaStore.currentMedia.title} (الرقم التعريفي: ${mediaStore.currentMedia.id})؟`,
        action: () => mediaStore.removeMediaById(mediaStore.currentMedia.id),
        store: mediaStore,
        notiStore,
        onSuccess: () => router.push({ name: 'mediaList' })
    })
}

</script>
<template>
    <div class="bg-card border border-line rounded-2xl shadow-soft overflow-hidden mb-6">

        <!-- حالة جاري التحميل -->
        <div v-if="mediaStore.isLoading" class="p-8 text-center text-sub font-medium">
            جاري تحميل بيانات الميديا...
        </div>

        <!-- تفاصيل الميديا -->
        <div v-else-if="mediaStore.currentMedia" class="p-4 md:p-6">

            <!-- الهيدر والأزرار -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
                <!-- العنوان والتراجع -->
                <div class="flex items-center gap-3">
                    <button type="button" @click="handleBack"
                        class="p-2.5 rounded-xl bg-line/10 hover:bg-line/20 text-sub border border-line transition-all active:scale-95 cursor-pointer"
                        title="رجوع للقائمة">
                        <svg class="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>

                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-fluid-h2 font-bold text-main">
                                {{ mediaStore.currentMedia.title }}
                            </h1>
                            <span
                                class="text-fluid-xs px-2.5 py-0.5 rounded-full font-semibold bg-line/20 text-sub border border-line">
                                {{ mediaStore.currentMedia.year }}
                            </span>
                        </div>
                        <p class="text-fluid-xs text-sub font-mono mt-0.5">
                            Slug: <span class="text-accent">/{{ mediaStore.currentMedia.slug }}</span>
                        </p>
                    </div>
                </div>

                <!-- أزرار الإجراءات -->
                <div class="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button type="button" @click="handleEditMedia" class="btn-secondary">
                        <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>تعديل</span>
                    </button>

                    <button type="button" @click="handleDeleteMedia" class="btn-danger">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>حذف</span>
                    </button>
                </div>
            </div>

            <!-- تفاصيل المحتوى -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">

                <!-- التفاصيل الرئيسية -->
                <div class="md:col-span-3 space-y-4">

                    <!-- الشارات والتصنيفات (Badges) -->
                    <div class="flex flex-wrap items-center gap-2">
                        <span
                            class="px-3 py-1 rounded-lg text-fluid-xs font-semibold bg-line/20 text-main border border-line">
                            النوع: {{ mediaStore.currentMedia.media_type }} ({{ mediaStore.currentMedia.category }})
                        </span>

                        <span v-if="mediaStore.currentMedia.rating"
                            class="px-3 py-1 rounded-lg text-fluid-xs font-semibold bg-warning/10 text-warning border border-warning/20">
                            ⭐ {{ mediaStore.currentMedia.rating }}
                        </span>

                        <span v-if="mediaStore.currentMedia.runtime"
                            class="px-3 py-1 rounded-lg text-fluid-xs font-semibold bg-line/20 text-main border border-line">
                            ⏱️ {{ mediaStore.currentMedia.runtime }}
                        </span>

                        <span v-if="mediaStore.currentMedia.tmdb_id"
                            class="px-3 py-1 rounded-lg text-fluid-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                            TMDB: {{ mediaStore.currentMedia.tmdb_id }}
                        </span>
                    </div>

                    <!-- حالات العمل (Flags) -->
                    <div class="flex flex-wrap items-center gap-2.5 pt-1">
                        <!-- Is Ready -->
                        <span class="px-3 py-1 rounded-lg text-fluid-xs font-medium border flex items-center gap-1.5"
                            :class="mediaStore.currentMedia.is_ready ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'">
                            <span class="w-2 h-2 rounded-full"
                                :class="mediaStore.currentMedia.is_ready ? 'bg-success' : 'bg-danger'"></span>
                            {{ mediaStore.currentMedia.is_ready ? 'جاهز للعرض' : 'غير جاهز' }}
                        </span>

                        <!-- Is Notified -->
                        <span class="px-3 py-1 rounded-lg text-fluid-xs font-medium border flex items-center gap-1.5"
                            :class="mediaStore.currentMedia.is_notified ? 'bg-accent/10 text-accent border-accent/20' : 'bg-line/20 text-sub border-line'">
                            {{ mediaStore.currentMedia.is_notified ? 'تم إرسال إشعار' : 'لم يرسل إشعار' }}
                        </span>

                        <!-- Facebook Status -->
                        <span class="px-3 py-1 rounded-lg text-fluid-xs font-medium border flex items-center gap-1.5"
                            :class="mediaStore.currentMedia.is_facebook_posted ? 'bg-accent/10 text-accent border-accent/20' : 'bg-line/20 text-sub border-line'">
                            {{ mediaStore.currentMedia.is_facebook_posted ? 'تم النشر في فيسبوك' : 'لم ينشر في فيسبوك'
                            }}
                        </span>
                    </div>

                    <!-- Labels -->
                    <div v-if="mediaStore.currentMedia.labels"
                        class="flex items-center gap-2 text-fluid-xs text-sub pt-1">
                        <span class="text-main font-semibold">Labels:</span>
                        <span class="bg-line/10 px-2 py-0.5 rounded border border-line font-mono">{{
                            mediaStore.currentMedia.labels }}</span>
                    </div>

                    <!-- القصة والوصف -->
                    <div class="pt-3 border-t border-line">
                        <h3 class="text-fluid-xs font-bold text-main mb-1">القصة / الوصف</h3>
                        <p class="text-fluid-xs text-sub leading-relaxed whitespace-pre-line">
                            {{ mediaStore.currentMedia.story || 'لا توجد قصة مضافة لهذا العمل.' }}
                        </p>
                    </div>
                </div>

                <!-- البوستر -->
                <div class="md:col-span-1">
                    <div
                        class="aspect-[2/3] rounded-xl overflow-hidden bg-line/10 border border-line relative shadow-soft">
                        <img v-if="mediaStore.currentMedia.poster_url" :src="mediaStore.currentMedia.poster_url"
                            :alt="mediaStore.currentMedia.title" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex flex-col items-center justify-center text-sub gap-2">
                            <svg class="w-10 h-10 text-sub/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                            </svg>
                            <span class="text-fluid-xs font-medium">لا يوجد بوستر</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- حالة عدم وجود بيانات -->
        <div v-else class="p-12 text-center text-sub italic">
            لا توجد بيانات ميديا لعرضها حالياً.
        </div>
    </div>
</template>
