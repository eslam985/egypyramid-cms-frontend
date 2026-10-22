<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import NotificationApp from '@/components/utils/notificationApp.vue'
import HorizontalBar from '@/components/layouts/HorizontalBar.vue'
import Sidebar from '@/components/layouts/SidebarApp.vue'
import Header from '@/components/layouts/HeaderApp.vue'
import Footer from '@/components/layouts/FooterApp.vue'

import { useNotificationStore } from '@/stores/notificationStore'

const notiStore = useNotificationStore()

// متغيرات للتحكم في ظهور وإخفاء الهيدر
const isHeaderVisible = ref(true)
const mainElement = ref<HTMLElement | null>(null)
let lastScrollTop: number = 0

// دالة حساب اتجاه السكرول داخل عنصر main
const handleScroll = () => {
    if (!mainElement.value) return

    const currentScrollTop: number = mainElement.value.scrollTop

    // إذا كان السكرول لأسفل وتجاوز مسافة معينة (مثلاً 50 بكسل لمنع الحركات المفاجئة)
    if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        isHeaderVisible.value = false // إخفاء
    } else {
        isHeaderVisible.value = true // إظهار
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop
}

onMounted(() => {
    // ربط مستمع الأحداث بعنصر الـ main المسؤول عن السكرول
    if (mainElement.value) {
        mainElement.value.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    // تنظيف مستمع الأحداث عند الخروج من الصفحة
    if (mainElement.value) {
        mainElement.value.removeEventListener('scroll', handleScroll)
    }
})
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-transparent relative">

        <!-- Overlay Backdrop مع بلور للموبايل فقط -->
        <div v-if="notiStore.isShowSideBar" @click="notiStore.openSide()"
            class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300"></div>

        <!-- السايد بار -->
        <Sidebar />

        <!-- الجزء الأيمن (تم إضافة relative هنا) -->
        <div class="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">

            <!-- 1. تعديل الكلاسات هنا إلى absolute و top-0 لتخرج الحاوية من حسابات مساحة الهيكل (Layout) -->
            <div
                class="absolute top-0 left-0 w-full transition-all duration-300 ease-in-out z-20"
                :class="isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'"
            >
                <Header />
                <HorizontalBar />
            </div>

            <!-- 2. منطقة السكرول الرئيسية -->
            <!-- تم إضافة كلاسات التحريك (transition-all) لمساحة الحشو العلوية (pt) -->
            <main
                ref="mainElement"
                class="flex-1 overflow-y-auto flex flex-col justify-between gap-fluid-gap mx-auto w-full min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out"
                :class="isHeaderVisible ? 'pt-[110px]' : 'pt-0'"
            >
                <!-- 3. صفحة البيانات الخارجية -->
                <div class="flex-1 flex flex-col px-fluid">
                    <router-view />
                </div>

                <!-- الفوتر ملتصق بالقاع دائماً -->
                <Footer />

            </main>

        </div>

        <NotificationApp />
    </div>
</template>
