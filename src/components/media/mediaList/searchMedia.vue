<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@lucide/vue'

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { handleSearch } from '@/composables/useSearch'

const router = useRouter()
const route = useRoute()
const mediaStore = useMediaStore()
const notiStore = useNotificationStore()
import { toNumber } from '@/utils/global'

import type {
    SearchResultData,
    MediasResponse
} from '@/types/globalTypes'

const searchInput = ref<string | number | null>('')

const sreach = async (): Promise<void> => {

    const data: false | SearchResultData = await handleSearch({
        searchInput: searchInput.value,
        notiStore: notiStore,
        targetStore: mediaStore,
        apiCallById: (id) => mediaStore.fetchMediaByAnyId(id, 'all', true),
        apiCallAll: () => mediaStore.fetchMedias(mediaStore.queryParams, true),
        apiCallByName: (value) => mediaStore.setFilters({ search: value }),
        defaultErrorMsg: mediaStore.errorMessage,
    })

    // 1. استخراج الـ media_id بشكل آمن
    let finalMediaId: number | null = null
    const current: MediasResponse | null = mediaStore.currentMedia

    if (current && Object.keys(current).length > 0 && "id" in current) {
        finalMediaId = toNumber(current.id)
    }

    // 2. التحقق والتوجيه
    if (data && data.targetId && finalMediaId) {
        if (route.name !== 'mediaDetails') {
            router.push(`/media/${finalMediaId}/details`)
        } else {
            // إذا كنا بالفعل في صفحة التفاصيل وأردنا الانتقال لميديا أخرى
            router.push({ path: `/media/${finalMediaId}/details`, force: true })
        }
    }

    if (data && data.rawValue) {
        router.push({
            name: 'mediaList',
            query: {
                ...route.query,
                search: data.rawValue,
                page: 1,
                limit: 20,
            },
        })
    }
}
</script>

<template>
    <!-- حقل البحث -->
    <div class="col-span-4 flex self-center relative">
        <input placeholder="search by ID or name and press Enter..." id="media-search" type="search"
            v-model="searchInput" class="form-input pl-8 bg-line/10 border border-accent/20 border-linerounded-xl"
            @keyup.enter="sreach" />
        <Search @click="sreach" class="self-center absolute left-2 text-accent w-3 md:w-5" />
    </div>
</template>
