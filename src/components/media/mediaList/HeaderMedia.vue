<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'

import SearchMedia from '@/components/media/mediaList/searchMedia.vue'
import { Loader, Plus, Download } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// authStore
const authStore = useAuthStore()
const mediaStore = useMediaStore()
const notiStore = useNotificationStore()
const route = useRoute()
const router = useRouter()
const searchInput = ref('')
const selectedCategory = ref('')

// معالجة التصفية حسب التصنيف
const handleCategoryChange = () => {

  router.push({
    name: 'mediaList',
    query: {
      ...route.query,
      page: 1,
      limit: 20,
      category: selectedCategory.value
    }
  })
  mediaStore.setFilters({ category: selectedCategory.value })
}


const handleRefresh = async () => {
  searchInput.value = ''
  selectedCategory.value = ''
  mediaStore.filters.search = ''
  mediaStore.filters.category = ''

  router.push({
    name: 'mediaList',
    query: {
      page: 1,
      limit: 20
    }
  })

  const data = await mediaStore.fetchMedias({
    page: 1,
    limit: 20,
    force: true
  })


  if (data) {
    notiStore.triggerNotification(t('common.refreshSuccess'))
  }

  if (mediaStore.errorMessage) {
    notiStore.triggerNotification(mediaStore.errorMessage)
  }
}

const handleExport = async () => {
  const query = route.query
  console.log(query)
  await mediaStore.exportMedia(query)
}

</script>
<template>
  <div :class="authStore.isEditorAndAbove ? 'grid grid-cols-2 xs:grid-cols-3 md:grid-cols-25' : 'flex '"
    class="gap-fluid-gap p-fluid">

    <!-- 1111 -->
    <!-- حقل البحث -->
    <div class="md:col-span-6 flex self-center relative text-fluid-xs">
      <SearchMedia />
    </div>

    <!-- 2222 -->
    <!-- تصفية حسب التصنيف -->
    <div class="md:col-span-4 self-center">
      <select id="media-category" v-model="selectedCategory"
        class="form-input w-full bg-line/10 border border-accent/20 border-linerounded-xl py-4 text-fluid-xs focus:ring-2 focus:ring-accent/20 cursor-pointer"
        @change="handleCategoryChange">
        <option class="text-fluid-xs" value="">{{ t('media.filter.allCategories') }}</option>
        <option class="text-fluid-xs" value="movie">{{ t('media.filter.movies') }}</option>
        <option class="text-fluid-xs" value="tv">{{ t('media.filter.series') }}</option>
      </select>
    </div>

    <!-- 3333 -->
    <!-- Export -->
    <div v-if="authStore.isEditorAndAbove" class="md:col-span-5 self-center">
      <button type="button"
        class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
        @click="handleExport">
        <Download class="size-5 text-accent" :stroke-width="2" />
        Export
      </button>
    </div>

    <!-- 4444 -->
    <!-- refreshData -->
    <button type="button"
      class="md:col-span-5 btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
      @click="handleRefresh" :disabled="mediaStore.isLoading">
      <Loader class="size-4 text-accent" :class="{ 'animate-spin': mediaStore.isLoading }" :stroke-width="2" />
      <span class="text-fluid-xs">{{ t('media.toolbar.refreshData') }}</span>
    </button>

    <!-- 5555 -->
    <!-- addNewMedia -->
    <router-link v-if="authStore.isEditorAndAbove" to="/new-media"
      class="md:col-span-5 btn-outline gap-1 px-0 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
      <Plus class="max-w-4" />
      <span class="text-fluid-xs">{{ t('media.toolbar.addNewMedia') }}</span>
    </router-link>


  </div>
</template>
