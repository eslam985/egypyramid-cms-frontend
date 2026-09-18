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
const handleSearch = async () => {
    const rawValue = searchInput.value.trim();
    if (!rawValue) return;

    // التحقق هل القيمة رقم صحيح صافي (بدون علامات عشرية أو حروف)
    const targetId = Number(rawValue);
    const isId = Number.isInteger(targetId) && String(targetId) === rawValue;

    // إذا لم يكن ID صحيحاً، نطبق شرط الـ 3 حروف للبحث بالاسم
    if (!isId && rawValue.length < 3) {
        notiStore.triggerNotification('حقل البحث بالاسم يجب ألا يكون أصغر من 3 حروف !');
        searchInput.value = '';
        return;
    }

    if (isId) {
        const foundMediById = await mediaStore.getMediaById(targetId);
        if (!foundMediById) {
            notiStore.triggerNotification(mediaStore.errorMessage)
            await mediaStore.fetchMedias({ page: 1 }, true)
        }
    } else {
        mediaStore.setFilters({ search: rawValue });
    }

    if (route.name !== 'mediaList') {
        router.push({ name: 'mediaList' });
    }
    searchInput.value = '';
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
