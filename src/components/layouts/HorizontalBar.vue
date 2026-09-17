<script setup>
import { House, Video, ChartBarStacked, Download } from '@lucide/vue'
</script>

<template>
    <nav class="flex justify-center mb-4">
        <div
            class="flex items-center gap-2 md:gap-fluid-gap p-fluid md:px-6 bg-card border border-line rounded-b-lg shadow-soft overflow-x-auto no-scrollbar max-w-full">

            <!-- الرئيسية -->
            <router-link :to="{ name: 'dashboard' }"
                exact-active-class="bg-accent text-on-accent font-semibold shadow-glow"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-fluid-xs font-medium text-sub hover:bg-card-hover hover:text-accent transition-all duration-200 shrink-0">
                <House class="size-4" />
                <span>الرئيسية</span>
            </router-link>

            <!-- الأعمال -->
            <router-link :to="{ name: 'mediaList' }"
                exact-active-class="bg-accent text-on-accent font-semibold shadow-glow"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-fluid-xs font-medium text-sub hover:bg-card-hover hover:text-accent transition-all duration-200 shrink-0">
                <Video class="size-4" />
                <span>الأعمال</span>
            </router-link>

            <!-- التصنيفات -->
            <router-link :to="{ name: 'genresList' }"
                exact-active-class="bg-accent text-on-accent font-semibold shadow-glow"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-fluid-xs font-medium text-sub hover:bg-card-hover hover:text-accent transition-all duration-200 shrink-0">
                <ChartBarStacked class="size-4" />
                <span>التصنيفات</span>
            </router-link>

            <!-- مهام التحميل -->
            <router-link :to="{ name: 'tasksList' }"
                exact-active-class="bg-accent text-on-accent font-semibold shadow-glow"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-fluid-xs font-medium text-sub hover:bg-card-hover hover:text-accent transition-all duration-200 shrink-0">
                <Download class="size-4" />
                <span>المهام</span>
            </router-link>

        </div>
    </nav>
</template>
