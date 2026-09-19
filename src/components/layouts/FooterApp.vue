<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <footer class="py-4 mt-auto bg-card border-t border-line text-center select-none">
    <p class="text-fluid-xs font-semibold text-sub tracking-wider uppercase">
      © 2026 {{ t('footer.crafted') }} <span class="text-danger animate-pulse">❤</span> by Es
    </p>
  </footer>
</template>
