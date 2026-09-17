<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import { formatDate } from '@/utils/global'

import AppPagination from '@/components/utils/AppPagination.vue'

const router = useRouter()

const analyticsStore = useAnalyticsStore()
const { mediasNotReadyList, pagination, isLoading } = storeToRefs(analyticsStore)

const handlePageChange = async (newPage) => {

    await analyticsStore.fetchNotReadyMedias(newPage)
}


</script>

<template>
    <div class="space-y-4">
        <!-- الجدول -->
        <div class="overflow-x-auto rounded-2xl border border-line bg-card shadow-soft">
            <table class="w-full text-fluid-xs text-right">
                <thead class="text-sub bg-background/35 p-fluid border-b border-line">
                    <tr>
                        <th class="p-fluid whitespace-nowrap">البوستر</th>
                        <th class="p-fluid whitespace-nowrap">اسم العمل / السنة</th>
                        <th class="p-fluid whitespace-nowrap">النوع والتصنيف</th>
                        <th class="p-fluid whitespace-nowrap">معرف TMDB</th>
                        <th class="p-fluid whitespace-nowrap">تاريخ الإضافة</th>
                        <th class="p-fluid whitespace-nowrap">الحالة</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <tr v-for="item in mediasNotReadyList" :key="item.id"
                        @click="router.push(`/media/${item.id}/details`)"
                        class="hover:bg-card-hover/10 transition-colors cursor-pointer">

                        <!-- صورة البوستر -->
                        <td class="p-fluid">
                            <img v-if="item.poster_url" :src="item.poster_url" :alt="item.title"
                                class="w-10 h-14 object-cover rounded-xl border border-line shadow-soft" />
                            <div v-else
                                class="w-10 h-14 bg-line/20 rounded-xl border border-line flex items-center justify-center text-[10px] text-sub text-center leading-tight">
                                بدون صورة
                            </div>
                        </td>

                        <!-- الاسم والسنة -->
                        <td class="p-fluid whitespace-nowrap">
                            <div class="font-bold text-main capitalize">{{ item.title }}</div>
                            <div class="text-sub" v-if="item.year">{{ item.year }}</div>
                        </td>

                        <!-- النوع والتصنيفات -->
                        <td class="p-fluid text-sub">
                            <span :class="item.media_type === 'series'
                                ? 'bg-accent/10 text-accent border-accent/20'
                                : 'bg-warning/10 text-warning border-warning/20'"
                                class="px-2 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap mb-1">
                                {{ item.media_type === 'series' ? 'مسلسل' : 'فيلم' }}
                            </span>
                            <div class="text-sub/70 truncate max-w-[150px]" v-if="item.labels">
                                {{ item.labels }}
                            </div>
                        </td>

                        <!-- TMDB ID -->
                        <td class="p-fluid font-mono text-sub ltr text-right whitespace-nowrap">
                            #{{ item.tmdb_id || item.id }}
                        </td>

                        <!-- تاريخ الإضافة -->
                        <td class="p-fluid text-sub whitespace-nowrap">
                            {{ formatDate(item.created_at) }}
                        </td>

                        <!-- الحالة -->
                        <td class="p-fluid whitespace-nowrap">
                            <span
                                class="px-2.5 py-1 rounded-full text-fluid-xs font-semibold bg-warning/10 text-warning border border-warning/20 inline-block">
                                غير جاهز
                            </span>
                        </td>
                    </tr>

                    <tr v-if="!mediasNotReadyList.length && !isLoading">
                        <td colspan="6" class="text-center py-8 text-sub italic">لا توجد أعمال غير جاهزة.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- مكون البجنيشن -->
        <AppPagination :pagination="pagination" :is-loading="isLoading" @change-page="handlePageChange" />
    </div>
</template>
