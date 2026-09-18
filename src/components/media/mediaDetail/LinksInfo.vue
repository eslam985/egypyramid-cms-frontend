<script setup>
// /src/components/media/mediaDetail/LinksInfo.vue
import { useRouter } from 'vue-router'

import { useNotificationStore } from '@/stores/notificationStore'
import { useMediaContentStore } from '@/stores/mediaContentStore'
import { confirmAndDelete, formatDate } from '@/utils/global'

const router = useRouter()

const mediaContentStore = useMediaContentStore()
const notiStore = useNotificationStore()

// 4. إدارة السيرفرات والروابط
const handleAddLink = (episodeId) => {
    router.push({ name: 'addLink', params: { episode_id: episodeId } })
}

const handleEditLink = (linkId) => {
    router.push({ name: 'editLink', params: { id: linkId } })
}


const handleDeleteLink = async (linkId) => {
    if (!linkId) {
        notiStore.triggerNotification('لا يوجد رابط لحذفه')
        return
    }

    confirmAndDelete({
        message: `are you sure to delete Link Id ${linkId}`,
        action: () => mediaContentStore.removeLinkById(linkId),
        store: mediaContentStore,
        notiStore,
        onSuccess: () => router.push({ name: 'mediaDetails' })
    })
}

</script>

<template>
    <!-- قسم التفاصيل (Master-Detail) أسفل جدول الحلقات -->
    <div
        class="bg-card rounded-2xl border border-line p-4 sm:p-6 shadow-soft space-y-4 sm:space-y-6 my-6 max-w-full overflow-hidden">
        <!-- الهيدر: عنوان الحلقة المحددة وزر إضافة رابط -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
            <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <div :id="`${mediaContentStore.currentEpisode?.id}`">
                    <h3 class="text-fluid-h2 font-bold text-main flex items-center gap-2">
                        <span>سيرفرات الحلقة</span>
                        <span v-if="mediaContentStore.currentEpisode?.episode_number" class="text-accent font-black">
                            #{{ mediaContentStore.currentEpisode.episode_number }}
                        </span>
                        <span v-else-if="mediaContentStore.links?.[0]?.episode_id" class="text-accent font-black">
                            #{{ mediaContentStore.links[0].episode_id }}
                        </span>
                    </h3>
                    <p class="text-fluid-xs text-sub">إدارة جميع روابط المشاهدة والتحميل التابعة لهذه الحلقة</p>
                </div>
            </div>

            <!-- زر إضافة رابط جديد (يتحقق من وجود حلقة محدودة سواء كانت تحتوي على روابط أم لا) -->
            <button v-if="mediaContentStore.currentEpisode?.id || mediaContentStore.links?.[0]?.episode_id"
                type="button"
                @click="handleAddLink(mediaContentStore.currentEpisode?.id || mediaContentStore.links[0].episode_id)"
                class="btn-primary w-full sm:w-auto px-4 py-2 text-fluid-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>إضافة سيرفر جديد</span>
            </button>
        </div>

        <div >
            <!-- الحالة الأولى: لا توجد روابط مضافة -->
            <div v-if="!mediaContentStore.links || mediaContentStore.links.length === 0"
                class="text-fluid-xs text-sub py-10 text-center bg-line/5 rounded-2xl border border-dashed border-line space-y-3">
                <div
                    class="w-12 h-12 mx-auto rounded-xl bg-line/20 flex items-center justify-center text-sub border border-line">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <p class="font-semibold text-main">لا توجد روابط أو سيرفرات مضافة لهذه الحلقة بعد</p>
                <p class="text-sub">اختر حلقة من القائمة أعلاه أو أضف سيرفر جديد.</p>
            </div>

            <!-- الحالة الثانية: عرض جدول السيرفرات -->
            <div v-else class="w-full overflow-x-auto rounded-xl border border-line">
                <table class="w-full min-w-[750px] text-right text-fluid-xs whitespace-nowrap">
                    <!-- عناوين الأعمدة -->
                    <thead class="bg-line/10 text-sub border-b border-line font-bold uppercase">
                        <tr>
                            <th class="px-4 py-3">السيرفر</th>
                            <th class="px-4 py-3">حالة الرابط</th>
                            <th class="px-4 py-3">آخر فحص</th>
                            <th class="px-4 py-3">تاريخ الإضافة</th>
                            <th class="px-4 py-3">الرابط المباشر</th>
                            <th class="px-4 py-3 text-center">الفحوصات</th>
                            <th class="px-4 py-3">رسالة الخطأ</th>
                            <th class="px-4 py-3 text-center">الإجراءات</th>
                        </tr>
                    </thead>

                    <!-- صفوف البيانات -->
                    <tbody class="divide-y divide-line/60 bg-card text-main">
                        <tr v-for="link in mediaContentStore.links" :key="link.id"
                            class="hover:bg-line/10 transition-colors">

                            <!-- اسم السيرفر -->
                            <td class="px-4 py-3 font-bold capitalize">
                                <span class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-accent"></span>
                                    {{ link.server_name }}
                                </span>
                            </td>

                            <!-- حالة الرابط -->
                            <td class="px-4 py-3">
                                <!-- 1. سليم -->
                                <span v-if="link.last_check_status === 'valid'"
                                    class="px-2.5 py-1 rounded-md font-semibold text-[11px] inline-flex items-center gap-1.5 bg-success/10 text-success border border-success/20">
                                    <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                                    سليم
                                </span>

                                <!-- 2. معطوب -->
                                <span v-else-if="link.last_check_status === 'broken'"
                                    class="px-2.5 py-1 rounded-md font-semibold text-[11px] inline-flex items-center gap-1.5 bg-danger/10 text-danger border border-danger/20">
                                    <span class="w-1.5 h-1.5 rounded-full bg-danger"></span>
                                    معطوب
                                </span>

                                <!-- 3. قيد الفحص -->
                                <span v-else
                                    class="px-2.5 py-1 rounded-md font-semibold text-[11px] inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    قيد الفحص
                                </span>
                            </td>

                            <!-- تاريخ آخر فحص -->
                            <td class="px-4 py-3 font-mono dir-ltr text-right text-sub">
                                {{ formatDate(link.last_check_at) }}
                            </td>

                            <!-- تاريخ الإضافة -->
                            <td class="px-4 py-3 font-mono dir-ltr text-right text-sub">
                                {{ formatDate(link.created_at) }}
                            </td>

                            <!-- الرابط المباشر -->
                            <td class="px-4 py-3 max-w-[180px]">
                                <a :href="link.url" target="_blank" rel="noopener noreferrer"
                                    class="text-sub hover:text-accent font-mono truncate block dir-ltr text-left transition-colors"
                                    :title="link.url">
                                    {{ link.url }}
                                </a>
                            </td>

                            <!-- عدد الفحوصات -->
                            <td class="px-4 py-3 font-mono text-center">
                                <span class="px-2 py-0.5 bg-line/20 rounded border border-line font-bold text-main">
                                    {{ link.check_count ?? 0 }}
                                </span>
                            </td>

                            <!-- رسالة الخطأ -->
                            <td class="px-4 py-3 max-w-[150px] truncate" :title="link.error_message || ''">
                                <span :class="link.error_message ? 'text-danger font-semibold' : 'text-sub'">
                                    {{ link.error_message || '-' }}
                                </span>
                            </td>

                            <!-- أزرار الإجراءات -->
                            <td class="px-4 py-3">
                                <div class="flex items-center justify-center gap-1">
                                    <button type="button" @click="handleEditLink(link.id)"
                                        class="p-1.5 rounded-lg text-sub hover:text-accent hover:bg-accent/10 transition-colors active:scale-95 cursor-pointer"
                                        title="تعديل الرابط">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>

                                    <button type="button" @click="handleDeleteLink(link.id)"
                                        class="p-1.5 rounded-lg text-sub hover:text-danger hover:bg-danger/10 transition-colors active:scale-95 cursor-pointer"
                                        title="حذف الرابط">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>
