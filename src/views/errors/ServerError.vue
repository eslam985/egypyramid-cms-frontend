<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const handleRetry = async () => {
    try {
        await authStore.restoreSession()
        authStore.isServerError = false
    } catch (err) {
        console.error('إعادة المحاولة فشلت:', err)
    }
}
</script>

<template>
    <div class="min-h-screen bg-background flex items-center justify-center p-fluid-p">
        <div class="max-w-md w-full bg-card-bg border border-custom-border rounded-2xl p-8 text-center shadow-sm">
            <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <span class="text-fluid-h1 font-black text-title block mb-2">500</span>
            <h1 class="text-fluid-h2 font-bold text-title mb-3">انقطاع الاتصال بالسيرفر</h1>
            <p class="text-sub text-fluid-p mb-8">
                تعذر الاتصال بالخادم الرئيسي. يرجى إعادة المحاولة او الرجوع لاحقا
            </p>
            <button @click="handleRetry" class="btn-primary w-full">
                إعادة المحاولة
            </button>
        </div>
    </div>
</template>
