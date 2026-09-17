<script setup>
import Header from '@/components/layouts/HeaderApp.vue'
import Footer from '@/components/layouts/FooterApp.vue'
import Sidebar from '@/components/layouts/SidebarApp.vue'
import HorizontalBar from '@/components/layouts/HorizontalBar.vue'
import NotificationApp from '@/components/utils/notificationApp.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notiStore = useNotificationStore()
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-background relative">
        <!-- Overlay Backdrop مع بلور للموبايل فقط -->
        <div v-if="notiStore.isShowSideBar" @click="notiStore.openSide()"
            class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300"></div>

        <!-- السايد بار -->
        <Sidebar />

        <!-- الجزء الأيمن -->
        <div class="flex-1 flex flex-col min-w-0 h-full">
            <Header />
            <HorizontalBar />

            <main
                class="flex-1 overflow-y-auto flex flex-col gap-fluid px-fluid mx-auto w-full min-w-0 overflow-x-hidden">
                <router-view />
            </main>

            <Footer />
        </div>

        <NotificationApp />
    </div>
</template>
