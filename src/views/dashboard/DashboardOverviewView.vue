<script setup>
import { onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analyticsStore'

import HeaderDashbord from '@/components/dashbord/HeaderDashbord.vue'
import SystemCounters from '@/components/dashbord/SystemCounters.vue'
import MainTabs from '@/components/dashbord/tabs/MainTabs.vue'

// استيراد مكونات التبويبات الفردية
import ServerStatusCounters from '@/components/dashbord/ServerStatusCounters.vue'

const analyticsStore = useAnalyticsStore()

onMounted(async () => {
  // جلب العدادات فقط عند فتح الصفحة
  await analyticsStore.fetchAllCounters()
})
</script>

<template>
  <!-- حالة جاري التحميل -->
  <div class="space-y-6 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
    <HeaderDashbord />
    <SystemCounters />
    <ServerStatusCounters />
    <MainTabs />
  </div>
</template>
