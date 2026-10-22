<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

import NotificationApp from '@/components/utils/notificationApp.vue'
import ConfirmModal from '@/components/utils/ConfirmModal.vue'
import ServerError from '@/views/errors/ServerError.vue'
import BackToTop from '@/components/utils/BackToTop.vue'

const authStore = useAuthStore()

const loadTheme = () => {
    const savedTheme: string | null = localStorage.getItem('theme')
    const prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark: boolean = savedTheme ? savedTheme === 'dark' : prefersDark

    document.documentElement.classList.toggle('dark', isDark)

    const savedLang: string = localStorage.getItem('lang') || 'ar'
    document.documentElement.lang = savedLang
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
}

onMounted(loadTheme)
</script>
<template>
    <div v-if="!authStore.isInitialized && authStore.isLoading"
        class="flex flex-col justify-center items-center h-screen">

        <div class="w-12 h-12 border-4 border-card border-t-accent rounded-full animate-spin mb-5"></div>

        <p class="mb-4">Loading...</p>
    </div>

    <ServerError v-else-if="authStore.isServerError" />

<!-- أضفنا كلاسات flex و h-screen لمنع انكماش التخطيط الداخلي -->
<div v-else class="flex flex-col h-screen w-full">
    <RouterView />
    <NotificationApp />
    <ConfirmModal />

    <BackToTop />
</div>

</template>
