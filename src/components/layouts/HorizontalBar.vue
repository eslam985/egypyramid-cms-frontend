<script setup>
import { House, Video, ChartBarStacked, Download, Settings } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const handleGotoMediaList = () => {
  if (route.name !== 'mediaList') {
    router.push({
      name: 'mediaList',
      query: {
        ...route.query,
        page: 1,
        limit: 20,
      }
    })
  }
}

const handleGotoTasksPage = () => {
  if (route.name !== 'tasksList') {
    router.push({
      name: 'tasksList',
      query: {
        ...route.query,
        page: 1,
        limit: 20,
      }
    })
  }
}
</script>

<template>
  <nav class="flex justify-center mb-4 w-full">
    <div
      class="flex flex-nowrap items-center gap-2 md:gap-fluid-gap p-fluid md:px-6 bg-card border border-line rounded-b-lg shadow-soft overflow-x-auto max-w-full no-scrollbar">
      <!-- الرئيسية -->
      <router-link :to="{ name: 'dashboard' }"
        exact-active-class="btn-outline shadow-glow/30 text-accent hover:text-slate-900 hover:bg-accent/70"
        class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
        <House class="size-4 shrink-0" />
        <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.dashboard') }}</span>
      </router-link>

      <!-- الأعمال -->
      <div @click="handleGotoMediaList"
        exact-active-class="btn-outline shadow-glow/30 text-accent hover:text-slate-900 hover:bg-accent/70"
        class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
        <Video class="size-4 shrink-0" />
        <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.media') }}</span>
      </div>

      <!-- التصنيفات -->
      <router-link :to="{ name: 'genresList' }"
        exact-active-class="btn-outline shadow-glow/30 text-accent hover:text-slate-900 hover:bg-accent/70"
        class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
        <ChartBarStacked class="size-4 shrink-0" />
        <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.genres') }}</span>
      </router-link>

      <!-- مهام التحميل -->
      <div @click="handleGotoTasksPage"
        exact-active-class="cursor-pointer btn-outline shadow-glow/30 text-accent hover:text-slate-900 hover:bg-accent/70"
        class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
        <Download class="size-4 shrink-0" />
        <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.tasks') }}</span>
      </div>

      <!-- الإعدادات -->
      <router-link :to="{ name: 'settings' }"
        exact-active-class="btn-outline shadow-glow/30 text-accent hover:text-slate-900 hover:bg-accent/70"
        class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
        <Settings class="size-4 shrink-0" />
        <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.settings') }}</span>
      </router-link>
    </div>
  </nav>
</template>
