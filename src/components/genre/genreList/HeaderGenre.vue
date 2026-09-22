<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Loader } from '@lucide/vue'
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

</script>
<template>
  <!-- أدوات الفلترة والبحث والتحديث -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 md:gap-fluid-gap md:px-6 bg-card ounded-b-lg overflow-x-auto no-scrollbar border border-line rounded-2xl p-fluid shadow-soft mb-6">

    <!-- left -->
    <div class="flex md:justify-start flex-wrap justify-between items-center gap-fluid-gap flex-1 w-full">
      <!-- حقل البحث -->
      <div class="flex gap-2 self-center relative max-w-[145px] lg:max-w-full">
        <input id="genre-search" type="search" v-model="searchInput" @keyup.enter="sreach"
          :placeholder="t('genres.searchPlaceholder')"
          class="form-input pl-8 py-fluid text-center bg-line/10 border border-accent/20 border-linerounded-xl w-full" />

        <Search @click="sreach" class="self-center absolute left-2 text-accent" />
      </div>


      <!-- صندوق إجمالي التصنيفات: تم استبدال bg-slate المباشرة بـ bg-card-hover و border-line لدعم الدارك مود -->
      <div v-if="genresStore.allGenres.length > 0" class="flex justify-center self-center ">
        <div
          class="w-full py-3 px-fluid rounded-xl bg-line/10 border border-accent/20 border-linerounded-xl text-fluid-xs">
          <span class="text-fluid-xs md:text-fluid-p text-center self-center text-sub">{{ t('genres.totalGenres')
            }}:
          </span>
          <span class="text-center text-accent font-bold text-nowrap">
            {{ genresStore.allGenres.length }}</span>
        </div>
      </div>

    </div>


    <!-- right -->
    <div class="flex  items-center justify-between gap-3 w-full">
      <button @click="handleRefresh" :disabled="genresStore.isLoading" type="button"
        class="btn-outline shadow-glow/10 text-fluid-xs p-fluid lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70 w-full">
        <Loader class="size-5 text-accent" :class="{ 'animate-spin': genresStore.isLoading }" :stroke-width="2" />
        {{ t('common.refreshData') }}
      </button>

      <router-link to="/new-genre"
        class="btn-outline shadow-glow/10 text-fluid-xs p-fluid lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70 w-full">
        {{ t('genres.addNew') }}
      </router-link>
    </div>

  </div>
</template>
