<script setup>
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { loginSchema } from '@/schemas/authSchema'
import { useFormValidation } from '@/composables/useFormValidation'

// تجميع الحقول في كائن reactive واحد
const formData = reactive({
    email: '',
    password: '',
})

// استدعاء الـ Composable وتمرين الـ Schema
const { errors, validate } = useFormValidation(loginSchema)

const router = useRouter()
const authStore = useAuthStore()
const notiStore = useNotificationStore()


const handleSubmit = async () => {
    authStore.successMessage = ''

    // فحص البيانات باستخدام Zod
    const { isValid, data } = validate(formData)
    if (!isValid) return // إيقاف التنفيذ إذا توجد أخطاء مدخلات

    authStore.isLoading = true

    const isSuccess = await authStore.loginUser(data)

    authStore.isLoading = false

    if (isSuccess) {
        notiStore.triggerNotification(authStore.successMessage)
        router.push('/')
    } else {
        notiStore.triggerNotification(authStore.errorMessage)
    }
}
</script>

<template>
    <div class="min-h-screen bg-background flex items-center justify-center p-fluidsm:p-6 select-none relative">

        <!-- صندوق تسجيل الدخول -->
        <div class="w-full max-w-md bg-card rounded-2xl border border-custom-border shadow-xl p-8 space-y-6">

            <!-- شعار ومقدمة ترحيبية -->
            <div class="text-center space-y-2">
                <div
                    class="inline-flex w-12 h-12 bg-accent rounded-2xl items-center justify-center text-white font-black text-lg shadow-lg shadow-accent/20 mb-2">
                    D
                </div>
                <h2 class="text-2xl font-bold text-title tracking-tight">Welcome Back</h2>
                <p class="text-sub text-sm">Please enter your details to sign in / سجل دخولك</p>
            </div>

            <!-- استمارة تسجيل الدخول -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- حقل اسم المستخدم -->
                <div class="flex flex-col gap-1.5">
                    <label for="username" class="form-label">Username / اسم المستخدم</label>
                    <div class="relative">
                        <input id="username" type="text" placeholder="e.g. Bret" v-model="formData.email"
                            :class="[errors.email ? 'border-red-500 focus:ring-red-100' : '', 'form-input pl-11!']" />

                        <!-- رسالة الخطأ الخاص بالحقل -->
                        <p v-if="errors.email" class="text-fluid-xs text-red-500 mt-1">{{ errors.email }}</p>
                    </div>
                </div>

                <!-- حقل كلمة المرور -->
                <div class="flex flex-col gap-1.5">
                    <div class="flex justify-between items-center">
                        <label for="password" class="form-label mb-0">Password / كلمة المرور</label>
                        <a href="#"
                            class="text-fluid-xs font-semibold text-accent hover:text-accent-dark transition-colors">Forgot
                            password?</a>
                    </div>
                    <div class="relative">
                        <input id="password" type="password" placeholder="••••••••" v-model="formData.password"
                            :class="[errors.password ? 'border-red-500 focus:ring-red-100' : '', 'form-input pl-11']" />

                        <!-- رسالة الخطأ الخاص بالحقل -->
                        <p v-if="errors.password" class="text-fluid-xs text-red-500 mt-1">{{ errors.password }}</p>
                    </div>
                </div>

                <!-- زر تسجيل الدخول -->
                <button type="submit" class="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                    :disabled="authStore.isLoading">
                    <span>{{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}</span>
                </button>
            </form>
        </div>


    </div>
</template>
