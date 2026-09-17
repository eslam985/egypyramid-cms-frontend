<script setup>
import { ref } from 'vue'

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'

import SearchMedia from '@/components/media/mediaList/searchMedia.vue'
import { Loader } from '@lucide/vue'

const mediaStore = useMediaStore()
const notiStore = useNotificationStore()

const searchInput = ref('')
const selectedCategory = ref('')

// معالجة التصفية حسب التصنيف
const handleCategoryChange = () => {
    mediaStore.setFilters({ category: selectedCategory.value })
}

// إعادة تعيين الفلاتر والجلب من جديد
const handleRefresh = async () => {
    searchInput.value = ''
    selectedCategory.value = ''
    mediaStore.filters.search = ''
    mediaStore.filters.category = ''
    await mediaStore.fetchMedias({ page: 1 }, true)

    if (mediaStore.errorMessage) {
        notiStore.triggerNotification(mediaStore.errorMessage)
    }
}
</script>

<template>
    <div class="bg-card border border-line rounded-2xl p-4 md:p-fluid shadow-soft mb-6">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-4">

            <!-- أدوات الفلترة والبحث -->
            <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
                <!-- حقل البحث -->
                <div class="w-full sm:w-1/2">
                    <SearchMedia />
                </div>

                <!-- تصفية حسب التصنيف -->
                <div class="w-full sm:w-1/2">
                    <select id="media-category" v-model="selectedCategory"
                        class="form-input w-full bg-line/10 border border-line text-main rounded-xl p-2.5 text-fluid-xs focus:ring-2 focus:ring-accent/20 cursor-pointer"
                        @change="handleCategoryChange">
                        <option value="">جميع التصنيفات</option>
                        <option value="movie">أفلام (Movie)</option>
                        <option value="tv">مسلسلات (Series)</option>
                    </select>
                </div>
            </div>

            <!-- أزرار الإجراءات -->
            <div class="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <button type="button"
                    class="btn-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 text-fluid-xs active:scale-95 transition-all duration-200 disabled:opacity-50"
                    @click="handleRefresh" :disabled="mediaStore.isLoading">
                <Loader class="size-5 text-accent" :class="{ 'animate-spin': isLoading }" :stroke-width="2" />
                <span class="btn-ghost">تحديث البيانات</span>
                </button>

                <router-link to="/new-media"
                    class="btn-ghost flex-1 sm:flex-none flex items-center justify-center gap-2 text-fluid-xs active:scale-95 transition-all duration-200 whitespace-nowrap">
                    <span>✚ إضافة ميديا جديدة</span>
                </router-link>
            </div>

        </div>
    </div>
</template>
