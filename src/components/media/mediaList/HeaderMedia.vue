<script setup lang="ts">
import { Loader, Plus, Download } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

import SearchMedia from '@/components/media/mediaList/searchMedia.vue'
import { useMediaStore } from '@/stores/mediaStore'
import { useAuthStore } from '@/stores/authStore'

import type { GetMediasQueryInputsType } from '@/schemas/mediaSchema'

const mediaStore = useMediaStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const selectedCategory = ref<'movie' | 'tv' | null>('movie')

// معالجة التصفية حسب التصنيف
const handleCategoryChange = (): void => {
    // بناء كويوري ديناميكي لتنظيف الرابط في حال عدم وجود تصنيف
    const queryParams: GetMediasQueryInputsType = {
        ...route.query,
        page: 1,
        limit: 20,
        category: selectedCategory.value ? selectedCategory.value : undefined,
    }

    router.push({
        name: 'mediaList',
        query: queryParams,
    })

    if (selectedCategory.value) {
        let params = { category: selectedCategory.value }

        mediaStore.setFilters(params)
    }

    if (!selectedCategory.value) {
        handleRefresh()
    }
}

const handleRefresh = async () => {
    selectedCategory.value = null
    mediaStore.filters.search = null
    mediaStore.filters.category = null

    router.push({
        name: 'mediaList',
        query: {
            page: 1,
            limit: 20,
        },
    })

    await mediaStore.fetchMedias({ page: 1, limit: 20 }, true)
}

const handleExport = async () => {
    await mediaStore.exportMedia(mediaStore.queryParams)
}
</script>
<template>
    <div class="flex flex-wrap md:justify-center gap-fluid-gap mt-8">

        <!-- 1111 -->
        <!-- حقل البحث -->
        <div class="flex self-center relative text-fluid-xs">
            <SearchMedia class="w-[150px] md:w-[400px]" />
        </div>

        <!-- 2222 -->
        <!-- تصفية حسب التصنيف -->
        <div class="self-center">
            <select id="media-category" v-model="selectedCategory"
                class="form-select rounded-xl border border-line text-fluid-xs focus:outline-none focus:border-accent font-medium cursor-pointer"
                @change="handleCategoryChange()">
                <!-- استخدام :value="null" لضمان إرسال قيمة فارغة برمجياً وحذفها من الرابط -->
                <option class="text-fluid-xs" :value="null">
                    {{ t('media.filter.allCategories') }}
                </option>
                <option class="text-fluid-xs" value="movie">{{ t('media.filter.movies') }}</option>
                <option class="text-fluid-xs" value="tv">{{ t('media.filter.series') }}</option>
            </select>
        </div>

        <!-- 3333 -->
        <!-- refreshData -->
        <button type="button"
            class="btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
            @click="handleRefresh" :disabled="mediaStore.isLoading">
            <Loader class="size-4 text-accent" :class="{ 'animate-spin': mediaStore.isLoading }" :stroke-width="2" />
            <span class="text-fluid-xs">{{ t('media.toolbar.refreshData') }}</span>
        </button>

        <!-- 4444 -->
        <!-- addNewMedia -->
        <router-link v-if="authStore.isEditorAndAbove" to="/new-media"
            class="btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
            <Plus class="max-w-4" />
            <span class="text-fluid-xs">{{ t('media.toolbar.addNewMedia') }}</span>
        </router-link>

        <!-- 5555 -->
        <!-- Export -->
        <div v-if="authStore.isEditorAndAbove" class="self-center flex justify-end">
            <button type="button"
                class="px-fluid btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                @click="handleExport">
                <Download class="size-5 text-accent" :stroke-width="2" />
                Export
            </button>
        </div>
    </div>
</template>
