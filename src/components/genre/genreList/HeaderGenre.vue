<script setup lang="ts">
import { Search, Loader, Download } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

import { useNotificationStore } from '@/stores/notificationStore'
import { handleSearch } from '@/composables/useSearch'
import { useGenresStore } from '@/stores/genreStore'
import { useAuthStore } from '@/stores/authStore'

import type { SearchResultData } from '@/types/utilsType'


const searchInput = ref<string | number>('')
const notiStore = useNotificationStore()
const genresStore = useGenresStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()


const handleRefresh = async (): Promise<void> => {
    router.push({
        name: 'genresList',
        query: {
            page: 1,
            limit: 20,
        },
    })

    await genresStore.fetchAllGenres(true)
}


const sreach = async (): Promise<void> => {
    const data: false | SearchResultData = await handleSearch({
        searchInput: searchInput.value,
        notiStore: notiStore,
        targetStore: genresStore,
        apiCallById: (id) => genresStore.fetchGenreById(id, true),
        apiCallAll: () => genresStore.fetchAllGenres(true),
        apiCallByName: (value, force) => genresStore.fetchGenreByName(value, force),
        defaultErrorMsg: genresStore.errorMessage,
    })

    if (data && Object.keys(data).length > 0 && route.name !== 'genresList') {
        router.push({ name: 'genresList' })
    }

    searchInput.value = ''
}

const handleExport = async () => {
    await genresStore.exportGenres()
}
</script>
<template>
    <!-- أدوات الفلترة والبحث والتحديث -->
    <div class="flex flex-wrap md:justify-center gap-fluid-gap my-3">

        <!-- 1111 -->
        <!-- حقل البحث -->
        <div class="flex self-center relative text-fluid-xs">
            <input id="genre-search" type="search" v-model="searchInput" @keyup.enter="sreach"
                :placeholder="t('genres.searchPlaceholder')"
                class="form-input w-[150px] md:w-[400px] pl-8 text-center bg-line/10 border border-accent/20 border-linerounded-xl" />

            <Search @click="sreach" class="self-center absolute left-2 text-accent" />
        </div>

        <!-- 2222 -->
        <div class="self-center">
            <div v-if="(genresStore.allGenres?.length ?? 0) > 0" class="flex justify-center self-center">
                <div
                    class="w-full p-2.5 self-center text-center rounded-xl bg-line/10 border border-accent/20 border-linerounded-xl text-fluid-xs text-nowrap">
                    <span class="text-fluid-xs md:text-fluid-p text-center self-center text-sub">{{
                        t('genres.totalGenres') }}:
                    </span>
                    <span class="text-center text-accent font-bold text-nowrap">
                        {{ genresStore.allGenres?.length ?? 0 }}</span>
                </div>
            </div>
        </div>

        <!-- 3333 -->
        <!-- refreshData -->
        <button type="button"
            class="btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
            @click="handleRefresh" :disabled="genresStore.isLoading">
            <Loader class="size-4 text-accent" :class="{ 'animate-spin': genresStore.isLoading }" :stroke-width="2" />
            <span class="text-fluid-xs">{{ t('media.toolbar.refreshData') }}</span>
        </button>

        <!-- 4444 -->
        <!-- addNew -->
        <router-link v-if="authStore.isEditorAndAbove" to="/new-genre"
            class="btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
            {{ t('genres.addNew') }}
        </router-link>

        <!-- 5555 -->
        <!-- Export -->
        <div v-if="authStore.isEditorAndAbove" class="self-center">
            <button type="button"
                class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                @click="handleExport">
                <Download class="size-5 text-accent" :stroke-width="2" />
                Export
            </button>
        </div>
    </div>
</template>
