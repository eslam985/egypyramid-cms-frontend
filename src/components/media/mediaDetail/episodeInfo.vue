<script setup>
// src/components/media/mediaDetail/episodeInfo.vue
import { useRoute, useRouter } from 'vue-router'
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



const handleSelectEpisode = async (episodeId) => {
    mediaContentStore.currentEpisode = mediaContentStore.episodes?.find(e => String(e.id) === String(episodeId))
    await mediaContentStore.getLinksByEpisodeId(episodeId)
    console.log(mediaContentStore.currentEpisode.id)
}

// 3. إدارة الحلقات
const handleAddEpisode = () => {
    router.push({ name: 'addEpisode', params: { media_id: mediaId } })
}

const handleEditEpisode = async (episode) => {
    await mediaContentStore.getEpisodeById(episode)
    router.push({ name: 'editEpisode', params: { id: mediaContentStore.currentEpisode.id } })
}

const handleDeleteEpisode = (episodeId) => {
    if (!episodeId) {
        notiStore.triggerNotification('لا يوجد حلقة لحذفها')
        return
    }

    confirmAndDelete({
        message: `هل أنت متأكد من حذف الحلقة رقم ${episodeId}؟`,
        action: () => mediaContentStore.removeEpisodeById(episodeId),
        store: mediaContentStore,
        notiStore,
        onSuccess: () => router.push({ name: 'mediaDetails' })
    })
}
</script>

<template>
    <main class="space-y-6">
        <!-- حالة جاري التحميل -->
        <div v-if="mediaStore.isLoading"
            class="p-8 text-center text-sub font-medium bg-card rounded-2xl border border-line">
            جاري تحميل بيانات الحلقات...
        </div>

        <div v-else class="bg-card rounded-2xl border border-line p-4 md:p-6 shadow-soft space-y-6">

            <!-- الهيدر: عنوان القائمة وزر الإضافة -->
            <div
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-fluid-h2 font-bold text-main">قائمة الحلقات</h2>
                        <p class="text-fluid-xs text-sub">إدارة الحلقات والوصول السريع لتفاصيلها</p>
                    </div>
                </div>

                <button type="button" @click="handleAddEpisode"
                    class="btn-primary w-full sm:w-auto px-4 py-2 text-fluid-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>إضافة حلقة جديدة</span>
                </button>
            </div>

            <!-- عرض الحلقات بنظام الشبكة (Grid Layout) -->
            <div v-if="mediaContentStore.episodes && mediaContentStore.episodes.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">

                <div v-for="ep in mediaContentStore.episodes" :key="ep.id" :class="[
                    'group bg-card hover:bg-line/10 border rounded-xl p-4 transition-all duration-200 shadow-soft flex flex-col justify-between gap-3',
                    mediaContentStore.currentEpisode?.id === ep.id ? 'border-accent bg-accent/10 ring-2 ring-accent/30' : 'border-line hover:border-accent/50'
                ]">

                    <!-- الجزء العلوي: رقم الحلقة والروابط -->
                    <a :href="`#${mediaContentStore.currentEpisode?.id}`" @click="handleSelectEpisode(ep.id)"
                        class="cursor-pointer flex items-start justify-between gap-2">
                        <div class="flex items-center gap-2.5">
                            <span
                                class="px-2 py-1 rounded-lg bg-accent/10 text-accent font-black text-fluid-xs flex items-center justify-center border border-accent/20 group-hover:scale-105 transition-transform">
                                #{{ ep.episode_number }}
                            </span>
                            <div>
                                <span class="text-fluid-xs font-bold text-main block">الحلقة {{ ep.episode_number
                                    }}</span>
                                <span class="text-[10px] text-sub/70 font-mono block">ID: {{ ep.id }}</span>
                            </div>
                        </div>

                        <!-- شارة (Badge) عدد الروابط -->
                        <div class="px-2.5 py-1 rounded-full text-fluid-xs font-semibold bg-line/20 border border-line flex items-center gap-1.5 shrink-0"
                            title="عدد الروابط المضافة هذه الحلقة">
                            <svg class="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <template v-if="ep.links_count > 0">
                                <span class="text-sub">روابط</span>
                                <span class="text-success font-bold">{{ ep.links_count }}</span>
                            </template>
                            <template v-else>
                                <span class="text-danger text-[11px]">لا يوجد روابط</span>
                            </template>
                        </div>
                    </a>

                    <!-- تفاصيل إضافية -->
                    <div class="pt-2 border-t border-line/60 text-fluid-xs space-y-1.5">
                        <div class="flex items-center justify-between text-sub">
                            <span>الموسم (Season ID):</span>
                            <span class="font-mono text-main dir-ltr">{{ ep.season_id || 'N/A' }}</span>
                        </div>
                        <div v-if="ep.id" class="flex items-center justify-between text-sub">
                            <span>المعرّف:</span>
                            <code
                                class="text-[11px] font-mono bg-line/20 border border-line px-1.5 py-0.5 rounded text-main truncate max-w-[120px]">
            {{ ep.id }}
        </code>
                        </div>
                    </div>

                    <!-- الإجراءات (تعديل / حذف) -->
                    <div class="pt-2 flex items-center justify-end gap-1 border-t border-line/40">
                        <button type="button" @click="handleEditEpisode(ep.id)"
                            class="p-1.5 rounded-lg text-sub hover:text-accent hover:bg-accent/10 transition-colors active:scale-95 cursor-pointer"
                            title="تعديل الحلقة">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>

                        <button type="button" @click="handleDeleteEpisode(ep.id)"
                            class="p-1.5 rounded-lg text-sub hover:text-danger hover:bg-danger/10 transition-colors active:scale-95 cursor-pointer"
                            title="حذف الحلقة">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            <!-- حالة عدم وجود حلقات -->
            <div v-else
                class="text-fluid-xs text-sub py-12 text-center bg-line/5 rounded-2xl border border-dashed border-line space-y-3">
                <div
                    class="w-12 h-12 mx-auto rounded-xl bg-line/20 flex items-center justify-center text-sub border border-line">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                </div>
                <p class="font-medium">لا توجد حلقات مضافة لهذا الموسم بعد.</p>
            </div>

        </div>
    </main>
</template>
