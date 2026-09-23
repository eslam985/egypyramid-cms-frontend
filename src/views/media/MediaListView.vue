<script setup>
import { onMounted } from 'vue'
import { useMediaStore } from '@/stores/mediaStore'

import HeaderMedia from '@/components/media/mediaList/HeaderMedia.vue'
import MainMedia from '@/components/media/mediaList/MainMedia.vue'
import AppPagination from '@/components/utils/AppPagination.vue'
import { useRouter, useRoute } from 'vue-router'

const mediaStore = useMediaStore()
const router = useRouter()
const route = useRoute()
// جلب بيانات الصفحة الأولى عند الفتح
onMounted(async () => {
  router.push({
    name: 'mediaList',
    query: {
      ...route.query,
      page: 1,
      limit: 20
    }
  })
  await mediaStore.fetchMedias({ page: 1, limit: 20 })
})

const handlePageChange = async (newPage) => {
  await mediaStore.setPage(newPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
