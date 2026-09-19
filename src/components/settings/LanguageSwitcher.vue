<script setup>
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()
const change = (l) => {
  locale.value = l
  localStorage.setItem('lang', l)
  document.documentElement.lang = l
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
}
</script>
<template>
  <div class="card p-4">
    <h3 class="font-bold mb-3">{{ t('settings.language') }}</h3>
    <div class="flex gap-2">
      <button @click="change('ar')" :class="locale === 'ar' ? 'btn-accent' : 'btn-ghost'">
        العربية
      </button>
      <button @click="change('en')" :class="locale === 'en' ? 'btn-accent' : 'btn-ghost'">
        English
      </button>
    </div>
  </div>
</template>
