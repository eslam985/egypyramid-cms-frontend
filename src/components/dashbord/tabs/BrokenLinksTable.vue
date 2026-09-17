<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import AppPagination from '@/components/utils/AppPagination.vue'
import { formatDate } from '@/utils/global'

const router = useRouter()
const analyticsStore = useAnalyticsStore()
const { brokenLinksList, pagination, isLoading } = storeToRefs(analyticsStore)

// 1. تحديد السيرفر الحالي المختار
const selectedServer = ref('mixdrop')

const availableServers = [
    { label: 'تليجرام مباشر', value: 'telegram_direct' },
    { label: 'Doodstream', value: 'doodstream' },
    { label: 'Lulustream', value: 'lulustream' },
    { label: 'Mixdrop', value: 'mixdrop' },
    { label: 'Streamtape', value: 'streamtape' },
    { label: 'Voe', value: 'voe' },
    { label: 'VK', value: 'vk' },
    { label: 'archive', value: 'archive' },
]

// 2. دالة مركزية لجلب البيانات
const loadBrokenLinks = (page = 1) => {
    analyticsStore.fetchBrokenLinks({
        serverName: selectedServer.value,
        page: page
    }, true)
}

onMounted(() => {
    loadBrokenLinks()
})

const handleServerChange = () => {
    loadBrokenLinks(1)
}

const handlePageChange = (newPage) => {
    loadBrokenLinks(newPage)
}
</script>

<template>
    <div class="space-y-4">

        <!-- قائمة اختيار السيرفر -->
        <div class="flex items-center justify-between flex-wrap gap-3 bg-card/80 p-fluid rounded-2xl border border-line shadow-soft">
            <label for="server-select" class="whitespace-nowrap text-fluid-xs font-semibold text-main">تصفية حسب السيرفر:</label>
            <select id="server-select" v-model="selectedServer" @change="handleServerChange"
                class="px-3 py-1.5 rounded-xl border border-line bg-card text-fluid-xs text-main focus:outline-none focus:border-accent font-medium min-w-[180px] cursor-pointer transition-colors"
                :disabled="isLoading">
                <option v-for="server in availableServers" :key="server.value" :value="server.value">
                    {{ server.label }}
                </option>
            </select>
        </div>

        <!-- الجدول -->
        <div class="overflow-x-auto rounded-2xl border border-line bg-card shadow-soft">
            <table class="w-full text-fluid-xs text-right">
                <thead class="text-sub bg-line/20 border-b border-line">
                    <tr>
                        <th class="p-fluid whitespace-nowrap">اسم العمل / التفاصيل</th>
                        <th class="p-fluid whitespace-nowrap">النوع</th>
                        <th class="p-fluid whitespace-nowrap">السيرفر / الجودة</th>
                        <th class="p-fluid whitespace-nowrap">الرابط</th>
                        <th class="p-fluid whitespace-nowrap">سبب الخطأ</th>
                        <th class="p-fluid whitespace-nowrap">آخر فحص</th>
                        <th class="p-fluid whitespace-nowrap">حالة العمل</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-line">
                    <tr v-for="item in brokenLinksList" :key="item.id"
                        @click="router.push(`/media/${item.media_id}/details`)"
                        class="hover:bg-line/10 transition-colors cursor-pointer">

                        <!-- اسم العمل والتفاصيل -->
                        <td class="p-fluid">
                            <div class="font-bold text-main mb-0.5 whitespace-nowrap">{{ item.title || 'عمل غير معروف' }}</div>
                            <div class="text-sub">
                                <span v-if="item.media_type === 'series'">
                                    <span v-if="item.season_number">موسم {{ item.season_number }} - </span>
                                    حلقة #{{ item.episode_number }}
                                </span>
                                <span v-else class="text-sub/70">محتوى فيلم مخصص</span>
                            </div>
                        </td>

                        <!-- نوع العمل -->
                        <td class="p-fluid">
                            <span
                                :class="item.media_type === 'series'
                                    ? 'bg-accent/10 text-accent border-accent/20'
                                    : 'bg-warning/10 text-warning border-warning/20'"
                                class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap">
                                {{ item.media_type === 'series' ? 'مسلسل' : 'فيلم' }}
                            </span>
                        </td>

                        <!-- السيرفر والجودة -->
                        <td class="p-fluid text-sub">
                            <div class="font-medium text-main font-mono text-fluid-xs bg-line/30 px-2 py-0.5 rounded-md w-fit mb-1 border border-line/40">
                                {{ item.server_name }}
                            </div>
                            <div class="text-fluid-xs text-sub">
                                <span>{{ item.quality || '-' }}</span>
                                <span v-if="item.link_type"> ({{ item.link_type === 'watch' ? 'مشاهدة' : 'تحميل' }})</span>
                            </div>
                        </td>

                        <!-- الرابط -->
                        <td class="p-fluid ltr text-right" @click.stop>
                            <a :href="item.url" target="_blank"
                                class="text-accent hover:underline text-fluid-xs font-mono truncate max-w-xs block">
                                {{ item.url }}
                            </a>
                        </td>

                        <!-- سبب الخطأ -->
                        <td class="p-fluid">
                            <span class="px-2.5 py-1 whitespace-nowrap rounded-full text-fluid-xs font-semibold bg-danger/10 text-danger border border-danger/20 inline-block font-mono">
                                {{ item.error_message || 'BROKEN' }}
                            </span>
                            <span class="text-[10px] text-sub mt-1 block">فُحص: {{ item.check_count }} مرة</span>
                        </td>

                        <!-- آخر فحص -->
                        <td class="p-fluid text-sub whitespace-nowrap">
                            {{ formatDate(item.last_check_at) }}
                        </td>

                        <!-- حالة العمل -->
                        <td class="p-fluid whitespace-nowrap">
                            <span v-if="item.is_ready === true"
                                class="text-success font-semibold bg-success/10 px-2.5 py-1 rounded-lg border border-success/20 inline-block">
                                جاهز للعرض
                            </span>
                            <span v-else
                                class="text-danger font-semibold bg-danger/10 px-2.5 py-1 rounded-lg border border-danger/20 inline-block">
                                ليس جاهز للعرض
                            </span>
                        </td>
                    </tr>

                    <!-- حالة التحميل أو عدم وجود بيانات -->
                    <tr v-if="isLoading">
                        <td colspan="7" class="text-center py-8 text-accent font-medium animate-pulse">جاري تحميل البيانات...</td>
                    </tr>
                    <tr v-else-if="!brokenLinksList.length">
                        <td colspan="7" class="text-center py-8 text-sub italic">لا توجد روابط مكسورة لهذا السيرفر.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- مكون الترقيم -->
        <AppPagination :pagination="pagination" :is-loading="isLoading" @change-page="handlePageChange" />
    </div>
</template>
