<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'

import { useTaskStore } from '@/stores/taskStore'
import { useNotificationStore } from '@/stores/notificationStore';

const taskStore = useTaskStore()
const notiStore = useNotificationStore()
const router = useRouter()
const route = useRoute()

let inputValue = ref('')
let selectState = ref('')

const handleChooseState = async () => {
    // 1. عند اختيار "جميع الحالات" (القيمة فارغة "")
    if (!selectState.value) {
        await taskStore.fetchAllTasks(true);
        notiStore.triggerNotification('تم عرض جميع الحالات');
        return;
    }

    // 2. عند اختيار حالة محددة
    const foundState = await taskStore.fetchTasksByStatus(selectState.value, true);
    if (foundState) {
        notiStore.triggerNotification(taskStore.successMessage || 'تم تصفية المهام بنجاح');
    } else {
        notiStore.triggerNotification(taskStore.errorMessage || 'لم يتم العثور على مهام بهذه الحالة');
    }
}


const handleRefresh = async () => {
    inputValue.value = ''
    selectState.value = ''
    const data = await taskStore.fetchAllTasks(true);
    if (data) {
        notiStore.triggerNotification('تم تحديث البيانات بنجاح 🔄')
    }
}

const handleSearch = async () => {
    if (inputValue.value.length < 3) {
        notiStore.triggerNotification('حقل البحث لا يجب ان يكون اصغر من 3 حروف !')
        inputValue.value = ''
        return
    }

    const cleanInput = inputValue.value.trim().toString()
    const foundTask = await taskStore.fetchByTaskName(cleanInput, true)

    if (foundTask) {
        notiStore.triggerNotification(taskStore.successMessage)
    } else {
        notiStore.triggerNotification(taskStore.errorMessage || 'لم يتم العثور علي التاسك')
    }

    if (route.name !== 'tasksList') {
        router.push({ name: 'tasksList' })
    }

    inputValue.value = ''

}
</script>
<template>
    <div class="bg-card border border-line rounded-2xl p-fluidsm:p-6 shadow-soft mb-6">
        <div class="flex flex-col lg:flex-row items-end justify-between gap-4">

            <!-- أدوات الفلترة والبحث والتحديث -->
            <div class="grid grid-cols-1 md:grid-cols-12 p-fluid gap-3 md:gap-12 w-full lg:w-auto flex-1">
                <!-- left -->
                <div class="col-span-6 grid grid-cols-8 gap-fluid gap-2">
                    <!-- حقل البحث -->
                    <div class="col-span-4">
                        <label for="task-search" class="form-label">البحث باسم التاسك</label>
                        <input id="task-search" type="search" v-model="inputValue"
                            placeholder="اكتب اسم التاسك واضغط Enter..." class="form-input"
                            @keyup.enter="handleSearch" />
                    </div>

                    <div class="col-span-4">
                        <label for="task-status" class="form-label">حالة التحميل</label>
                        <select id="task-status" v-model="selectState" class="form-input" @change="handleChooseState">
                            <option value="">جميع الحالات</option>
                            <option value="idle">معلق (Idle)</option>
                            <option value="processing">جاري التحميل (Processing)</option>
                            <option value="failed">فشل (Failed)</option>
                        </select>
                    </div>
                </div>


                <!-- right -->
                <div class="col-span-6 flex justify-around md:justify-end gap-3 md:gap-6 pt-4">
                    <button type="button" class="btn-secondary w-full text-fluid-p text-center self-center"
                        @click="handleRefresh">
                        تحديث البيانات
                    </button>

                    <router-link to="/new-task" class="btn-primary w-full text-fluid-p text-center self-center">
                        + إضافة تاسك جديد
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
