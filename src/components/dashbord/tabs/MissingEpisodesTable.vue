<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useAnalyticsStore } from '@/stores/analyticsStore'

const router = useRouter()
const analyticsStore = useAnalyticsStore()
const { missingLinksByServer, isLoading } = storeToRefs(analyticsStore)

const servers = [
    { label: 'تليجرام مباشر', value: 'telegram_direct' },
    { label: 'Doodstream', value: 'doodstream' },
    { label: 'Lulustream', value: 'lulustream' },
    { label: 'Mixdrop', value: 'mixdrop' },
    { label: 'Streamtape', value: 'streamtape' },
    { label: 'Voe', value: 'voe' },
    { label: 'VK', value: 'vk' },
]

const selectedServer = ref('telegram_direct')

const loadMissingEpisodes = async () => {
    if (selectedServer.value) {
        await analyticsStore.fetchMissingEpisodesByServer({ serverName: selectedServer.value }, true)
    }
}

onMounted(() => {
    loadMissingEpisodes()
})

</script>

<template>
    <div class="space-y-4">
        <!-- فلتر اختيار السيرفر -->
        <div class="flex items-center justify-between flex-wrap gap-3 bg-card p-fluid rounded-2xl border border-line shadow-soft">
            <label for="server-select" class="whitespace-nowrap text-fluid-xs font-semibold text-main">اختر السيرفر:</label>
            <select id="server-select" v-model="selectedServer" @change="loadMissingEpisodes"
                class="px-3 py-1.5 rounded-xl border border-line bg-card text-fluid-xs text-main focus:outline-none focus:border-accent font-medium min-w-[180px] cursor-pointer transition-colors">
                <option v-for="server in servers" :key="server.value" :value="server.value">
                    {{ server.label }}
                </option>
            </select>
        </div>

        <!-- الجدول -->
        <div class="overflow-x-auto rounded-2xl border border-line bg-card shadow-soft">
            <table class="w-full text-fluid-xs text-right">
                <thead class="text-sub  bg-background border-b border-line">
                    <tr>
                        <th class="p-fluid whitespace-nowrap">اسم العمل</th>
                        <th class="p-fluid whitespace-nowrap">الموسم / الحلقة</th>
                        <th class="p-fluid whitespace-nowrap">النوع</th>
                        <th class="p-fluid whitespace-nowrap">حالة العمل</th>
                        <th class="p-fluid whitespace-nowrap">المعرّف (Identifier)</th>
                        <th class="p-fluid whitespace-nowrap">الحالة</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <tr v-for="item in missingLinksByServer" :key="item.id || item.identifier"
                        @click="router.push(`/media/${item.media_id}/details`)"
                        class="hover:bg-line/10 transition-colors cursor-pointer">

                        <!-- اسم العمل -->
                        <td class="p-fluid font-bold text-main whitespace-nowrap">{{ item.title }}</td>

                        <!-- الموسم / الحلقة -->
                        <td class="p-fluid text-sub whitespace-nowrap">
                            <span v-if="item.season_number">
                                موسم {{ item.season_number }} -
                            </span>
                            {{ item.media_type !== 'movie' ? "حلقة #" + item.episode_number : 'فيلم' }}
                        </td>

                        <!-- النوع -->
                        <td class="p-fluid">
                            <span
                                :class="item.media_type === 'series'
                                    ? 'bg-accent/10 text-accent border-accent/20'
                                    : 'bg-warning/10 text-warning border-warning/20'"
                                class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap">
                                {{ item.media_type === 'series' ? 'مسلسل' : (item.media_type === 'movie' ? 'فيلم' : '-') }}
                            </span>
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

                        <!-- المعرف -->
                        <td class="p-fluid font-mono text-fluid-xs text-sub ltr text-right whitespace-nowrap">
                            {{ item.identifier }}
                        </td>

                        <!-- الحالة -->
                        <td class="p-fluid whitespace-nowrap">
                            <span class="px-2.5 py-1 rounded-full text-fluid-xs font-semibold bg-danger/10 text-danger border border-danger/20 inline-block">
                                مفقود
                            </span>
                        </td>
                    </tr>

                    <tr v-if="!missingLinksByServer.length && !isLoading">
                        <td colspan="6" class="text-center py-8 text-sub italic">لا توجد حلقات مفقودة لهذا السيرفر.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
