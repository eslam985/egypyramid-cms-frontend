<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores/taskStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate, confirmAndDelete } from '@/utils/global'
import BaseTable from '@/components/ui/BaseTable.vue'
import { Info, Trash } from '@lucide/vue'

const taskStore = useTaskStore()
const notiStore = useNotificationStore()
const router = useRouter()
const { t } = useI18n()


// التعامل مع حذف تاسك
const handleDelete = (id) => {
  if (!id) {
    notiStore.triggerNotification(t('tasks.noTaskToDelete'))
    return
  }

  confirmAndDelete({
    message: t('tasks.confirmDelete'),
    action: () => taskStore.removeTaskById(id),
    store: taskStore,
    notiStore,
  })
}

// الانتقال لصفحة التعديل
const handleEdit = (id) => {
  router.push(`/edit-task/${id}`)
}

const columns = [
  { label: t('tasks.table.id'), key: 'id' },
  { label: t('tasks.table.taskName'), key: 'task_name' },
  { label: t('tasks.table.status'), key: 'status' },
  { label: t('tasks.table.progress'), key: 'progress_percent' },
  { label: t('tasks.table.systemMessage'), key: 'status_message' },
  { label: t('tasks.table.createdAt'), key: 'created_at' },
  { label: t('tasks.table.actions'), key: 'actions' },
]

// تحديد لون ونظر الشارة حسب الحالة
const getStatusBadge = (status) => {
  switch (status) {
    case 'processing':
      return {
        label: t('tasks.form.statusOptions.processing'),
        class: 'bg-indigo-50 text-indigo-600 border-indigo-200'
      }
    case 'failed':
      return {
        label: t('tasks.form.statusOptions.failed'),
        class: 'bg-rose-50 text-rose-600 border-rose-200'
      }
    case 'completed':
      return {
        label: t('tasks.form.statusOptions.completed'),
        class: 'bg-emerald-50 text-emerald-600 border-emerald-200'
      }
    default:
      return {
        label: t('tasks.form.statusOptions.idle'),
        class: 'bg-amber-50 text-amber-600 border-amber-200'
      }
  }
}

</script>

<template>
  <div>
    <!-- من غير ما تكتب اي header خالص -->
    <BaseTable
      :columns="columns"
      :rows="taskStore.allTasks"
      :isLoading="taskStore.isLoading"
      storeKey="tasks"
      >
      <template #cell-status="{ value }">
        <span class="px-2 py-1 rounded border text-xs" :class="getStatusBadge(value).class">
          {{ getStatusBadge(value).label }}
        </span>
      </template>

      <template #cell-progress_percent="{ value, row }">
        <div class="p-fluid whitespace-nowrap text-center">
          <div class="flex items-center justify-between text-fluid-xs font-bold mb-1">
            <span class="text-main font-mono">{{ value ?? 0 }}%</span>
            <span class="text-sub font-mono">{{ row.download_speed ?? row.speed ?? '0 MB/s' }}</span>
          </div>
          <div class="w-full bg-line/20 rounded-full h-1.5 overflow-hidden">
            <div class="bg-accent h-full transition-all duration-300" :style="{ width: `${value ?? 0}%` }"></div>
          </div>
        </div>
      </template>

      <template #cell-created_at="{ value }">
        {{ formatDate(value) }}
      </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center justify-center gap-fluid-gap">
            <div @click="handleEdit(row.id)"
              class="flex gap-2 px-3 py-1.5 rounded-xl border border-line font-mediumbg-card hover:bg-line/20 transition-all active:scale-95">
              <Info class="self-center text-accent" />
              <span class="self-center"> {{ t('common.edit') }}</span>
            </div>

            <button type="button" @click="handleDelete(row.id)" :disabled="taskStore .isLoading"
              class="flex gap-2 px-3 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
              <Trash class="self-center text-danger" />
              <span class="self-center">{{ t('common.delete') }}</span>
            </button>
          </div>
      </template>
    </BaseTable>
  </div>
</template>
