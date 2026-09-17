<!-- /TasksVue/src/components/notificationApp.vue -->
<script setup>
import { useNotificationStore } from '../../stores/notificationStore'


const notiStore = useNotificationStore()
</script>
<template>
    <main>

        <!-- مكون الإشعار المتحرك بـ Tailwind -->
        <transition name="fade">
            <div v-if="notiStore.notification.show"
                class="fixed top-17.5 right-5 bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 min-w-62.5 border border-red-700">
                <!-- أيقونة من فونت اوسوم قمنا بتركيبها سابقاً -->

                <span class="font-bold">{{ notiStore.notification.message }}</span>
            </div>
        </transition>
    </main>
</template>
<style scoped>
/* تأثير دخول وخروج ناعم للإشعار */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
