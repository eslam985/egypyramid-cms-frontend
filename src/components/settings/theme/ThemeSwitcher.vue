<script setup>
import { ref, onMounted } from 'vue'

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
</template>
