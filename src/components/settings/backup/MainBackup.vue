<script setup lang="ts">
import { computed, watch } from 'vue'
import { ShieldLock, SaveCheck, KeyRound, Loader2, Download } from '@lucide/vue'

import { useNotificationStore } from '@/stores/notificationStore'
import { useBackupStore } from '@/stores/backupStore'
import { useAuthStore } from '@/stores/authStore'

const notiStore = useNotificationStore()
const backupStore = useBackupStore()
const authStore = useAuthStore()

const downloadedBytes = computed(() => backupStore.downloadedBytes)
const successMessage = computed(() => backupStore.successMessage)
const errorMessages = computed(() => backupStore.errorMessage)
const elapsedTime = computed(() => backupStore.elapsedTime)
const isLoading = computed(() => backupStore.isLoading)

const downloadedMB = computed(() => {
    return (downloadedBytes.value / (1024 * 1024)).toFixed(2)
})

const downloadSpeed = computed(() => {
    if (elapsedTime.value === 0) return '0.00'
    return (Number(downloadedMB.value) / elapsedTime.value).toFixed(2)
})

watch(successMessage, (newMsg: string) => {
    if (newMsg && notiStore?.triggerNotification) {
        notiStore.triggerNotification(newMsg)
    }
})

// مراقبة رسائل الخطأ لتنبيه المستخدم
watch(errorMessages, (newMsg) => {
    if (newMsg && notiStore?.triggerNotification) {
        notiStore.triggerNotification(newMsg)
    }
})

// دالة تنفيذ تحميل النسخة الاحتياطية
const triggerBackupDownload = async (): Promise<void> => {
    await backupStore.downloadBackup()
}
</script>

<template>
    <div
        v-if="authStore.isAdmin"
        class="bg-card border border-line rounded-card p-fluid-p shadow-soft max-w-2xl transition-all duration-300"
    >
        <!-- العنوان والوصف مع أيقونة الـ ShieldLock -->
        <div class="mb-5">
            <h3 class="text-fluid-h3 text-title font-bold mb-2 flex items-center gap-2">
                <ShieldLock class="w-6 h-6 text-accent" />
                النسخ الاحتياطي لقاعدة البيانات
            </h3>
            <p class="text-fluid-sm text-sub leading-relaxed">
                يمكنك تحميل نسخة احتياطية كاملة ومباشرة من قاعدة البيانات الحالية بصيغة
                <code class="bg-code text-accent px-1.5 py-0.5 rounded font-mono text-xs"
                    >.dump</code
                >. يفضل القيام بهذه الخطوة دورياً من قبل المشرفين لحماية بيانات النظام من أي فقدان
                مفاجئ.
            </p>
        </div>

        <div
            v-if="isLoading || downloadedBytes > 0"
            class="mb-5 p-4 bg-background-alt border border-line rounded-xl transition-all duration-300"
        >
            <div class="flex items-center justify-between mb-2 text-fluid-xs md:text-fluid-sm">
                <span class="text-title font-medium flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    جاري تحميل البيانات الحية...
                </span>
                <span class="text-accent font-mono font-bold">{{ downloadedMB }} MB</span>
            </div>

            <div class="w-full bg-line rounded-full h-2 overflow-hidden">
                <div class="bg-accent h-full rounded-full animate-infinite-loading w-1/3"></div>
            </div>

            <!-- إحصائيات التحميل بالوقت والسرعة -->
            <div class="flex justify-between items-center mt-3 text-fluid-xs text-muted font-mono">
                <span class="flex items-center gap-1"
                    >⏱️ الوقت المستغرق:
                    <strong class="text-sub">{{ elapsedTime }} ثانية</strong></span
                >
                <span class="flex items-center gap-1"
                    >⚡ السرعة الحالية:
                    <strong class="text-sub">{{ downloadSpeed }} MB/s</strong></span
                >
            </div>
        </div>

        <!-- منطقة الإجراء والزر والوضع الافتراضي -->
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-line"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200"
                    :class="isLoading ? 'bg-accent/10 text-accent' : 'bg-success/10 text-success'"
                >
                    <!-- 💡 استبدال الأيقونات بـ Lucide المتطورة -->
                    <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
                    <SaveCheck v-else class="w-5 h-5" />
                </div>
                <div>
                    <h4 class="text-fluid-p text-title font-semibold">حالة الحماية والأمان</h4>
                    <p class="text-fluid-xs text-muted flex items-center gap-1">
                        <KeyRound class="w-3 h-3 text-muted" />
                        {{
                            isLoading
                                ? 'يتم سحب وتجميع الجداول والـ RPCs بشكل مشفر...'
                                : 'جاهز لإنشاء نسخة احتياطية فورية'
                        }}
                    </p>
                </div>
            </div>

            <button
                @click="triggerBackupDownload"
                :disabled="isLoading"
                class="btn-primary w-full sm:w-auto shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 select-none"
            >
                <!-- 💡 استبدال الساعة الرملية بأيقونة الـ Loader السلسة -->
                <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                <Download v-else class="w-4 h-4" />
                {{ isLoading ? 'جاري تجهيز الملف...' : 'تحميل النسخة الاحتياطية' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@keyframes infinite-loading {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(300%);
    }
}
.animate-infinite-loading {
    animation: infinite-loading 1.8s infinite linear;
}
</style>
