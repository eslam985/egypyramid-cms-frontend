<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
    default: () => ({
      total: 0,
      page: 1,
      limit: 20,
      totalPage: 0,
    }),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change-page'])

const currentPage = computed(() => props.pagination?.page || 1)
const totalPages = computed(() => props.pagination?.totalPage || 1)
const totalItems = computed(() => props.pagination?.total || 0)

// تغيير الصفحة
const goToPage = (newPage) => {
  if (
    newPage < 1 ||
    newPage > totalPages.value ||
    newPage === currentPage.value ||
    props.isLoading
  ) {
    return
  }
  emit('change-page', newPage)
}

// توليد أرقام الصفحات المعروضة بشكل ذكي (مع ... للصفحات الكثيرة)
// تعريف خاصية محسوبة (computed) تُعيد مصفوفة الأرقام والنقاط الواجب عرضها في الواجهة
const visiblePages = computed(() => {
  // استخراج القيمة العددية لإجمالي الصفحات من الـ Ref
  const total = totalPages.value

  // استخراج رقم الصفحة الحالية التي يقف عليها المستخدم الآن
  const current = currentPage.value

  // حالة خاصة: إذا كان إجمالي الصفحات 7 أو أقل، نعرض كل الأرقام بدون أي نقاط (...)
  if (total <= 7) {
    // إنشاء مصفوفة تسلسلية فورية بطول total (مثال: إذا كان total = 5 تُرجع [1, 2, 3, 4, 5])
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // مصفوفة فارغة لتجميع أرقام الصفحات والنقاط بالترتيب الصحيح
  const pages = []

  // إدخال الصفحة الأولى (رقم 1) دائماً كبداية ثابتة
  pages.push(1)

  // إذا كان المستخدم في صفحة أبعد من 3، فهذا يعني وجود أرقام مخفية بين الصفحة 1 والصفحة الحالية، فنضيف نقاط (...)
  if (current > 3) {
    pages.push('...')
  }

  // حساب الحد الأدنى لنطاق الأرقام المحيطة بالصفحة الحالية
  // Math.max تضمن ألا يقل الرقم عن 2 لأن رقم 1 تم إضافته بالفعل في البداية
  const start = Math.max(2, current - 1)

  // حساب الحد الأقصى لنطاق الأرقام المحيطة بالصفحة الحالية
  // Math.min تضمن ألا يتجاوز الرقم (total - 1) لأن الصفحة الأخيرة ستضاف في النهاية
  const end = Math.min(total - 1, current + 1)

  // حلقة تكرارية لجمع الأرقام المجاورة للصفحة الحالية وإضافتها للمصفوفة
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // إذا كانت الصفحة الحالية بعيدة عن النهاية بأكثر من خطوتين، فهذا يعني وجود أرقام مخفية قبل الأخيرة، فنضيف نقاط (...)
  if (current < total - 2) {
    pages.push('...')
  }

  // إدخال رقم الصفحة الأخيرة (total) دائماً كنهاية ثابتة
  pages.push(total)

  // إرجاع المصفوفة المكتملة لتستخدمها Vue في رسم الأزرار عبر v-for
  return pages
})
</script>

<template>
  <div
    v-if="totalPages > 0"
    class="flex flex-col-reverse sm:flex-row items-center justify-between gap-fluid-gap p-section-fluid bg-card-bg border-custom-border text-fluid-xs"
  >
    <!-- تفاصيل عدد البيانات والصفحات -->
    <div class="text-sub font-medium">
      {{ t('pagination.showingPage') }}
      <span class="font-semibold text-title">{{ currentPage }}</span>
      {{ t('pagination.of') }}
      <span class="font-semibold text-title">{{ totalPages }}</span>
      ({{ t('pagination.total') }} <span class="font-semibold text-accent">{{ totalItems }}</span> {{ t('pagination.items') }})
    </div>

    <!-- أزرار التنقل -->
    <div class="flex items-center gap-3 dir-ltr">
      <!-- زر التالي -->
      <button
        type="button"
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages || isLoading"
        class="p-fluid rounded-lg border border-custom-border font-semibold text-sub hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {{ t('pagination.next') }}
      </button>

      <!-- أرقام الصفحات -->
      <!-- استبدل هذا الجزء -->
      <template v-for="(p, index) in visiblePages">
        <span v-if="p === '...'" :key="`dots-${index}`" class="px-2 text-sub select-none">
          ...
        </span>
        <button
          v-else
          :key="p"
          type="button"
          @click="goToPage(p)"
          :disabled="isLoading"
          :class="[
            'px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer',
            currentPage === p
              ? 'bg-accent text-white shadow-sm'
              : 'border border-custom-border text-sub hover:bg-slate-100',
          ]"
        >
          {{ p }}
        </button>
      </template>

      <!-- زر السابق -->
      <button
        type="button"
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1 || isLoading"
        class="p-fluid rounded-lg border border-custom-border font-semibold text-sub hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {{ t('pagination.previous') }}
      </button>
    </div>
  </div>
</template>
