<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import NotificationApp from '@/components/utils/notificationApp.vue'
import HorizontalBar from '@/components/layouts/HorizontalBar.vue'
import Sidebar from '@/components/layouts/SidebarApp.vue'
import Header from '@/components/layouts/HeaderApp.vue'
import Footer from '@/components/layouts/FooterApp.vue'

import { useNotificationStore } from '@/stores/notificationStore'

const notiStore = useNotificationStore()

const isHeaderVisible = ref(true)
const mainElement = ref<HTMLElement | null>(null)
let lastScrollTop: number = 0

const handleScroll = () => {
    if (!mainElement.value) return

    const currentScrollTop: number = mainElement.value.scrollTop
    const maxScroll = mainElement.value.scrollHeight - mainElement.value.clientHeight

    // 💡 شرط حاسم: إذا وصلنا لآخر الصفحة تماماً (الفوتر)، امنع إخفاء الهيدر لمنع الارتداد
    if (currentScrollTop >= maxScroll - 20) {
        isHeaderVisible.value = false
        return
    }

    if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        isHeaderVisible.value = false
    } else {
        isHeaderVisible.value = true
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop
}

onMounted(() => {
    if (mainElement.value) {
        mainElement.value.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    if (mainElement.value) {
        mainElement.value.removeEventListener('scroll', handleScroll)
    }
})
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-transparent relative">


        <div v-if="notiStore.isShowSideBar" @click="notiStore.openSide()"
            class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300"></div>

        <Sidebar />

        <div class="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">

            <div class="absolute top-0 left-0 w-full transition-all duration-300 ease-in-out z-20"
                :class="isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'">
                <Header />
                <HorizontalBar />
            </div>
            <main ref="mainElement" class="flex-1 overflow-y-auto flex flex-col justify-between gap-fluid-gap mx-auto w-full min-w-0 overflow-x-hidden transition-all
                duration-300 ease-in-out" :class="isHeaderVisible ? 'pt-[130px]' : 'pt-0'">

                <div class="flex-1 flex flex-col px-fluid">
                    <router-view />
                </div>

                <Footer />

            </main>

        </div>

        <NotificationApp />
    </div>
</template>
