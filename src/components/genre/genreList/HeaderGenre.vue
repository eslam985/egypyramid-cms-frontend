<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Loader, Download } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


import { handleSearch } from '@/composables/useSearch'
import { useGenresStore } from '@/stores/genreStore'
import { useNotificationStore } from '@/stores/notificationStore'

const genresStore = useGenresStore()
const notiStore = useNotificationStore()

const router = useRouter()
const route = useRoute()

const handleRefresh = async () => {
  router.push({
    name: 'genresList',
    query: {
      page: 1,
      limit: 20
    }
  })
  const data = await genresStore.fetchAllGenres(true) // force = true لتجاوز الكاش
  if (data) {
    notiStore.triggerNotification(t('common.refreshSuccess'))
  }
}

const searchInput = ref('')

const sreach = async () => {
  const data = await handleSearch({
    searchInput: searchInput,
    notiStore: notiStore,
    targetStore: genresStore,
    apiCallById: (id) => genresStore.fetchGenreById(id, true),
    apiCallAll: () => genresStore.fetchAllGenres({ force: true }),
    apiCallByName: (value, force) => genresStore.fetchGenreByName(value, force),
    defaultErrorMsg: genresStore.errorMessage
  })

  if (data) {
    if (route.name !== 'genresList') {
      router.push({ name: 'genresList' })
    }
  }
}

const handleExport = async () => {
  const query = route.query
  console.log(query)
  await genresStore.exportGenres(query)
}
</script>
<template>
  <!-- أدوات الفلترة والبحث والتحديث -->
  <div
    class="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-25 gap-fluid-gap w-full bg-card border border-line rounded-2xl p-fluid shadow-soft mb-6">

    <!-- 1111 -->
    <!-- حقل البحث -->
    <div class="md:col-span-6 flex self-center relative text-fluid-xs">
      <input id="genre-search" type="search" v-model="searchInput" @keyup.enter="sreach"
        :placeholder="t('genres.searchPlaceholder')"
        class="form-input pl-8 py-fluid text-center bg-line/10 border border-accent/20 border-linerounded-xl w-full" />

      <Search @click="sreach" class="self-center absolute left-2 text-accent" />
    </div>

    <!-- 2222 -->
    <div class="md:col-span-4 self-center">
      <div v-if="genresStore.allGenres.length > 0" class="flex justify-center self-center ">
        <div
          class="w-full py-3 self-center text-center rounded-xl bg-line/10 border border-accent/20 border-linerounded-xl text-fluid-xs text-nowrap">
          <span class="text-fluid-xs md:text-fluid-p text-center self-center text-sub">{{ t('genres.totalGenres')
            }}:
          </span>
          <span class="text-center text-accent font-bold text-nowrap">
            {{ genresStore.allGenres.length }}</span>
        </div>
      </div>
    </div>


    <!-- 3333 -->
    <!-- Export -->
    <div class="md:col-span-5 self-center">
      <button type="button"
        class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
        @click="handleExport">
        <Download class="size-5 text-accent" :stroke-width="2" />
        Export
      </button>
    </div>

    <!-- 4444 -->
    <!-- refreshData -->
    <button @click="handleRefresh" :disabled="genresStore.isLoading" type="button"
      class="md:col-span-5 btn-outline gap-1 px-0 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
      <Loader class="size-5 text-accent" :class="{ 'animate-spin': genresStore.isLoading }" :stroke-width="2" />
      {{ t('common.refreshData') }}
    </button>

    <!-- 5555 -->
    <!-- addNew -->
    <router-link to="/new-genre"
      class="md:col-span-5 btn-outline gap-1 px-0 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
      {{ t('genres.addNew') }}
    </router-link>

  </div>
</template>
