<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import HeaderTask from '@/components/tasks/HeaderTask.vue'
import MainTask from '@/components/tasks/MainTask.vue'
import AppPagination from '@/components/utils/AppPagination.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const loadData = async (): Promise<void> => {
    await taskStore.fetchAllTasks(route.query)
}
loadData()

const handlePageChange = async (newPage: number): Promise<void> => {
    await router.push({
        query: {
            ...route.query,
            page: newPage,
        },
    })
    // بعد ما الرابط يتحدث، بننادي الدالة تجيب بيانات الصفحة الجديدة
    loadData()
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
