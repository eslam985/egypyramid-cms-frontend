<script setup>
import { useI18n } from 'vue-i18n'

import ThemeSwitcher from '@/components/settings/theme/ThemeSwitcher.vue'

const { t } = useI18n()
</script>

<template>
  <div class="card p-4 flex justify-between items-center">
    <h3 class="font-bold text-title">
      {{ t('settings.appearance') }}
    </h3>

    <ThemeSwitcher />
  </div>
</template>
