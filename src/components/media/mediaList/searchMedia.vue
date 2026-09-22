<script setup>
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

const searchInput = ref('')
// id, targetTable, force = false
/*
  searchInput,
  notiStore,
  targetStore,
  apiCallById,
  params,
  apiCallAll,
  apiCallByName,
  defaultErrorMsg = 'Not found!',
*/
const sreach = async () => {
  const data = await handleSearch({
    searchInput: searchInput,
    notiStore: notiStore,
    targetStore: mediaStore,
    apiCallById: (id) => mediaStore.fetchMediaByAnyId(id, 'all', true),
    apiCallAll: () => mediaStore.fetchMedias({ force: true }),
    apiCallByName: (value) => mediaStore.setFilters({ search: value }),
    defaultErrorMsg: mediaStore.errorMessage
  })

  // 1. استخراج الـ media_id بشكل آمن
  let finalMediaId = null;
  const current = mediaStore.currentMedia;

  if (current) {
    if (Array.isArray(current) && current.length > 0) {
      finalMediaId = current[0].media_id;
    } else if (!Array.isArray(current)) {
      finalMediaId = current.media_id;
    }
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

  if (data.rawValue) {
    if (route.name !== 'mediaList') {
      router.push({ name: 'mediaList' })
    }
  }
}
</script>

<template>
  <!-- حقل البحث -->
  <div class="col-span-4 flex self-center relative">
    <input placeholder="Quick search..." id="media-search" type="search" v-model="searchInput"
      class="form-input md:p-2.5 text-center bg-line/10 border border-accent/20 border-linerounded-xl"
      @keyup.enter="sreach" />
    <Search @click="sreach" class="self-center absolute left-2 text-accent w-4 md:2-8" />
  </div>
</template>
