<script setup>
import { House, Video, ChartBarStacked, Download, PanelLeftClose } from '@lucide/vue'
import { useNotificationStore } from '../../stores/notificationStore'

const notiStore = useNotificationStore()
</script>
<template>
    <aside v-if="notiStore.isShowSideBar"
        class="bg-sidebar w-64 h-full p-4 flex flex-col gap-1.5 select-none fixed inset-y-0 start-0 z-50 md:static border-e border-sidebar-line"
        :class="{ 'hidden md:flex': !notiStore.isShowSideBar }"
    >
        <div class="flex justify-between px-3 py-2 mb-2">
            <button class="btn-icon md:hidden" @click="notiStore.openSide">
                <PanelLeftClose class="size-5 text-sub hover:text-accent" />
            </button>
            <span class="self-center text-accent text-fluid-xs font-bold tracking-widest uppercase block opacity-80">
                القائمة الرئيسية
            </span>
        </div>

        <!-- الرئيسية -->
        <router-link :to="{ name: 'dashboard' }" class="sidebar-link" exact-active-class="sidebar-link-active">
            <House class="size-5" />
            <span class="text-fluid-sm">الرئيسية</span>
        </router-link>

        <!-- الأعمال -->
        <router-link :to="{ name: 'mediaList' }" class="sidebar-link" exact-active-class="sidebar-link-active">
            <Video class="size-5" />
            <span class="text-fluid-sm">الأعمال</span>
        </router-link>

        <!-- التصنيفات -->
        <router-link :to="{ name: 'genresList' }" class="sidebar-link" exact-active-class="sidebar-link-active">
            <ChartBarStacked class="size-5" />
            <span class="text-fluid-sm">التصنيفات</span>
        </router-link>

        <!-- مهام التحميل -->
        <router-link :to="{ name: 'tasksList' }" class="sidebar-link" exact-active-class="sidebar-link-active">
            <Download class="size-5" />
            <span class="text-fluid-sm">مهام التحميل</span>
        </router-link>
    </aside>
</template>
