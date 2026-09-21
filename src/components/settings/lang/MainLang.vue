<script setup>
import { useI18n } from 'vue-i18n'

import LanguageSwitcher from '@/components/settings/lang/LanguageSwitcher.vue';

const { t } = useI18n()



</script>

<template>
  <div class="card p-4 flex justify-between items-center">
    <h3 class="font-bold text-title">
      {{ t('settings.language') }}
    </h3>

    <LanguageSwitcher/>
  </div>
</template>
