<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import { formatDate } from '@/utils/global'

import AppPagination from '@/components/utils/AppPagination.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const analyticsStore = useAnalyticsStore()
const { mediasNotReadyList, pagination, isLoading } = storeToRefs(analyticsStore)

const handlePageChange = async (newPage) => {
  await analyticsStore.fetchNotReadyMedias(newPage)
}
</script>

<template>
  <div class="space-y-4">
    <!-- الجدول -->
    <div class="overflow-x-auto rounded-2xl border border-line bg-card shadow-soft">
      <table class="w-full text-fluid-xs text-right">
        <thead class="text-sub bg-background/35 p-fluid border-b border-line">
          <tr>
            <th class="p-fluid whitespace-nowrap text-center">{{ t('notReady.table.poster') }}</th>
            <th class="p-fluid whitespace-nowrap text-center">{{ t('notReady.table.titleYear') }}</th>
            <th class="p-fluid whitespace-nowrap text-center">{{ t('notReady.table.typeGenre') }}</th>
            <th class="p-fluid whitespace-nowrap text-center">{{ t('notReady.table.tmdb') }}</th>
            <th class="p-fluid whitespace-nowrap text-center">{{ t('notReady.table.addedAt') }}</th>
            <th class="p-fluid whitespace-nowrap text-center">{{ t('notReady.table.status') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr
            v-for="item in mediasNotReadyList"
            :key="item.id"
            @click="router.push(`/media/${item.id}/details`)"
            class="hover:bg-card-hover/10 transition-colors cursor-pointer"
          >
            <!-- صورة البوستر -->
            <td class="p-fluid">
              <img
                v-if="item.poster_url"
                :src="item.poster_url"
                :alt="item.title"
                class="w-10 h-14 object-cover rounded-xl border border-line shadow-soft"
              />
              <div
                v-else
                class="w-10 h-14 bg-line/20 rounded-xl border border-line flex items-center justify-center text-[10px] text-sub text-center leading-tight"
              >
                {{ t('notReady.noImage') }}
              </div>
            </td>

            <!-- الاسم والسنة -->
            <td class="p-fluid whitespace-nowrap">
              <div class="font-boldcapitalize text-center">{{ item.title }}</div>
              <div class="text-sub text-center" v-if="item.year">{{ item.year }}</div>
            </td>

            <!-- النوع والتصنيفات -->
            <td class="p-fluid text-sub text-center">
              <span
                :class="
                  item.media_type === 'series'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'bg-warning/10 text-warning border-warning/20'
                "
                class="px-2 py-0.5 rounded-lg text-fluid-xs font-semibold border inline-block whitespace-nowrap mb-1"
              >
                {{ item.media_type === 'series' ? t('notReady.series') : t('notReady.movie') }}
              </span>
              <div class="text-sub/70 truncate max-w-[180px] text-center" v-if="item.labels">
                {{ item.labels }}
              </div>
            </td>

            <!-- TMDB ID -->
            <td class="p-fluid font-mono text-sub whitespace-nowrap text-center">
              #{{ item.tmdb_id || item.id }}
            </td>

            <!-- تاريخ الإضافة -->
            <td class="p-fluid text-sub whitespace-nowrap text-center">
              {{ formatDate(item.created_at) }}
            </td>

            <!-- الحالة -->
            <td class="p-fluid whitespace-nowrap">
              <span
                class="px-2.5 py-1 rounded-full text-fluid-xs text-center font-semibold bg-warning/10 text-warning border border-warning/20 inline-block"
              >
                {{ t('notReady.notReadyBadge') }}
              </span>
            </td>
          </tr>

          <tr v-if="!mediasNotReadyList.length && !isLoading">
            <td colspan="6" class="text-center py-8 text-sub italic">{{ t('notReady.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- مكون البجنيشن -->
    <AppPagination
      :pagination="pagination"
      :is-loading="isLoading"
      @change-page="handlePageChange"
    />
  </div>
</template>
