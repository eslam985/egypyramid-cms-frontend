<script setup lang="ts">
import Header from '@/components/layouts/HeaderApp.vue'
import Footer from '@/components/layouts/FooterApp.vue'
import Sidebar from '@/components/layouts/SidebarApp.vue'
import HorizontalBar from '@/components/layouts/HorizontalBar.vue'
import NotificationApp from '@/components/utils/notificationApp.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notiStore = useNotificationStore()
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-transparent relative">

        <!-- Overlay Backdrop مع بلور للموبايل فقط -->
        <div v-if="notiStore.isShowSideBar" @click="notiStore.openSide()"
            class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300"></div>

        <!-- السايد بار -->
        <Sidebar />

        <!-- الجزء الأيمن -->
        <div class="flex-1 flex flex-col min-w-0 h-full">

            <!-- الهيدر والبار الأفقي ثابتين في الأعلى -->
            <Header />
            <HorizontalBar />
            <!-- 1. تم حذف min-h-screen وإضافة justify-between لرمي الفوتر في الأسفل دائماً -->
            <main
                class="flex-1 overflow-y-auto flex flex-col justify-between gap-fluid-gap mx-auto w-full min-w-0 overflow-x-hidden">

                <!-- 2. تم إضافة flex-1 و flex flex-col هنا لتأخذ صفحة البيانات كامل المساحة المتاحة وتدفع الفوتر للأسفل -->
                <div class="flex-1 flex flex-col px-fluid">
                    <router-view />
                </div>

                <!-- الآن الفوتر ملتصق بالقاع تماماً وشكله متناسق بعرض الشاشة -->
                <Footer />

            </main>

        </div>

        <NotificationApp />
    </div>
</template>
