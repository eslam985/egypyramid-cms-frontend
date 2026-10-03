<script setup>
import { ref, computed } from 'vue'
import { Search, Loader, Download } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useNotificationStore } from '@/stores/notificationStore'
import { useTaskStore } from '@/stores/taskStore'
import { confirmAndDelete } from '@/utils/global'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const { t } = useI18n()

const taskStore = useTaskStore()
const notiStore = useNotificationStore()
const router = useRouter()
const route = useRoute()

let selectState = ref('')
let searchInput = ref('')
const handleChooseState = async () => {
  // 1. نقوم بتحديث الرابط فقط (مع الاحتفاظ بأي بحث سابق في الرابط إن وجد)
  await router.push({
    query: {
      ...route.query, // نحافظ على باقي البرامترز مثل search
      status: selectState.value || undefined, // سيتم إزالة الـ status من الرابط إذا كان فارغاً
      page: 1 // دائماً عند تغيير الفلتر نعود للصفحة الأولى
    }
  })
  await taskStore.fetchAllTasks(route.query, true)

  // 2. معالجة الإشعارات
  if (!selectState.value) {
    notiStore.triggerNotification(t('tasks.toolbar.allStatusesShown'))
  } else {
    // يمكنك هنا ترك رسالة نجاح عامة للفلترة
    notiStore.triggerNotification(t('tasks.toolbar.filterSuccess'))
  }
}

const handleRefresh = async () => {
  searchInput.value = ''
  selectState.value = ''

  // إذا كان الرابط لا يحتوي على فلاتر أو بحث مسبق، قم بعمل ريفريش إجباري من السيرفر
  if (Object.keys(route.query).length === 0) {
    await taskStore.fetchAllTasks({}, true)
  } else {
    // إذا كان الرابط يحتوي على فلاتر، نقوم بتنظيفه، وهذا سيحفز الـ watch تلقائياً لجلب البيانات
    await router.push(
      {
        name: 'tasksList',
        query: {
          page: 1,
          limit: 20
        }
      }
    )
  }

  notiStore.triggerNotification(t('common.refreshSuccess'))
}

const sreach = async () => {
  const rawValue = searchInput.value.trim()
  if (!rawValue) return

  const targetId = Number(rawValue)
  const isId = Number.isInteger(targetId) && String(targetId) === rawValue

  if (!isId && rawValue.length < 3) {
    notiStore.triggerNotification('حقل البحث بالاسم يجب ألا يكون أصغر من 3 حروف !')
    searchInput.value = ''
    return
  }

  if (isId) {
    // 1. البحث بالـ ID: هذه حالة خاصة تجلب عنصراً واحداً فقط
    const foundItem = await taskStore.fetchTaskById(targetId, true)
    if (!foundItem) {
      notiStore.triggerNotification(taskStore.errorMessage)
    }
    // نقوم بتنظيف الرابط لكي لا يظهر للمستخدم أنه يبحث بـ Status أو Search واسم أثناء عرض عنصر واحد
    if (Object.keys(route.query).length > 0) {
      router.push({ name: 'tasksList', query: {} })
    }
  } else {
    // 2. البحث بالاسم: نحدث الرابط فقط! والـ watch في الصفحة الرئيسية سيجلب البيانات
    await router.push({
      name: 'tasksList',
      query: {
        ...route.query,
        search: rawValue, // إضافة كلمة البحث للرابط
        page: 1 // العودة للصفحة الأولى دائماً عند إجراء بحث جديد
      }
    })
  }

  searchInput.value = ''
}

const failedCount = computed(() =>
  taskStore.allTasks.filter(t => t.status === 'failed').length
)

const handleDeleteFailed = async () => {
  await confirmAndDelete({
    message: t('tasks.confirm.deleteFailed', { count: failedCount.value }),
    action: () => taskStore.removeAllFailedTasks(),
    store: taskStore,
    notiStore: notiStore,
    fallbackSuccess: t('tasks.confirm.deleteFailedSuccess', { count: failedCount.value }),
    fallbackError: t('tasks.confirm.deleteFailedError')
  })
}

const handleExport = async () => {
  const query = route.query
  console.log(query)
  await taskStore.exportTasks()
}
</script>
<template>
  <!-- أدوات الفلترة والبحث والتحديث -->
  <div :class="authStore.isEditorAndAbove ? 'grid grid-cols-2 xs:grid-cols-3 md:grid-cols-25' : 'flex '"
    class="gap-fluid-gap p-fluid">

    <!-- 1111 -->
    <!-- حقل البحث -->
    <div class="md:col-span-4 flex self-center relative text-fluid-xs">
      <input id="task-search" type="search" v-model="searchInput" :placeholder="t('tasks.toolbar.searchPlaceholder')"
        class="form-input pl-6 pr-0 text-center bg-line/10 border border-accent/20 border-linerounded-xl text-fluid-xs"
        @keyup.enter="sreach" />
      <Search @click="sreach" class="self-center absolute left-2 text-accent" />
    </div>

    <!-- 2222 -->
    <!-- select -->
    <div class="md:col-span-3 self-center">
      <select id="task-status" v-model="selectState"
        class="form-input w-full bg-line/10 border border-accent/20 border-linerounded-xl focus:ring-2 focus:ring-accent/20 cursor-pointer"
        @change="handleChooseState">
        <option value="">{{ t('tasks.toolbar.allStatuses') }}</option>
        <option value="idle">{{ t('tasks.form.statusOptions.idle') }}</option>
        <option value="processing">{{ t('tasks.form.statusOptions.processing') }}</option>
        <option value="failed">{{ t('tasks.form.statusOptions.failed') }}</option>
      </select>
    </div>

    <!-- 3333 -->
    <!-- Export -->
    <div  v-if="authStore.isEditorAndAbove" class="md:col-span-5 self-center">
      <button type="button"
        class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
        @click="handleExport">
        <Download class="size-5 text-accent" :stroke-width="2" />
        Export
      </button>
    </div>

    <!-- 4444 -->
    <!-- refreshData -->
    <button type="button"
      class="md:col-span-4 btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
      @click="handleRefresh">
      <Loader class="size-5 text-accent" :class="{ 'animate-spin': taskStore.isLoading }" :stroke-width="2" />
      {{ t('common.refreshData') }}
    </button>

    <!-- 5555 -->
    <!-- addNew -->
    <router-link  v-if="authStore.isEditorAndAbove" to="/new-task"
      class="md:col-span-4 btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
      {{ t('tasks.toolbar.addNew') }}
    </router-link>

    <!-- 6666 -->
    <!-- deleteFailed -->
    <button v-if="failedCount > 0 && authStore.isAdmin" @click="handleDeleteFailed" :disabled="taskStore.isLoading"
      class="md:col-span-4 btn-danger text-fluid-xs max-w-[150px] ">
      {{ taskStore.isLoading ? t('tasks.toolbar.deleting') : t('tasks.toolbar.deleteFailed', {
        count: failedCount
      }) }}
    </button>
  </div>
</template>
