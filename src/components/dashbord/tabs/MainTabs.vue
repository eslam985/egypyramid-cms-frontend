<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent } from 'vue'
import { CircleOff, BoneFracture, Lock, FileX } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// تحميل التابات بشكل ذكي وخفيف (Lazy Loading)
const BrokenLinksTable = defineAsyncComponent(
  () => import('@/components/dashbord/tabs/BrokenLinksTable.vue'),
)
const MissingEpisodesTable = defineAsyncComponent(
  () => import('@/components/dashbord/tabs/MissingEpisodesTable.vue'),
)
const NotReadyMediasTable = defineAsyncComponent(
  () => import('@/components/dashbord/tabs/NotReadyMediasTable.vue'),
)
const TelegramLockedTable = defineAsyncComponent(
  () => import('@/components/dashbord/tabs/TelegramLockedTable.vue'),
)

import { useAnalyticsStore } from '@/stores/analyticsStore'

const analyticsStore = useAnalyticsStore()
const { mediasNotReadyList, brokenLinksList, telegramLocked, missingLinksByServer } =
  storeToRefs(analyticsStore)

// 1. جعل التبويب الافتراضي فارغاً عند البداية
const activeTab = ref(null)

// 2. جلب بيانات التبويب فقط لحظة الضغط عليه
const switchTab = async (tab) => {
  activeTab.value = tab

  if (tab === 'notReady' && !mediasNotReadyList.value.length) {
    await analyticsStore.fetchNotReadyMedias()
  } else if (tab === 'broken' && !brokenLinksList.value.length) {
    await analyticsStore.fetchBrokenLinks()
  } else if (tab === 'telegram' && !telegramLocked.value.length) {
    await analyticsStore.fetchLockedTelegramLinks()
  } else if (tab === 'missing') {
    // الكومبوننت سيقوم بالجلب بنفسه مع تحديد السيرفر
  }
}
</script>
<template>
  <div class="rounded-2xl mb-6 md:p-fluid space-y-4 shadow-soft">
    <!-- أزرار التبويبات -->
    <div class="grid grid-cols-2 md:flex items-center gap-4 py-fluid">
      <!-- الأعمال غير الجاهزة -->
      <button
        @click="switchTab('notReady')"
        class="flex items-center gap-2 py-fluid md:px-4 rounded-xl text-fluid-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 select-none"
        :class="
          activeTab === 'notReady'
            ? 'bg-danger! text-white! shadow-soft hover:brightness-110'
            : 'bg-line/20 border border-line text-sub hover:text-main hover:bg-line/40'
        "
      >
        <span>{{ t('dashboard.tabs.notReady', { count: mediasNotReadyList.length }) }}</span>
        <CircleOff class="size-4 shrink-0" />
      </button>

      <!-- الروابط المكسورة -->
      <button
        @click="switchTab('broken')"
        class="flex items-center gap-2 py-fluid md:px-4 rounded-xl text-fluid-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 select-none"
        :class="
          activeTab === 'broken'
            ? 'bg-danger! text-white! shadow-soft hover:brightness-110'
            : 'bg-line/20 border border-line text-sub hover:text-main hover:bg-line/40'
        "
      >
        <span>{{ t('dashboard.tabs.broken', { count: brokenLinksList.length }) }}</span>
        <BoneFracture class="size-4 shrink-0" />
      </button>

      <!-- روابط تليجرام المقفولة -->
      <button
        @click="switchTab('telegram')"
        class="flex items-center gap-2 py-fluid md:px-4 rounded-xl text-fluid-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 select-none"
        :class="
          activeTab === 'telegram'
            ? 'bg-danger! text-white! shadow-soft hover:brightness-110'
            : 'bg-line/20 border border-line text-sub hover:text-main hover:bg-line/40'
        "
      >
        <span>{{ t('dashboard.tabs.telegram', { count: telegramLocked.length }) }}</span>
        <Lock class="size-4 shrink-0" />
      </button>

      <!-- الحلقات المفقودة -->
      <button
        @click="switchTab('missing')"
        class="flex items-center gap-2 py-fluid md:px-4 rounded-xl text-fluid-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 select-none"
        :class="
          activeTab === 'missing'
            ? 'bg-danger! text-white! shadow-soft hover:brightness-110'
            : 'bg-line/20 border border-line text-sub hover:text-main hover:bg-line/40'
        "
      >
        <span>{{ t('dashboard.tabs.missing', { count: missingLinksByServer.length }) }}</span>
        <FileX class="size-4 shrink-0" />
      </button>
    </div>

    <!-- عرض الجدول المناسب -->
    <div class="overflow-x-auto">
      <NotReadyMediasTable v-if="activeTab === 'notReady'" />
      <BrokenLinksTable v-if="activeTab === 'broken'" />
      <TelegramLockedTable v-if="activeTab === 'telegram'" />
      <MissingEpisodesTable v-if="activeTab === 'missing'" />
    </div>
  </div>
</template>
