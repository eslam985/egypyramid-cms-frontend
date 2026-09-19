<script setup>
import { onMounted } from 'vue'
import { useMediaStore } from '@/stores/mediaStore'

import HeaderMedia from '@/components/media/mediaList/HeaderMedia.vue'
import MainMedia from '@/components/media/mediaList/MainMedia.vue'
import AppPagination from '@/components/utils/AppPagination.vue'

const mediaStore = useMediaStore()

// جلب بيانات الصفحة الأولى عند الفتح
onMounted(async () => {
  await mediaStore.fetchMedias({ page: 1 })
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
      <AppPagination
        :pagination="mediaStore.pagination"
        :is-loading="mediaStore.isLoading"
        @change-page="handlePageChange"
      />
    </div>
  </main>
</template>
