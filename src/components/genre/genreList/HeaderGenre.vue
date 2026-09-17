<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useGenresStore } from '@/stores/genreStore'
import { useNotificationStore } from '@/stores/notificationStore'

const genresStore = useGenresStore()
const notiStore = useNotificationStore()

const router = useRouter()
const route = useRoute()

const searchInput = ref('')

const handleSearch = async () => {
    if (searchInput.value.length < 3) {
        notiStore.triggerNotification('حقل البحث لا يجب ان يكون اصغر من 3 حروف !')
        searchInput.value = ''
        return
    }

    const cleanInputValue = searchInput.value?.toString().trim()
    const foundGenre = await genresStore.fetchGenreByName(cleanInputValue)

    if (foundGenre && genresStore.currentGenre) {
        notiStore.triggerNotification(genresStore.successMessage)
    } else {
        notiStore.triggerNotification(genresStore.errorMessage)
    }

    if (route.name !== 'genresList') {
        router.push({ name: 'genresList' })
    }

    searchInput.value = ''

}

const handleRefresh = async () => {
    const data = await genresStore.fetchAllGenres(true) // force = true لتجاوز الكاش
    if (data) {
        notiStore.triggerNotification('تم تحديث البيانات بنجاح 🔄')
    }
}
</script>
<template>
    <!-- تم استبدال bg-card-bg و border-custom-border و shadow-sm بكلاسات النظام -->
    <div class="bg-card border border-line rounded-card p-2 md:p-fluid sm:p-6 shadow-soft mb-6 transition-colors duration-300">
        <div class="flex flex-col lg:flex-row items-end justify-between gap-4">

            <!-- أدوات الفلترة والبحث والتحديث -->
            <div class="grid grid-cols-1 md:grid-cols-12 p-fluid gap-3 md:gap-6 w-full lg:w-auto flex-1">
                <!-- right -->
                <div class="col-span-6 flex justify-around md:justify-end gap-3 md:gap-6">

                    <router-link to="/new-genre"
                        class="btn-primary w-full text-fluid-xs md:text-fluid-p text-center self-center">
                        ✚ إضافة تصنيف جديد
                    </router-link>

                    <button type="button" class="btn-secondary w-full text-fluid-p text-center self-center"
                        @click="handleRefresh" :disabled="genresStore.isLoading">
                        🔄 تحديث البيانات
                    </button>

                </div>

                <!-- left -->
                <div class="col-span-6 grid grid-cols-12 gap-fluid-gap">

                    <!-- حقل البحث -->
                    <div
                        :class="genresStore.allGenres.length > 0 ? 'col-span-6 self-center' : 'col-span-12 self-center'">
                        <input id="genre-search" type="search" v-model="searchInput"
                            placeholder="اكتب اسم التصنيف واضغط Enter...💬" class="form-input"
                            @keyup.enter="handleSearch" />
                    </div>

                    <!-- صندوق إجمالي التصنيفات: تم استبدال bg-slate المباشرة بـ bg-card-hover و border-line لدعم الدارك مود -->
                    <div v-if="genresStore.allGenres.length > 0"
                        class="col-span-6 flex justify-center self-center text-right bg-card-hover hover:bg-card-hover/80 text-sub border border-line font-semibold py-3 px-1 sm:px-4 rounded-xl transition-all duration-200">
                        <div>
                            <span class="text-fluid-xs md:text-fluid-p text-center px-2 self-center text-sub">إجمالي التصنيفات:
                            </span>
                            <span class="text-center text-accent font-bold"> {{ genresStore.allGenres.length }}</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>
