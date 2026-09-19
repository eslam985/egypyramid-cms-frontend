<script setup>
// vue-dashbord/src/views/tasks/DownloadTasksListView.vue
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

import { useTaskStore } from '@/stores/taskStore'
import HeaderTask from '@/components/tasks/HeaderTask.vue'
import MainTask from '@/components/tasks/MainTask.vue'
import AppPagination from '@/components/utils/AppPagination.vue'

const route = useRoute()
const taskStore = useTaskStore()

// 1. جلب الصفحة الأولى عند فتح المكون
onMounted(async () => {
  await taskStore.fetchAllTasks({ page: 1 })
})

// 2. تعريف دالة التنقل بين الصفحات وتمرير true كـ force
const handlePageChange = async (newPage) => {
  await taskStore.fetchAllTasks({ page: newPage }, true)
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
        @change-page="handlePageChange"
      />
    </div>
  </main>
</template>
