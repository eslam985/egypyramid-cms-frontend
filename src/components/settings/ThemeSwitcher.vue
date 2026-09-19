<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const isDark = ref(false)
const toggle = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  // متطبقش تاني هنا App.vue طبقه خلاص، ده بس عشان الزرار يبقى مظبوط
})
</script>
<template>
  <div class="card p-4 flex justify-between items-center">
    <h3 class="font-bold">{{ t('settings.appearance') }}</h3>
    <button @click="toggle" class="btn-ghost">
      {{ isDark ? t('header.lightMode') : t('header.darkMode') }}
    </button>
  </div>
</template>
