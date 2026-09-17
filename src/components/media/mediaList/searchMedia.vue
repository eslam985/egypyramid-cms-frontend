<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore';
import { Search } from '@lucide/vue'
const router = useRouter()
const route = useRoute()
const mediaStore = useMediaStore()
const notiStore = useNotificationStore();

const searchInput = ref('')
// معالجة البحث عند الضغط على Enter أو زر البحث
const handleSearch = () => {
    if (searchInput.value.length < 3) {
        notiStore.triggerNotification('حقل البحث لا يجب ان يكون اصغر من 3 حروف !')
        searchInput.value = ''
        return
    }

    mediaStore.setFilters({ search: searchInput.value.trim() })
    if (route.name !== 'mediaList') {
        router.push({ name: 'mediaList' })
    }
    searchInput.value = ''

}
</script>

<template>
    <!-- حقل البحث -->
    <div class="col-span-4 flex self-center relative">
        <input placeholder="Quick search..." id="media-search" type="search" v-model="searchInput"
            class="form-input md:p-2.5 text-center" @keyup.enter="handleSearch" />
        <Search @click="handleSearch" class="self-center absolute left-2 text-accent-dark" />

    </div>
</template>
