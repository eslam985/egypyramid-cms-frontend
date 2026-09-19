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
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = document.documentElement.classList.contains('dark')
  }
})
</script>

<template>
  <div class="card p-4 flex justify-between items-center">
    <h3 class="font-bold text-title">
      {{ t('settings.appearance') }}
    </h3>

    <button
      type="button"
      dir="ltr"
      role="switch"
      :aria-checked="isDark"
      class="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border px-1 transition-colors duration-300"
      :class="isDark ? 'bg-accent border-accent' : 'bg-line border-line'"
      @click="toggle"
    >
      <span
        class="inline-block h-6 w-6 transform rounded-full bg-card shadow-soft transition-transform duration-300"
        :class="isDark ? 'translate-x-6' : 'translate-x-0'"
      />
    </button>
  </div>
</template>
