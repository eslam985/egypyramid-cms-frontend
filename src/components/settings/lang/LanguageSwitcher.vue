<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const change = (l) => {
  locale.value = l
  localStorage.setItem('lang', l)
  document.documentElement.lang = l
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
}

const isArabic = computed(() => locale.value === 'ar')
const toggleLang = () => {
  change(isArabic.value ? 'en' : 'ar')
}

</script>

<template>
    <div class="flex items-center gap-2">
      <span class="text-fluid-xs font-bold" :class="isArabic ? 'text-title' : 'text-muted'">AR</span>

      <!-- نفس المستطيل والكورة -->
      <button
        dir="ltr"
        type="button"
        role="switch"
        :aria-checked="isArabic"
        class="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border px-1 transition-colors duration-300"
        :class="isArabic ? 'bg-accent border-accent' : 'bg-line border-line'"
        @click="toggleLang"
      >
        <span
          class="inline-block h-6 w-6 transform rounded-full bg-card shadow-soft transition-transform duration-300"
          :class="isArabic ? 'translate-x-0' : 'translate-x-6'"
        />
      </button>

      <span class="text-fluid-xs font-bold" :class="!isArabic ? 'text-title' : 'text-muted'">EN</span>
    </div>
</template>
