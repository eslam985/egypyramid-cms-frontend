<!--/vue-dashbord/src/views/tasks/DownloadTaskFormView.vue -->
<script setup>
import { useRoute } from 'vue-router'

import NotFoundView from '@/views/errors/NotFoundView.vue'
import DownloadTaskModal from '@/components/tasks/DownloadTaskModal.vue'

const route = useRoute()
</script>
<template>
  <main>
    <div>
      <div v-if="route.name === 'addTask' || route.name === 'editTask'">
        <DownloadTaskModal />
      </div>
      <div v-else>
        <NotFoundView />
      </div>
    </div>
  </main>
</template>
