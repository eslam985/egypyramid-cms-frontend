<script setup>
import { useRouter } from 'vue-router'

import { useMediaStore } from '@/stores/mediaStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatDate, confirmAndDelete } from '@/utils/global'

import { Info, Trash } from '@lucide/vue'

const mediaStore = useMediaStore();
const notiStore = useNotificationStore();
const router = useRouter()


// دالة الترتيب عند الضغط على الهيدر
const handleSort = (column) => {
    mediaStore.setSort(column);
};

// دالة الحذف مع التأكيد
const handleDelete = async (id, title) => {
    // 1. التأكد من وجود العنصر محلياً قبل الحذف
    if (!id) {
        notiStore.triggerNotification('لا يوجد عمل لحذفه')
        return
    }

    confirmAndDelete({
        message: `هل أنت متاكد من حذف "${title || 'هذه الميديا'}"؟`,
        action: () => mediaStore.removeMediaById(id),
        store: mediaStore,
        notiStore,
        onSuccess: () => router.push({ name: 'mediaList' })
    })
};

</script>

<template>
    <div v-if="mediaStore.medias" class="overflow-x-auto rounded-2xl border border-line bg-card shadow-soft mb-6">
        <table class="w-full text-right border-collapse text-fluid-xs">
            <thead class="bg-line/20 border-b border-line text-sub font-semibold select-none">
                <tr>
                    <th class="p-fluid whitespace-nowrap">البوستر</th>

                    <th class="p-fluid cursor-pointer hover:bg-line/30 transition-colors whitespace-nowrap"
                        @click="handleSort('title')">
                        <div class="flex items-center gap-1">
                            <span>العنوان</span>
                            <span v-if="mediaStore.filters.sortBy === 'title'">
                                {{ mediaStore.filters.sortOrder === 'ASC' ? '▲' : '▼' }}
                            </span>
                        </div>
                    </th>

                    <th class="p-fluid cursor-pointer hover:bg-line/30 transition-colors whitespace-nowrap"
                        @click="handleSort('category')">
                        <div class="flex items-center gap-1">
                            <span>التصنيف / النوع</span>
                            <span v-if="mediaStore.filters.sortBy === 'category'">
                                {{ mediaStore.filters.sortOrder === 'ASC' ? '▲' : '▼' }}
                            </span>
                        </div>
                    </th>

                    <th class="p-fluid cursor-pointer hover:bg-line/30 transition-colors whitespace-nowrap"
                        @click="handleSort('year')">
                        <div class="flex items-center gap-1">
                            <span>السنة</span>
                            <span v-if="mediaStore.filters.sortBy === 'year'">
                                {{ mediaStore.filters.sortOrder === 'ASC' ? '▲' : '▼' }}
                            </span>
                        </div>
                    </th>

                    <th class="p-fluid cursor-pointer hover:bg-line/30 transition-colors whitespace-nowrap"
                        @click="handleSort('is_ready')">
                        <div class="flex items-center gap-1">
                            <span>الحالة</span>
                            <span v-if="mediaStore.filters.sortBy === 'is_ready'">
                                {{ mediaStore.filters.sortOrder === 'ASC' ? '▲' : '▼' }}
                            </span>
                        </div>
                    </th>

                    <th class="p-fluid cursor-pointer hover:bg-line/30 transition-colors whitespace-nowrap"
                        @click="handleSort('created_at')">
                        <div class="flex items-center gap-1">
                            <span>تاريخ الإضافة</span>
                            <span v-if="mediaStore.filters.sortBy === 'created_at'">
                                {{ mediaStore.filters.sortOrder === 'ASC' ? '▲' : '▼' }}
                            </span>
                        </div>
                    </th>

                    <th class="p-fluid text-center whitespace-nowrap">الإجراءات</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-line">
                <!-- حالة جاري التحميل -->
                <tr v-if="mediaStore.isLoading">
                    <td colspan="7" class="p-8 text-center text-sub font-medium">
                        جاري تحميل بيانات الميديا...
                    </td>
                </tr>

                <!-- حالة عدم وجود بيانات -->
                <tr v-else-if="!mediaStore.medias || mediaStore.medias.length === 0">
                    <td colspan="7" class="p-8 text-center text-sub italic">
                        لا توجد ميديا متوفرة حالياً.
                    </td>
                </tr>

                <!-- عرض صفوف الميديا -->
                <tr v-else-if="mediaStore.medias" v-for="item in mediaStore?.medias" :key="item?.id" class="hover:bg-line/40 transition-colors">

                    <!-- البوستر -->
                    <td class="p-fluid whitespace-nowrap">
                        <img v-if="item.poster_url" :src="item.poster_url" :alt="item.title"
                            class="w-10 h-14 object-cover rounded-xl border border-line shadow-soft shrink-0" />
                        <div v-else
                            class="w-10 h-14 bg-line/20 rounded-xl border border-line flex items-center justify-center text-[10px] text-sub text-center leading-tight">
                            بدون صورة
                        </div>
                    </td>

                    <!-- العنوان والـ Slug والمواسم -->
                    <td class="p-fluid whitespace-nowrap">
                        <div class="flex flex-col gap-0.5">
                            <div class="font-bold text-main">{{ item.title }}</div>

                            <div v-if="item.slug" class="text-sub/70 text-fluid-xs ltr text-right font-mono">
                                /{{ item.slug }}
                            </div>

                            <div class="text-fluid-xs">
                                <div v-if="item.seasons_count && item.seasons_count > 0"
                                    class="flex items-center gap-1 text-sub">
                                    <span>{{ item.seasons_count > 1 ? 'seasons:' : 'season:' }}</span>
                                    <span class="text-success font-semibold">{{ item.seasons_count }}</span>
                                </div>
                                <div v-else-if="item.seasons_count === 0 && item.category === 'tv'"
                                    class="text-danger/80">
                                    لا توجد مواسم بعد
                                </div>

                            </div>
                        </div>
                    </td>

                    <!-- التصنيف والنوع -->
                    <td class="p-fluid whitespace-nowrap">
                        <div class="flex flex-col gap-1 items-start">
                            <span
                                class="px-2 py-0.5 rounded-lg text-fluid-xs font-semibold bg-line/20 text-main border border-line">
                                {{ item.category }}
                            </span>
                            <span class="text-fluid-xs text-sub capitalize">
                                {{ item.media_type }}
                            </span>
                        </div>
                    </td>

                    <!-- السنة والتقييم -->
                    <td class="p-fluid text-sub font-medium whitespace-nowrap">
                        <div>{{ item.year }}</div>
                        <div v-if="item.rating" class="text-fluid-xs text-warning font-semibold">
                            ★ {{ item.rating }}
                        </div>
                    </td>

                    <!-- حالة الجاهزية -->
                    <td class="p-fluid whitespace-nowrap">
                        <span :class="[
                            'px-2.5 py-1 rounded-full text-fluid-xs font-semibold border inline-block',
                            item.is_ready
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-warning/10 text-warning border-warning/20'
                        ]">
                            {{ item.is_ready ? 'جاهز' : 'مسودة' }}
                        </span>
                    </td>

                    <!-- التاريخ -->
                    <td class="p-fluid text-sub whitespace-nowrap">
                        {{ formatDate(item.created_at) }}
                    </td>

                    <!-- الإجراءات -->
                    <td class="p-fluid whitespace-nowrap">
                        <div class="flex items-center justify-center gap-3">
                            <router-link :to="`/media/${item.id}/details`"
                                class="flex gap-2 px-3 py-1.5 rounded-xl border border-line font-medium text-main bg-card hover:bg-line/20 transition-all active:scale-95">
                                <Info class="self-center text-accent" />
                                <span class="self-center">التفاصيل</span>
                            </router-link>

                            <button type="button" @click="handleDelete(item.id, item.title)"
                                :disabled="mediaStore.isLoading"
                                class="flex gap-2 px-3 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
                                <Trash class="self-center text-danger " />
                                <span class="self-center">حذف</span>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
