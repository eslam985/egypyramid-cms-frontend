<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import MainLang from '@/components/settings/lang/MainLang.vue'
import MainTheme from '@/components/settings/theme/MainTheme.vue'

import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'



const { t } = useI18n()
const authStore = useAuthStore()
const notiStore = useNotificationStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logoutUser()
  notiStore.triggerNotification(t('auth.logoutSuccess'))
  router.push('/login')
}
</script>
<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-black">{{ t('settings.title') }}</h1>
    <MainLang />
    <MainTheme />
    <div class="card p-4">
      <button @click="handleLogout" class="btn-danger w-full">{{ t('auth.logout') }}</button>
    </div>
  </div>
</template>
