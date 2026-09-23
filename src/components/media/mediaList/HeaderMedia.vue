<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'

import SearchMedia from '@/components/media/mediaList/searchMedia.vue'
import { Loader, Plus } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'

const mediaStore = useMediaStore()
const notiStore = useNotificationStore()
const route = useRoute()
const router = useRouter()
const searchInput = ref('')
const selectedCategory = ref('')

// معالجة التصفية حسب التصنيف
const handleCategoryChange = () => {
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
      ...route.query,
      page: 1,
      limit: 20
    }
  })
  await mediaStore.fetchMedias({
    page: 1,
    limit: 20,
    force: true
  })

  if (mediaStore.errorMessage) {
    notiStore.triggerNotification(mediaStore.errorMessage)
  }
}
</script>
<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 md:gap-fluid-gap md:px-6 bg-card ounded-b-lg overflow-x-auto no-scrollbar border border-line rounded-2xl p-fluid shadow-soft mb-6">

    <!-- أدوات الفلترة والبحث -->
    <div class="flex flex-col sm:flex-row items-center gap-3 flex-1">
      <!-- حقل البحث -->
      <div class="w-full sm:w-1/2">
        <SearchMedia />
      </div>

      <!-- تصفية حسب التصنيف -->
      <div class="w-full sm:w-1/2">
        <select id="media-category" v-model="selectedCategory"
          class="form-input w-full bg-line/10 border border-accent/20 border-linerounded-xl p-2.5 text-fluid-xs focus:ring-2 focus:ring-accent/20 cursor-pointer"
          @change="handleCategoryChange">
          <option class="text-fluid-xs" value="">{{ t('media.filter.allCategories') }}</option>
          <option class="text-fluid-xs" value="movie">{{ t('media.filter.movies') }}</option>
          <option class="text-fluid-xs" value="tv">{{ t('media.filter.series') }}</option>
        </select>
      </div>
    </div>


    <!-- أزرار الإجراءات -->
    <div class="flex items-center justify-end gap-3 w-full">
      <button type="button"
        class="btn-outline shadow-glow/10 text-fluid-xs  lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70 w-full"
        @click="handleRefresh" :disabled="mediaStore.isLoading">
        <Loader class="size-5 text-accent" :class="{ 'animate-spin': mediaStore.isLoading }" :stroke-width="2" />
        <span class="text-fluid-xs">{{ t('media.toolbar.refreshData') }}</span>
      </button>

      <router-link to="/new-media"
        class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70 w-full">
        <Plus />
        <span class="text-fluid-xs">{{ t('media.toolbar.addNewMedia') }}</span>
      </router-link>
    </div>

  </div>
</template>
