<script setup>
import { useAuthStore } from './stores/authStore'

import NotificationApp from '@/components/utils/notificationApp.vue'
import ConfirmModal from '@/components/utils/ConfirmModal.vue'
import ServerError from '@/views/errors/ServerError.vue'
import BackToTop from '@/components/utils/BackToTop.vue';

const authStore = useAuthStore()
</script>

<template>
    <!-- 🟢 الحالة الأولى: جاري تهيئة النظام عند فتح التطبيق أول مرة -->
    <div v-if="!authStore.isInitialized && authStore.isLoading"
        class="flex flex-col justify-center items-center h-screen bg-gray-50 font-sans">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-5"></div>
        <p class="mb-4">Loading...</p>
        <div class="flex items-center gap-2 shrink-0 h-10">
            <img alt="logo"
                class="max-w-[200px] w-auto object-contain transition-transform duration-200 hover:scale-105"
                src="https://res.cloudinary.com/dbahqgo8j/image/upload/f_auto,q_auto:best,dpr_2.0/v1/blogger/zihpfgs7eta0sffsz1ww">
        </div>
    </div>

    <!-- 🔴 الحالة الثانية: السيرفر متوقف أو لا يستجيب (تظهر صفحة الخطأ بتصميمها المستقل) -->
    <ServerError v-else-if="authStore.isServerError" />

    <!-- 🔵 الحالة الثالثة: الجلسة سليمة والسيرفر يعمل (عرض التطبيق والصفحات) -->
    <div v-else>
        <RouterView />
        <NotificationApp />
        <ConfirmModal />

        <!-- زر العودة للأعلى -->
        <BackToTop />
    </div>
</template>
