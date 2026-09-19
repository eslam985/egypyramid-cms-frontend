<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores/taskStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate, confirmAndDelete } from '@/utils/global'

const taskStore = useTaskStore()
const notiStore = useNotificationStore()
const router = useRouter()
const { t } = useI18n()

// تحديد لون ونظر الشارة حسب الحالة
const getStatusBadge = (status) => {
  switch (status) {
    case 'processing':
      return { label: t('tasks.form.statusOptions.processing'), class: 'bg-indigo-50 text-indigo-600 border-indigo-200' }
    case 'failed':
      return { label: t('tasks.form.statusOptions.failed'), class: 'bg-rose-50 text-rose-600 border-rose-200' }
    case 'completed':
      return { label: t('tasks.form.statusOptions.completed'), class: 'bg-emerald-50 text-emerald-600 border-emerald-200' }
    default:
      return { label: t('tasks.form.statusOptions.idle'), class: 'bg-amber-50 text-amber-600 border-amber-200' }
  }
}

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
</script>

<template>
  <div class="bg-card border border-line rounded-2xl shadow-soft overflow-hidden">
    <!-- حالة جاري التحميل -->
    <div v-if="taskStore.isLoading" class="p-8 text-center text-sub font-medium">
      {{ t('tasks.loading') }}
    </div>

    <!-- جدول المهام عند توفر البيانات -->
    <div
      v-else-if="taskStore.allTasks && taskStore.allTasks.length > 0"
      class="w-full overflow-x-auto"
    >
      <table class="w-full text-start text-fluid-xs whitespace-nowrap">
        <thead class="bg-line/10 border-b border-line text-sub font-bold uppercase">
          <tr>
            <th class="px-4 py-3">{{ t('tasks.table.id') }}</th>
            <th class="px-4 py-3">{{ t('tasks.table.taskName') }}</th>
            <th class="px-4 py-3">{{ t('tasks.table.status') }}</th>
            <th class="px-4 py-3 min-w-[160px]">{{ t('tasks.table.progress') }}</th>
            <th class="px-4 py-3">{{ t('tasks.table.systemMessage') }}</th>
            <th class="px-4 py-3">{{ t('tasks.table.createdAt') }}</th>
            <th class="px-4 py-3 text-center">{{ t('tasks.table.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line/60 bg-card text-main">
          <tr
            v-for="task in taskStore.allTasks"
            :key="task.id"
            class="hover:bg-line/10 transition-colors duration-150"
          >
            <!-- ID -->
            <td class="px-4 py-3 font-mono text-sub dir-ltr text-right">
              {{ task.id }}
            </td>

            <!-- اسم التاسك والمصدر -->
            <td class="px-4 py-3">
              <div
                class="font-bold text-main leading-snug max-w-xs sm:max-w-md truncate"
                :title="task.task_name"
              >
                {{ task.task_name }}
              </div>
              <div class="text-[11px] text-sub flex items-center gap-2 mt-1">
                <span
                  >{{ t('tasks.table.year') }}:
                  <strong class="text-main font-mono">{{ task.task_year || '-' }}</strong></span
                >
                <span>•</span>
                <a
                  v-if="task.source_url"
                  :href="task.source_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-accent hover:underline truncate max-w-[150px] dir-ltr inline-block"
                >
                  {{ t('tasks.table.sourceLink') }}
                </a>
                <span v-else class="text-sub/50">-</span>
              </div>
            </td>

            <!-- حالة التاسك -->
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2.5 py-1 rounded-md text-[11px] font-semibold border inline-flex items-center gap-1.5',
                  getStatusBadge(task.status).class,
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ getStatusBadge(task.status).label }}
              </span>
            </td>

            <!-- شريط التقدم والسرعة -->
            <td class="px-4 py-3">
              <div class="flex items-center justify-between text-[11px] font-bold mb-1">
                <span class="text-main font-mono">{{ task.progress_percent ?? 0 }}%</span>
                <span class="text-sub font-mono">{{ task.download_speed || '0 KB/s' }}</span>
              </div>
              <div class="w-full bg-line/20 rounded-full h-1.5 overflow-hidden">
                <div
                  class="bg-accent h-full transition-all duration-300"
                  :style="{ width: `${task.progress_percent ?? 0}%` }"
                ></div>
              </div>
            </td>

            <!-- رسالة النظام -->
            <td class="px-4 py-3 max-w-xs truncate" :title="task.status_message">
              <span :class="task.status === 'failed' ? 'text-danger font-semibold' : 'text-sub'">
                {{ task.status_message || '-' }}
              </span>
            </td>

            <!-- تاريخ الإنشاء -->
            <td class="px-4 py-3 font-mono text-sub dir-ltr text-right">
              {{ formatDate(task.created_at) }}
            </td>

            <!-- أزرار الإجراءات -->
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-1">
                <button
                  type="button"
                  @click="handleEdit(task.id)"
                  class="p-1.5 rounded-lg text-sub hover:text-accent hover:bg-accent/10 transition-colors active:scale-95 cursor-pointer"
                  title="تعديل"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  @click="handleDelete(task.id)"
                  class="p-1.5 rounded-lg text-sub hover:text-danger hover:bg-danger/10 transition-colors active:scale-95 cursor-pointer"
                  title="حذف"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- حالة عدم وجود بيانات -->
    <div v-else class="text-fluid-xs text-sub py-12 text-center bg-line/5 space-y-3">
      <div
        class="w-12 h-12 mx-auto rounded-xl bg-line/20 flex items-center justify-center text-sub border border-line"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p class="font-semibold text-main">{{ t('tasks.noData') }}</p>
      <p class="text-sub">{{ t('tasks.noDataHint') }}</p>
    </div>
  </div>
</template>
