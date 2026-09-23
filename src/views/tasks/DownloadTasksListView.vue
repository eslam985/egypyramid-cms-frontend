<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'

import { useTaskStore } from '@/stores/taskStore'
import HeaderTask from '@/components/tasks/HeaderTask.vue'
import MainTask from '@/components/tasks/MainTask.vue'
import AppPagination from '@/components/utils/AppPagination.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

// دالة موحدة تقرأ الرابط الحالي (مهما كان فيه) وتجلب البيانات على أساسه
const loadData = async () => {
  // تمرير route.query مباشرة للـ Store، و true لجلب الداتا من السيرفر فوراً
  await taskStore.fetchAllTasks(route.query, true)
}

// 1. جلب البيانات عند فتح الصفحة بناءً على الموجود في الرابط
onMounted(() => {
  if (route.name === 'tasksList') {
    loadData()
  }
})

// 2. مراقبة أي تغيير في الرابط (تغيير فلتر، بحث، أو صفحة) لجلب البيانات أوتوماتيكياً
watch(
  () => route.query,
  () => {
    if (route.name === 'tasksList') {
      loadData()
    }
  }
)

// 3. تعديل الباجنيشن ليقوم بتحديث الرابط بدلاً من استدعاء الـ API مباشرة
const handlePageChange = async (newPage) => {
  await router.push({
    query: {
      ...route.query, // نحتفظ بالفلاتر الموجودة حالياً (status, search)
      page: newPage   // نحدث رقم الصفحة فقط
    }
  })
}
</script>

<template>
  <main>
    <div v-if="route.name === 'tasksList'">
      <HeaderTask />

      <MainTask />

      <AppPagination
        :pagination="taskStore.pagination"
        :is-loading="taskStore.isLoading"
        @change-page="handlePageChange" />
    </div>
  </main>
</template>
