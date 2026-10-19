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

import type { SearchResultData } from '@/types/utilsType'

let searchInput = ref<string | number>('')

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

    const targetMedia = mediaStore.currentMedia ? mediaStore.currentMedia.media_id : null

    // if Search By Id
    if (data && targetMedia) {
        if (!targetMedia) return
        if (route.name !== 'mediaDetails') {
            router.push(`/media/${targetMedia}/details`)
        } else {
            // إذا كنا بالفعل في صفحة التفاصيل وأردنا الانتقال لميديا أخرى
            router.push({ path: `/media/${targetMedia}/details`, force: true })
        }
    }

    // if Search By Name
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
    searchInput.value = ''
}
</script>

<template>
    <!-- حقل البحث -->
    <div class="col-span-4 flex self-center relative">
        <input placeholder="search by ID or name and press Enter..." id="media-search" type="search"
            v-model="searchInput" class="form-input w-[150px] md:w-[400px] pl-8 text-center bg-line/10 border border-accent/20 border-linerounded-xl"
            @keyup.enter="sreach" />
        <Search @click="sreach" class="self-center absolute left-2 text-accent w-3 md:w-5" />
    </div>
</template>
