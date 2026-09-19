<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>
<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-fluid-p">
    <div class="max-w-md w-full bg-card-bg border border-custom-border rounded-2xl p-8 text-center shadow-sm">
      <span class="text-fluid-h1 font-black text-accent block mb-2">404</span>
      <h1 class="text-fluid-h2 font-bold text-title mb-3">{{ t('notFound.title') }}</h1>
      <p class="text-sub text-fluid-p mb-8">
        {{ t('notFound.message') }}
      </p>
      <button @click="goHome" class="btn-primary w-full">{{ t('notFound.backHome') }}</button>
    </div>
  </div>
</template>
