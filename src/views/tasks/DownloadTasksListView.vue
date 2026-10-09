<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import HeaderTask from '@/components/tasks/HeaderTask.vue'
import MainTask from '@/components/tasks/MainTask.vue'
import AppPagination from '@/components/utils/AppPagination.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

// دالة موحدة تقرأ الرابط الحالي (مهما كان فيه) وتجلب البيانات على أساسه
const loadData = async () => {
    // 💡 بنمرر الفلاتر اللي موجودة في الرابط فعلياً للسيرفر مع force = true لإجبار التحديث
    await taskStore.fetchAllTasks(route.query)
}

// 1️⃣ استدعاء مباشر عند دخول الصفحة أو عند عمل ريلود
// السيرفر هنا هيجيب الداتا بناءً على الرابط بالظبط: لو الرابط فيه فلتر هيجيب فلتر، لو فاضي هيجيب كله
loadData()

// 2️⃣ تعديل الباجنيشن ليقوم بتحديث الرابط فقط
const handlePageChange = async (newPage) => {
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
