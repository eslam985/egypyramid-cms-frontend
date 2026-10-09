import type { InternalAxiosRequestConfig } from 'axios'
import api from './client'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router' // تأكد من مسار الـ router الصحيح لديك
import { useNotificationStore } from '@/stores/notificationStore'

interface RefreshQueueItem {
    resolve: (value: string | null) => void
    reject: (reason?: unknown) => void
}

interface RetriedRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

let isRefreshing: boolean = false
let failedQueue: RefreshQueueItem[] = []

const processQueue = (error: unknown, token: string | null = null): void => {
    failedQueue.forEach((prom: RefreshQueueItem) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// before any request send accessToken to api (server)
// // 1. Request Interceptor: إرفاق التوكن تلقائياً مع كل طلب
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()

        // استثناء مسارات المصادقة لمنع إرسال توكن منتهي لطلب التجديد
        const isAuthEndpoint =
            config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh')

        if (authStore.isAuthenticated && !isAuthEndpoint) {
            config.headers.Authorization = `Bearer ${authStore.accessToken}`
        }

        return config
    },
    (err) => Promise.reject(err),
)

// 2. Response Interceptor: التجديد الآلي عند تلقي 401
api.interceptors.response.use(
    (response) => response,
    async (err) => {
        const authStore = useAuthStore()
        const originalRequest = err.config as RetriedRequestConfig | undefined

        const status = err.response?.status
        const notiStore = useNotificationStore()
        // if response status 429
        if (status === 429) {
            const h = err.response?.headers
            const raw = h
                ? h.get('Retry-After') || h.get('retry-after') || h.get('RateLimit-Reset')
                : null
            const retryAfter = parseInt(raw || '60', 10) || 60

            const mins = Math.ceil(retryAfter / 60)

            notiStore.triggerNotification(`Too many requests - Try again after ${mins}`)

            return Promise.reject(err)
        }

        // if response status 404
        if (status === 404) {
            notiStore.triggerNotification("We couldn't find what you're looking for.")
        }

        // 💡 التعديل الجديد: التقاظ خطأ الحجم الزائد 413 وعرض رسالة السيرفر المخصصة
        if (status === 413) {
            const errorMessage = err.response?.data?.message || 'حجم الملف المرفوع كبير جداً!'

            notiStore.triggerNotification(errorMessage)

            return Promise.reject(err) // نمرر الـ reject لكي ينتهي الطلب برمجياً بشكل صحيح
        }

        const isAuthEndpoint =
            originalRequest?.url?.includes('/auth/login') ||
            originalRequest?.url?.includes('/auth/refresh')

        const isErrorStatus = status === 401

        if (isErrorStatus && !isAuthEndpoint && originalRequest && !originalRequest._retry) {
            // إذا كان التجديد قيد التشغيل بالفعل، جمّد الطلبات الجديدة في طابور الانتظار
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        // ✅ حماية الـ headers والـ token من أي قيم undefined خفية وقت تشغيل الطابور
                        if (originalRequest.headers?.set) {
                            originalRequest.headers.set('Authorization', `Bearer ${token || ''}`)
                        } else if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token || ''}`
                        }
                        return api(originalRequest)
                    })

                    .catch((err) => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true // إغلاق القفل

            try {
                const isRefreshed = await authStore.restoreSession()

                if (isRefreshed) {
                    const newToken = authStore.accessToken
                    processQueue(null, newToken)

                    if (originalRequest.headers?.set) {
                        originalRequest.headers.set('Authorization', `Bearer ${newToken || ''}`)
                    } else if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken || ''}`
                    }

                    return api(originalRequest)
                } else {
                    processQueue(new Error('Session expired'))
                    authStore.clearAccessToken()
                    router.push('/login') // <-- طرد المستخدم فوراً لإيقاف الـ Loop
                    return Promise.reject(err)
                }
            } catch (refreshErr) {
                processQueue(refreshErr)
                authStore.clearAccessToken()
                router.push('/login') // <-- طرد المستخدم فوراً لإيقاف الـ Loop
                return Promise.reject(refreshErr)
            } finally {
                isRefreshing = false // فتح القفل للطلبات المستقبلية
            }
        }

        return Promise.reject(err)
    },
)

export default api
