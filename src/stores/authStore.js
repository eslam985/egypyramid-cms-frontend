import { defineStore } from 'pinia'
import { login, logout, refresh } from '@/api/auth/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        isLoading: false,
        isInitialized: false,
        isServerError: false,
        successMessage: '',
        errorMessage: '',
    }),
    getters: {
        isAuthenticated: (state) => !!state.accessToken, // return True Or False
    },
    actions: {
        setAccessToken(token) {
            this.accessToken = token
        },
        clearAccessToken() {
            this.accessToken = null
        },
        async restoreSession() {
            // تشغيل التحميل فقط إذا كانت هذه أول مرة لتجنب تعليق الواجهة أثناء التجديد الصامت
            if (!this.isInitialized) {
                this.isLoading = true
            }

            this.errorMessage = ''
            this.successMessage = ''
            try {
                const result = await refresh()

                if (result.success) {
                    this.setAccessToken(result.data)
                    this.successMessage = result.message || 'Access token updated successfully'
                    return true
                }
                this.clearAccessToken()
                return false
            } catch (err) {
                this.clearAccessToken()
                const status = err.response?.status
                const isStatusErr = status === 403 || status === 401
                if (isStatusErr) return false

                this.errorMessage = err?.response?.data?.message || 'حدث خطا اثناء استرجاع الجلسة'
                console.error(err)
                return false
            } finally {
                this.isLoading = false
                this.isInitialized = true // يتم تحديدها كـ true وتظل كذلك لتجنب إعادة توجيه الـ Router
            }
        },
        async loginUser(credentials) {
            this.isLoading = true
            this.errorMessage = ''
            this.successMessage = ''
            try {
                const result = await login(credentials)

                if (result.success) {
                    this.setAccessToken(result.data)
                    this.successMessage = result.message || 'Login successful'
                    return true
                }
                return false
            } catch (err) {
                this.errorMessage =
                    err?.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً'
                console.error(err)
                return false
            } finally {
                this.isLoading = false
            }
        },

        async logoutUser() {
            this.isLoading = true
            this.errorMessage = ''
            this.successMessage = ''
            try {
                const result = await logout()
                if (result?.success) {
                    this.successMessage = result.message || 'Logout successful'
                }
                this.clearAccessToken()
            } catch (err) {
                this.errorMessage =
                    err?.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً'
                console.error(err)
                return false
            } finally {
                this.isLoading = false
            }
        },
    },
})
