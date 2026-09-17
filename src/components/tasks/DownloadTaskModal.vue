<script setup>
import { reactive, onMounted, computed, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useFormValidation } from '@/composables/useFormValidation'
import { useNotificationStore } from '@/stores/notificationStore'

// تأكد من حالة الأحرف (camelCase/PascalCase) لتطابق التصدير في ملف السكيما
import { createTaskSchema, UpdateTaskByIdSchema } from '@/schemas/downloadTaskSchema'

import { useTaskStore } from '@/stores/taskStore'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const notiStore = useNotificationStore()

const currentSchema = computed(() =>
    route.name === 'addTask' ? createTaskSchema : UpdateTaskByIdSchema
)
const { errors, validate } = useFormValidation(currentSchema)

const taskId = route.params.id

const formData = reactive({
    task_name: '',
    source_url: '',
    status: 'idle', // 👈 تم التصحيح لـ String بدلاً من مصفوفة
    progress_percent: 0,
    download_speed: '',
    status_message: '',
    trailer_url: '',
    fallback_urls: '',
    is_cancelled: false,
})

onMounted(async () => {
    if (route.name === 'editTask') {
        const task = await taskStore.fetchTaskById(taskId)
        // إذا كان التاسك غير موجود في الداتا بيز (رجع null)
        if (!task) {
            notiStore.triggerNotification('التاسك المطلوب غير موجود')
            return router.push({ name: 'NotFound' }) // 👈 توجيه لصفحة 404
        }

        formData.task_name = task.task_name ?? ''
        formData.source_url = task.source_url ?? ''
        formData.status = task.status ?? 'idle'
        formData.download_speed = task.download_speed ?? ''
        formData.status_message = task.status_message ?? ''
        formData.trailer_url = task.trailer_url ?? ''
        formData.fallback_urls = Array.isArray(task.fallback_urls)
            ? task.fallback_urls.join('\n')
            : ''
        formData.is_cancelled = task.is_cancelled ?? false
        formData.progress_percent = task.progress_percent ?? 0
    }
})

