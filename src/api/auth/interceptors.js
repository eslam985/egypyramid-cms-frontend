import api from './client'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router' // تأكد من مسار الـ router الصحيح لديك

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
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
// 2. Response Interceptor: التجديد الآلي عند تلقي 401
api.interceptors.response.use(
    (response) => response,
    async (err) => {
        const authStore = useAuthStore()
        const originalRequest = err.config
        const status = err.response?.status

        const isAuthEndpoint =
            originalRequest?.url?.includes('/auth/login') ||
            originalRequest?.url?.includes('/auth/refresh')

        const isErrorStatus = status === 401 || status === 403

        if (isErrorStatus && !isAuthEndpoint && !originalRequest._retry) {
            // إذا كان التجديد قيد التشغيل بالفعل، جمّد الطلبات الجديدة في طابور الانتظار
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        if (originalRequest.headers.set) {
                            originalRequest.headers.set('Authorization', `Bearer ${token}`) // استخدم newToken في الموضع الثاني
                        } else {
                            originalRequest.headers.Authorization = `Bearer ${token}` // استخدم newToken في الموضع الثاني
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

                    if (originalRequest.headers.set) {
                        originalRequest.headers.set('Authorization', `Bearer ${newToken}`)
                    } else {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
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
