<script setup lang="ts">
import { useMediaStore } from '@/stores/mediaStore'

import HeaderMedia from '@/components/media/mediaList/HeaderMedia.vue'
import MainMedia from '@/components/media/mediaList/MainMedia.vue'
import AppPagination from '@/components/utils/AppPagination.vue'
import { useRouter, useRoute } from 'vue-router'

const mediaStore = useMediaStore()
const router = useRouter()
const route = useRoute()
const loadData = async (): Promise<void> => {
    await mediaStore.fetchMedias(route.query)
}
loadData()

const handlePageChange = async (newPage: number): Promise<void> => {
    await router.push({
        query: {
            ...route.query,
            page: newPage,
        },
    })
    // بعد ما الرابط يتحدث، بننادي الدالة تجيب بيانات الصفحة الجديدة
    loadData()
}
</script>

<template>
    <main>
        <div>
            <HeaderMedia />
            <MainMedia />
            <AppPagination :pagination="mediaStore.pagination" :is-loading="mediaStore.isLoading"
                @change-page="handlePageChange" />
        </div>
    </main>
</template>
