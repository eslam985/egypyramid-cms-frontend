    <script setup>
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useAnalyticsStore } from '@/stores/analyticsStore'
    import { formatDate } from '@/utils/global'

    const router = useRouter()
    const analyticsStore = useAnalyticsStore()
    const { telegramLocked, isLoading } = storeToRefs(analyticsStore)
</script>
<template>
    <div class="overflow-x-auto rounded-2xl border border-line bg-card shadow-soft">
        <table class="w-full text-fluid-xs text-right">
            <thead class="text-sub bg-line/20 border-b border-line">
                <tr>
                    <th class="p-fluid whitespace-nowrap">اسم العمل / الحلقة</th>
                    <th class="p-fluid whitespace-nowrap">النوع</th>
                    <th class="p-fluid whitespace-nowrap">السيرفر</th>
                    <th class="p-fluid whitespace-nowrap">الرابط المغلَق</th>
                    <th class="p-fluid whitespace-nowrap">حالة العمل</th>
                    <th class="p-fluid whitespace-nowrap">تاريخ الإضافة</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-line">
                <tr v-for="item in telegramLocked" :key="item.id"
                    @click="router.push(`/media/${item.media_id}/details`)"
                    class="hover:bg-line/10 transition-colors cursor-pointer">

                    <!-- اسم العمل ورقم الحلقة -->
                    <td class="p-fluid whitespace-nowrap">
                        <div class="font-bold text-main mb-0.5">{{ item.title }}</div>
                        <div class="text-sub text-fluid-xs">
                            <span v-if="item.media_type === 'series' && item.season_number">
                                موسم {{ item.season_number }} - حلقة #{{ item.episode_number }}
                            </span>
                            <span v-else>
                                محتوى ميديا مخصص
                            </span>
                        </div>
                    </td>

                    <!-- النوع -->
                    <td class="p-fluid whitespace-nowrap">
                        <span :class="item.media_type === 'series'
                                ? 'bg-accent/10 text-accent border-accent/20'
                                : 'bg-warning/10 text-warning border-warning/20'"
                            class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block">
                            {{ item.media_type === 'series' ? 'مسلسل' : 'فيلم' }}
                        </span>
                    </td>

                    <!-- السيرفر -->
                    <td class="p-fluid whitespace-nowrap">
                        <span class="bg-line/20 text-main border border-line px-2 py-1 rounded-lg font-mono text-fluid-xs">
                            {{ item.server_name }}
                        </span>
                    </td>

                    <!-- الرابط المغلَق -->
                    <td class="p-fluid whitespace-nowrap">
                        <a :href="item.url" target="_blank" dir="ltr" @click.stop
                            class="text-link hover:text-link-hover underline underline-offset-2 text-fluid-xs font-mono truncate max-w-xs block">
                            {{ item.url }}
                        </a>
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

                    <!-- تاريخ الإضافة -->
                    <td class="p-fluid text-sub whitespace-nowrap">
                        {{ formatDate(item.created_at) }}
                    </td>

                </tr>
                <tr v-if="!telegramLocked.length && !isLoading">
                    <td colspan="6" class="text-center py-8 text-sub italic">لا توجد روابط تليجرام مقفولة.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