const handleSubmit = async () => {
    taskStore.successMessage = ''
    taskStore.errorMessage = ''

    const rawFormData = toRaw(formData)
    const payload = {
        ...rawFormData,
        fallback_urls: typeof rawFormData.fallback_urls === 'string'
            ? rawFormData.fallback_urls.split('\n').map(url => url.trim()).filter(Boolean)
            : []
    }

    const { isValid, data } = validate(payload)
    if (!isValid) return

    const isSuccess = route.name === 'addTask'
        ? await taskStore.addTask(data)
        : await taskStore.editTaskById(taskId, data)

    if (isSuccess) {
        const msg = route.name === 'addTask' ? 'تم إضافة التاسك بنجاح' : 'تم تعديل التاسك بنجاح'
        notiStore.triggerNotification(taskStore.successMessage || msg)
        router.push({ name: 'tasksList' })
    } else {
        // نكتفي بإظهار الإشعار فقط ويبقى المستخدم في الصفحة ليعيد المحاولة
        notiStore.triggerNotification(taskStore.errorMessage || 'حدث خطأ أثناء الحفظ')
    }
}
</script>
<template>
    <div class="max-w-4xl mx-auto p-fluid sm:p-6">
        <!-- Card Container -->
        <div class="card p-6 md:p-8 shadow-soft">

            <!-- Header -->
            <div class="mb-6 border-b border-line pb-4 flex items-center justify-between">
                <div>
                    <h1 class="text-fluid-h2 font-bold text-title">
                        {{ route.name === 'addTask' ? 'إضافة تاسك تحميل جديد' : 'تعديل بيانات التاسك' }}
                    </h1>
                    <p class="text-fluid-sm text-sub mt-1">
                        {{ route.name === 'addTask'
                            ? 'قم بملء البيانات التالية لإنشاء مهمة تحميل جديدة'
                            : 'تحديث معلومات ومسار مهمة التحميل الحالية'
                        }}
                    </p>
                </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-fluid-gap">

                    <!-- Task Name -->
                    <div class="col-span-1 md:col-span-2">
                        <label class="form-label">اسم التاسك (Task Name)</label>
                        <input v-model="formData.task_name" type="text" class="form-input"
                            placeholder="مثال: Episode 01 - Movie Title" required />
                        <p v-if="errors?.task_name" class="form-error">
                            {{ errors.task_name }}
                        </p>
                    </div>

                    <!-- Source URL -->
                    <div class="col-span-1 md:col-span-2">
                        <label class="form-label">رابط المصدر الأساسي (Source URL)</label>
                        <input v-model="formData.source_url" type="url" class="form-input"
                            placeholder="https://example.com/video.mp4" required />
                        <p v-if="errors?.source_url" class="form-error">
                            {{ errors.source_url }}
                        </p>
                    </div>

                    <!-- Trailer URL -->
                    <div class="col-span-1 md:col-span-2">
                        <label class="form-label">رابط الإعلان (Trailer URL)</label>
                        <input v-model="formData.trailer_url" type="url" class="form-input"
                            placeholder="https://youtube.com/watch?v=..." />
                        <p v-if="errors?.trailer_url" class="form-error">
                            {{ errors.trailer_url }}
                        </p>
                    </div>

                    <!-- Status -->
                    <div>
                        <label class="form-label">حالة التحميل (Status)</label>
                        <select v-model="formData.status" class="form-select">
                            <option value="idle">معلق (Idle)</option>
                            <option value="processing">جاري التحميل (Processing)</option>
                            <option value="completed">مكتمل (Completed)</option>
                            <option value="failed">فشل (Failed)</option>
                        </select>
                        <p v-if="errors?.status" class="form-error">
                            {{ errors.status }}
                        </p>
                    </div>

                    <!-- Progress Percent -->
                    <div>
                        <label class="form-label">نسبة التقدم (Progress %)</label>
                        <input v-model.number="formData.progress_percent" type="number" min="0" max="100"
                            class="form-input" placeholder="0 - 100" />
                        <p v-if="errors?.progress_percent" class="form-error">
                            {{ errors.progress_percent }}
                        </p>
                    </div>

                    <!-- Download Speed -->
                    <div>
                        <label class="form-label">سرعة التحميل (Download Speed)</label>
                        <input v-model="formData.download_speed" type="text" class="form-input"
                            placeholder="مثال: 5.2 MB/s" />
                        <p v-if="errors?.download_speed" class="form-error">
                            {{ errors.download_speed }}
                        </p>
                    </div>

                    <!-- Status Message -->
                    <div>
                        <label class="form-label">رسالة الحالة (Status Message)</label>
                        <textarea v-model="formData.status_message"
                            class="form-textarea min-h-20 max-h-30 text-right font-mono text-fluid-xs leading-relaxed"
                            placeholder="تفاصيل أو ملاحظات الحالة..."></textarea>
                        <p v-if="errors?.status_message" class="form-error">
                            {{ errors.status_message }}
                        </p>
                    </div>

                    <!-- Fallback URLs -->
                    <div class="col-span-1 md:col-span-2">
                        <label class="form-label">الروابط البديلة (ضع كل رابط في سطر مستقل)</label>
                        <textarea v-model="formData.fallback_urls" rows="5"
                            class="form-textarea font-mono text-fluid-xs leading-relaxed"
                            placeholder="https://down.vidtube.one/embed-wnlmx1uj5tpl.html&#10;https://d0o0d.com/e/jznbywxjbhn4"></textarea>
                        <p v-if="errors?.fallback_urls" class="form-error">
                            {{ errors.fallback_urls }}
                        </p>
                    </div>

                    <!-- Is Cancelled Checkbox -->
                    <div class="col-span-1 md:col-span-2 flex items-center gap-3 bg-card-hover p-fluid rounded-xl border border-line">
                        <input id="is_cancelled" v-model="formData.is_cancelled" type="checkbox"
                            class="size-5 accent-accent rounded cursor-pointer" />
                        <label for="is_cancelled" class="text-fluid-sm font-semibold text-title cursor-pointer select-none">
                            تم إلغاء المهمة (Is Cancelled)
                        </label>
                    </div>

                </div>

                <!-- Actions Footer -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
                    <button type="button" @click="router.back()" class="btn-secondary">
                        إلغاء
                    </button>

                    <button type="submit" :disabled="taskStore.isLoading" class="btn-primary">
                        <span v-if="taskStore.isLoading"
                            class="size-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
                        <span>{{ route.name === 'addTask' ? 'حفظ التاسك' : 'تحديث البيانات' }}</span>
                    </button>
                </div>

            </form>

        </div>
    </div>
</template>
