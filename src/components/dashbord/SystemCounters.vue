<script setup>
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const analyticsStore = useAnalyticsStore()
const { systemCounters } = storeToRefs(analyticsStore)

const handleGotoFailedTasks = () => {
  if (route.name !== 'tasksList') {
    router.push({
      name: 'tasksList',
      query: {
        ...route.query,
        status: 'failed',
        page: 1
      }
    })
  }
}
const handleGotoProcessingTasks = () => {
  if (route.name !== 'tasksList') {
    router.push({
      name: 'tasksList',
      query: {
        ...route.query,
        status: 'processing',
        page: 1,
        limit: 20,
      }
    })
  }
}
// category, page = 1, limit = 20, search, sortBy, sortOrder
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
  <main class="space-y-6">
    <!-- 1. عدادات النظام (System Counters Cards) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-fluid-gap">
      <!-- إجمالي الأعمال -->
      <div @click="handleGotoMediaList"
        class="cursor-pointer bg-card border border-line rounded-2xl p-fluid flex flex-col justify-between shadow-soft hover:border-accent/50 hover:shadow-glow transition-all duration-200 group">
        <span class="text-sub text-fluid-xs font-medium group-hover:text-main">{{
          t('dashboard.counters.totalMedias')
        }}</span>
        <span class="font-blacktext-fluid-h3 mt-3">{{
          systemCounters.total_medias ?? 0
        }}</span>
      </div>

      <!-- إجمالي الحلقات -->
      <div class="bg-card border border-line rounded-2xl p-fluid flex flex-col justify-between shadow-soft">
        <span class="text-sub text-fluid-xs font-medium">{{
          t('dashboard.counters.totalEpisodes')
        }}</span>
        <span class="font-blacktext-fluid-h3 mt-3">{{
          systemCounters.total_episodes ?? 0
        }}</span>
      </div>

      <!-- إجمالي الروابط -->
      <div class="bg-card border border-line rounded-2xl p-fluid flex flex-col justify-between shadow-soft">
        <span class="text-sub text-fluid-xs font-medium">{{
          t('dashboard.counters.totalLinks')
        }}</span>
        <span class="font-blacktext-fluid-h3 mt-3">{{
          systemCounters.total_links ?? 0
        }}</span>
      </div>

      <!-- الروابط المكسورة -->
      <div class="bg-card border border-line rounded-2xl p-fluid flex flex-col justify-between shadow-soft">
        <span class="text-sub text-fluid-xs font-medium whitespace-nowrap">{{
          t('dashboard.counters.brokenLinks')
        }}</span>
        <span class="font-black text-danger text-fluid-h3 mt-3">{{
          systemCounters.count_broken_links ?? 0
        }}</span>
      </div>

      <!-- الروابط السليمة -->
      <div class="bg-card border border-line rounded-2xl p-fluid flex flex-col justify-between shadow-soft">
        <span class="text-sub text-fluid-xs font-medium whitespace-nowrap">{{
          t('dashboard.counters.validLinks')
        }}</span>
        <span class="font-black text-success text-fluid-h3 mt-3">{{
          systemCounters.count_valid_links ?? 0
        }}</span>
      </div>

      <!-- إجمالي المهام -->
      <div @click="handleGotoTasksPage"
        class="cursor-pointer bg-card border border-line rounded-2xl p-fluid flex flex-col justify-between shadow-soft hover:border-accent/50 hover:shadow-glow transition-all duration-200 group">
        <span class="text-sub text-fluid-xs font-medium group-hover:text-main">{{
          t('dashboard.counters.totalTasks')
        }}</span>
        <span class="font-blacktext-fluid-h3 mt-3">{{
          systemCounters.total_tasks ?? 0
        }}</span>
      </div>

      <!-- المهام قيد المعالجة -->
      <div @click="handleGotoProcessingTasks"
        class="cursor-pointer bg-card border border-line rounded-2xl p-fluid flex flex-col justify-between shadow-soft hover:border-accent/50 hover:shadow-glow transition-all duration-200 group">
        <span class="text-sub text-fluid-xs font-medium whitespace-nowrap">{{
          t('dashboard.counters.processingTasks')
        }}</span>

        <span class="font-black text-accent text-fluid-h3 mt-3">{{
          systemCounters.total_processing ?? 0
        }}</span>
      </div>

      <!-- المهام الفاشلة -->
      <div @click="handleGotoFailedTasks"
        class="cursor-pointer bg-card border border-line rounded-2xl p-fluid flex flex-col justify-between shadow-soft hover:border-accent/50 hover:shadow-glow transition-all duration-200 group">
        <span class="text-sub text-fluid-xs font-medium whitespace-nowrap">{{
          t('dashboard.counters.failedTasks')
        }}</span>
        <span class="font-black text-danger text-fluid-h3 mt-3">{{
          systemCounters.total_failed ?? 0
        }}</span>
      </div>
    </div>
  </main>
</template>
