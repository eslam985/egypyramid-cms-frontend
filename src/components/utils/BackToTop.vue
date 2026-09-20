<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

// التقاط السكرول من المتصفح أو من أي Container داخلي
const checkScroll = (event) => {
  const scrollTop =
    window.scrollY || document.documentElement.scrollTop || event?.target?.scrollTop || 0

  isVisible.value = scrollTop > 300
}

// العودة للأعلى لكل من Window والعناصر الداخلية
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // تحريك العناصر ذات السكرول الداخلي إن وجدت
  document.querySelectorAll('.overflow-y-auto, .overflow-auto, main').forEach((el) => {
    el.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

onMounted(() => {
  // الخيار true في النهاية يضمن التقاط السكرول حتى لو كان داخل div أو main
  window.addEventListener('scroll', checkScroll, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll, true)
})
</script>

<template>
  <Transition name="fade">
    <button
      v-show="isVisible"
      type="button"
      @click="scrollToTop"
      class="btn-scroll-top"
      aria-label="العودة للأعلى"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
