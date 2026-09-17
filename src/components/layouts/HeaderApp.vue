<script setup>
import { ref, onMounted } from 'vue'
import { Menu, LogOut, Sun, Moon } from '@lucide/vue'
import { useNotificationStore } from '../../stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import SearchMedia from '@/components/media/mediaList/searchMedia.vue'

const notiStore = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()

const isDark = ref(false)

const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
    }
}

onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        isDark.value = true
        document.documentElement.classList.add('dark')
    } else {
        isDark.value = false
        document.documentElement.classList.remove('dark')
    }
})

const handleLogoutClick = async () => {
    // 1. تشغيل دالة المتجر لتنظيف التوكنات والسيرفر
    await authStore.logoutUser()

    // 3. إظهار رسالة نجاح خفيفة للمستخدم
    notiStore.triggerNotification('تم تسجيل الخروج بنجاح.')

    // 4. تحويله فوراً لصفحة تسجيل الدخول القياسية 🏃‍♂️
    router.push('/login')
}
</script>

<template>
    <!-- رفع الـ z-index إلى z-50 بدلاً من z-40 -->
    <header
        class="h-16 bg-card border-b border-line px-fluid flex items-center justify-between sticky top-0 z-0 shadow-soft transition-colors duration-300">

        <!-- الشعار وزر القائمة -->
        <div class="flex items-center gap-fluid-gap">
            <!-- تبديل حالة السايد بار مباشرة عند النقر -->
            <button class="btn-icon" @click="notiStore.openSide()">
                <Menu class="size-5" />
            </button>

            <router-link to="/" class="group h-9 md:h-10 flex items-center shrink-0">
                <h1 class="flex items-center flex-row-reverse gap-1.5 font-black tracking-tighter text-2xl select-none antialiased">
                    <span class="relative bg-linear-to-r from-yellow-600 via-yellow-400 to-yellow-600 dark:from-yellow-400 dark:via-yellow-200 dark:to-yellow-500 bg-clip-text text-transparent transition-all duration-300 group-hover:drop-shadow-sm">
                        PYRAMID
                    </span>
                    <span class="bg-accent text-slate-950 px-1.5 py-0.5 rounded-sm text-[10px] font-black shadow-sm transition-all duration-300 ease-out uppercase leading-none group-hover:shadow-glow group-hover:-translate-y-1">
                        EGY
                    </span>
                </h1>
            </router-link>
        </div>

        <!-- صندوق البحث العصري -->
        <div class="relative w-full max-w-md hidden sm:block">
            <SearchMedia />
        </div>

        <!-- معلومات التفاعل وتسجيل الخروج -->
        <div class="flex items-center gap-3 md:gap-fluid-gap group">

            <!-- زر التبديل (سويتش) -->
            <button class="btn-icon" @click="toggleTheme" :title="isDark ? 'الوضع المضيء' : 'الوضع الليلي'">
                <Sun v-if="isDark" class="size-5 text-accent" />
                <Moon v-else class="size-5" />
            </button>

            <!-- زر تسجيل خروج -->
            <!-- تم استخدام كلاس btn-danger الذي يحتوي مسبقاً على الألوان المناسبة -->
            <button @click="handleLogoutClick" :disabled="authStore.isLoading" class="flex gap-2 btn-danger hover:bg-danger/70  group-hover:-translate-y-0.5">
                <LogOut class="size-4 md:size-5 " />
                <!-- إخفاء النص في الشاشات الصغيرة جداً وترك الأيقونة فقط للحفاظ على المساحة -->
                <span class="text-fluid-xs hidden xs:inline-block hover:text-on-dark">
                    {{ authStore.isLoading ? 'جاري الخروج...' : 'تسجيل الخروج' }}
                </span>
            </button>
        </div>
    </header>
</template>
