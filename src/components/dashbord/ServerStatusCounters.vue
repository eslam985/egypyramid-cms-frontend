<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const analyticsStore = useAnalyticsStore()
const { totalCountersStatusServeres } = storeToRefs(analyticsStore)

const selectedStatus = ref('broken')

const handleStatusChange = () => {

  analyticsStore.fetchTotalCountersStatusServers(selectedStatus.value, true)

}

onMounted(() => {
  if (analyticsStore.totalCountersStatusServeres.length < 1) {
    handleStatusChange()
  }
})
</script>
<template>
  <div class="mt-8 space-y-4">
    <!-- الهيدر وفلتر الحالة -->
    <div class="flex items-center justify-between gap-2">
      <h3 class="text-fluid-p font-bold text-main">{{ t('dashboard.serverStatus.title') }}</h3>

      <select v-model="selectedStatus" @change="handleStatusChange"
        class="bg-card border border-line rounded-xl p-fluid text-fluid-xs font-mediumfocus:outline-none focus:border-accent cursor-pointer transition-colors">
        <option value="broken">{{ t('dashboard.serverStatus.broken') }}</option>
        <option value="valid">{{ t('dashboard.serverStatus.valid') }}</option>
        <option value="pending">{{ t('dashboard.serverStatus.pending') }}</option>
      </select>
    </div>

    <!-- كروت السيرفرات -->
    <div v-if="totalCountersStatusServeres?.length" class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-fluid-gap">
      <div v-for="(server, index) in totalCountersStatusServeres" :key="index"
        class="bg-card border border-line rounded-2xl p-fluid flex items-center justify-between shadow-soft hover:border-accent/30 transition-all duration-200">
        <div class="">
          <span class="text-sub text-fluid-xs font-medium block uppercase tracking-wider mb-3 md:b-0">{{
            server.server_name }}</span>
          <span class="text-fluid-h3 font-blackmt-1 block">{{ server.total }}</span>
        </div>
        <span class="px-2.5 py-1 mt-3 self-center rounded-full text-fluid-xs font-semibold ltr" :class="{
          'bg-danger/10! text-danger border border-danger/20':
            server.last_check_status === 'broken',
          'bg-success/10 text-success border border-success/20':
            server.last_check_status === 'valid',
          'bg-warning/10 text-warning border border-warning/20':
            server.last_check_status === 'pending',
        }">
          {{ t(`dashboard.serverStatus.status.${server.last_check_status}`) }}
        </span>
      </div>
    </div>

    <!-- حالة عدم وجود بيانات -->
    <div v-else class="text-center py-8 text-sub text-fluid-xs bg-card border border-line rounded-2xl shadow-soft">
      {{ t('dashboard.serverStatus.noData') }}
    </div>
  </div>
</template>
