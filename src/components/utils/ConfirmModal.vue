<template>
  <!-- طبقة التعتيم الخلفية مع حدث النقر للإلغاء -->
  <div
    v-if="notiStore.confirmModal.show"
    @click.self="notiStore.handleConfirmResult(false)"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in cursor-pointer"
  >
    <!-- كارت التأكيد -->
    <div
      class="card p-fluid-section w-full max-w-md shadow-soft border border-line transform transition-all animate-fade-in-up cursor-default"
    >
      <!-- محتوى الهيدر / الأيقونة -->
      <div class="flex items-start gap-4 mb-4">
        <div
          class="size-12 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger shrink-0"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div class="space-y-1">
          <h3 class="text-fluid-h3 font-bold text-title">{{ t('confirmModal.title') }}</h3>
          <p class="text-sub text-fluid-p leading-relaxed">{{ notiStore.confirmModal.message }}</p>
          </div>
          </div>

          <!-- شريط الأزرار -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-line mt-6">
          <button type="button" @click="notiStore.handleConfirmResult(false)" class="btn-secondary">
          {{ t('confirmModal.cancel') }}
          </button>

          <button type="button" @click="notiStore.handleConfirmResult(true)" class="btn-danger">
          {{ t('confirmModal.confirm') }}
          </button>
          </div>
          </div>
          </div>
          </template>

          <script setup>
          import { useI18n } from 'vue-i18n'
          import { useNotificationStore } from '@/stores/notificationStore'

          const { t } = useI18n()
          const notiStore = useNotificationStore()
          </script>
