<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useTaskStore } from '@/stores/taskStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { Search } from '@lucide/vue'

const { t } = useI18n()

const taskStore = useTaskStore()
const notiStore = useNotificationStore()
const router = useRouter()
const route = useRoute()

let inputValue = ref('')
let selectState = ref('')

const handleChooseState = async () => {
  // 1. عند اختيار "جميع الحالات" (القيمة فارغة "")
  if (!selectState.value) {
    await taskStore.fetchAllTasks(true)
    notiStore.triggerNotification(t('tasks.toolbar.allStatusesShown'))
    return
  }

  // 2. عند اختيار حالة محددة
  const foundState = await taskStore.fetchTasksByStatus(selectState.value, true)
  if (foundState) {
    notiStore.triggerNotification(taskStore.successMessage || t('tasks.toolbar.filterSuccess'))
  } else {
    notiStore.triggerNotification(taskStore.errorMessage || t('tasks.toolbar.noTasksFound'))
  }
}

const handleRefresh = async () => {
  inputValue.value = ''
  selectState.value = ''
  const data = await taskStore.fetchAllTasks(true)
  if (data) {
    notiStore.triggerNotification(t('common.refreshSuccess'))
  }
}

const handleSearch = async () => {
  if (inputValue.value.length < 3) {
    notiStore.triggerNotification(t('tasks.toolbar.searchMinChars'))
    inputValue.value = ''
    return
  }

  const cleanInput = inputValue.value.trim().toString()
  const foundTask = await taskStore.fetchByTaskName(cleanInput, true)

  if (foundTask) {
    notiStore.triggerNotification(taskStore.successMessage)
  } else {
    notiStore.triggerNotification(taskStore.errorMessage || t('tasks.toolbar.taskNotFound'))
  }

  if (route.name !== 'tasksList') {
    router.push({ name: 'tasksList' })
  }

  inputValue.value = ''
}
</script>
<template>
  <div class="bg-card border border-line rounded-2xl p-fluid shadow-soft mb-6">
    <div class="flex flex-col lg:flex-row items-end justify-between gap-4">
      <!-- أدوات الفلترة والبحث والتحديث -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-12 w-full lg:w-auto flex-1">
        <!-- left -->
        <div class="col-span-6 grid grid-cols-8 gap-fluid gap-2">
          <!-- حقل البحث -->
          <div class="col-span-4 flex self-center relative">
            <input
              id="task-search"
              type="search"
              v-model="inputValue"
              :placeholder="t('tasks.toolbar.searchPlaceholder')"
              class="form-input p-fluid text-center bg-line/10 border border-accent/20 border-linerounded-xl"
              @keyup.enter="handleSearch"
            />
            <Search @click="handleSearch" class="self-center absolute left-2 text-accent" />
            </div>

            <div class="col-span-4">
            <select
              id="task-status"
              v-model="selectState"
              class="form-input w-full p-fluid bg-line/10 border border-accent/20 border-linerounded-xl focus:ring-2 focus:ring-accent/20 cursor-pointer"
              @change="handleChooseState"
            >
              <option value="">{{ t('tasks.toolbar.allStatuses') }}</option>
              <option value="idle">{{ t('tasks.form.statusOptions.idle') }}</option>
              <option value="processing">{{ t('tasks.form.statusOptions.processing') }}</option>
              <option value="failed">{{ t('tasks.form.statusOptions.failed') }}</option>
            </select>
          </div>
        </div>

        <!-- right -->
        <div class="col-span-6 flex justify-around md:justify-end gap-3 md:gap-6">
          <button
            type="button"
            class="btn-outline shadow-glow/10 text-fluid-xs! lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70 w-full"
            @click="handleRefresh"
          >
            {{ t('common.refreshData') }}
            </button>

            <router-link
            to="/new-task"
            class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70 w-full"
            >
            {{ t('tasks.toolbar.addNew') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
