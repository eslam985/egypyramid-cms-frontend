<script setup>
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Download, Loader } from '@lucide/vue'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/utils/global'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const notiStore = useNotificationStore()
const analyticsStore = useAnalyticsStore()
const { telegramLocked, isLoading } = storeToRefs(analyticsStore)


const handleExport = async () => {
  router.push({
    params: {}
  })
  const isSuccess = await analyticsStore.exportLockedTelegramLinks(route.query)
  if (isSuccess) {
    notiStore.triggerNotification(analyticsStore.successMessage || 'تم تحميل البيانات بنجاح!')
  } else {
    notiStore.triggerNotification(analyticsStore.errorMessage || 'حدث خطأ اثناء تحميل البيانات!')
  }
}

const handleRefresh = async () => {
  router.push({
    params: {}
  })
  const data = await analyticsStore.fetchLockedTelegramLinks(true)
  if (data) {
    notiStore.triggerNotification(analyticsStore.successMessage || 'تم تحديث البيانات بنجاح!')

  } else {
    notiStore.triggerNotification(analyticsStore.errorMessage || 'حدث خطأ اثناء تحديث البيانات!')

  }

}

</script>
<template>
  <div class="overflow-x-auto">
    <div
      class="flex justify-between gap-fluid-gap w-full mb-4">
      <!-- 1111 -->
      <!-- refreshData -->
      <button @click="handleRefresh" :disabled="isLoading" type="button"
        class="md:col-span-5 btn-outline gap-1 shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
        <Loader class="size-5 text-accent" :class="{ 'animate-spin': isLoading }" :stroke-width="2" />
        {{ t('common.refreshData') }}
      </button>

      <!-- 2222 -->
      <!-- Export -->
      <div v-if="authStore.isEditorAndAbove"  class="md:col-span-5 self-center flex md:justify-end">
        <button type="button"
          class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
          @click="handleExport">
          <Download class="size-5 text-accent" :stroke-width="2" />
          Export
        </button>
      </div>

    </div>

    <table class="w-full text-fluid-xs text-right card">
      <thead class="text-sub bg-line/20 border-b border-line">
        <tr>
          <th class="p-fluid whitespace-nowrap text-center">{{ t('telegramLocked.table.titleEpisode') }}</th>
          <th class="p-fluid whitespace-nowrap text-center">{{ t('telegramLocked.table.type') }}</th>
          <th class="p-fluid whitespace-nowrap text-center">{{ t('telegramLocked.table.server') }}</th>
          <th class="p-fluid whitespace-nowrap text-center">{{ t('telegramLocked.table.lockedUrl') }}</th>
          <th class="p-fluid whitespace-nowrap text-center">{{ t('telegramLocked.table.workStatus') }}</th>
          <th class="p-fluid whitespace-nowrap text-center">{{ t('telegramLocked.table.addedAt') }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line">
        <tr v-for="item in telegramLocked" :key="item.id" @click="router.push(`/media/${item.media_id}/details`)"
          class="hover:bg-line/10 transition-colors cursor-pointer">
          <!-- اسم العمل ورقم الحلقة -->
          <td class="p-fluid whitespace-nowrap">
            <div class="font-boldmb-0.5">{{ item.title }}</div>
            <div class="text-sub text-fluid-xs">
              <span v-if="item.media_type === 'series' && item.season_number">
                {{ t('telegramLocked.season') }} {{ item.season_number }} -
                {{ t('telegramLocked.episode') }} #{{ item.episode_number }}
              </span>
              <span v-else> {{ t('telegramLocked.customMedia') }} </span>
            </div>
          </td>

          <!-- النوع -->
          <td class="p-fluid whitespace-nowrap">
            <span :class="item.media_type === 'series'
              ? 'bg-accent/10 text-accent border-accent/20'
              : 'bg-warning/10 text-warning border-warning/20'
              " class="px-2.5 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block">
              {{
                item.media_type === 'series'
                  ? t('telegramLocked.series')
                  : t('telegramLocked.movie')
              }}
            </span>
          </td>

          <!-- السيرفر -->
          <td class="p-fluid whitespace-nowrap">
            <span class="bg-line/20border border-line px-2 py-1 rounded-lg font-mono text-fluid-xs">
              {{ item.server_name }}
            </span>
          </td>

          <!-- الرابط المغلَق -->
          <td class="p-fluid whitespace-nowrap">
            <a :href="item.url" target="_blank" dir="ltr" @click.stop
              class="text-link hover:text-link-hover underline underline-offset-2 text-fluid-xs font-mono truncate max-w-xs block">
              {{ item.url }}
            </a>
          </td>

          <!-- حالة العمل -->
          <td class="p-fluid whitespace-nowrap">
            <span v-if="item.is_ready === true"
              class="text-success font-semibold bg-success/10 px-2.5 py-1 rounded-lg border border-success/20 inline-block">
              {{ t('telegramLocked.ready') }}
            </span>
            <span v-else
              class="text-danger font-semibold bg-danger/10 px-2.5 py-1 rounded-lg border border-danger/20 inline-block">
              {{ t('telegramLocked.notReady') }}
            </span>
          </td>

          <!-- تاريخ الإضافة -->
          <td class="p-fluid text-sub whitespace-nowrap">
            {{ formatDate(item.created_at) }}
          </td>
        </tr>
        <tr v-if="!telegramLocked.length && !isLoading">
          <td colspan="6" class="text-center py-8 text-sub italic">
            {{ t('telegramLocked.noData') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
