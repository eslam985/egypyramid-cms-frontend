
import { defineStore } from 'pinia'
import { login, logout, refresh, handleRegister } from '@/api/auth/auth'
import { handleStoreAdd } from '@/utils/store'
import { RolesList } from '@/utils/roles_list';
import { decodeJwt } from '@/utils/decodeJwt';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userRole: null,   // هنا هيتخزن الرقم مثلاً 2001 أو 1984
    accessToken: null,
    isLoading: false,
    isInitialized: false,
    isServerError: false,
    successMessage: '',
    errorMessage: '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken, // return True Or False
    // دالة بترجع true لو اليوزر أدمن
    isAdmin: (state) => state.userRole === RolesList.Admin,

    // دالة بترجع true لو اليوزر على الأقل إيديتور (يعني إيديتور أو أدمن)
    isEditorAndAbove: (state) => state.userRole === RolesList.Editor || state.userRole === RolesList.Admin,

    // دالة مرنة تديها الحد الأدنى المطلوب وتشوف اليوزر ينفع ولا لأ
    hasRole: (state) => (requiredRole) => {
      if (!state.userRole) return false;
      // لو المطلوب Editor، فالأدمن (5150) والإيديتور (1984) مسموح ليهم
      if (requiredRole === RolesList.Editor) {
        return state.userRole === RolesList.Editor || state.userRole === RolesList.Admin;
      }
      if (requiredRole === RolesList.Admin) {
        return state.userRole === RolesList.Admin;
      }
      return true; // الـ User العادي يشوف كلو مالم يحدد دور أعلى
    }
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

          // فك التوكن هنا مباشرة لاستخراج الـ roles والـ userId
          const decoded = decodeJwt(result.data);
          if (decoded) {
            this.userRole = parseInt(decoded.roles) || null; // تخزين الـ Role كرقم
            this.user = { id: decoded.userId }; // تعيين الـ id لو محتاجه في الفرونت
          }
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
    async register( data = {}) {
      console.log(data)
      return handleStoreAdd({
        store: this,
        apiCall: handleRegister,
        data,
        listKey: 'user',
        defaultError: 'حدثت مشكلة اثناء إضافة المستخدم!',
      })
    },
    async loginUser(credentials) {
      this.isLoading = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        const result = await login(credentials)
        if (result.success) {
          this.setAccessToken(result.data.accessToken)
          this.userRole = result.roles
          this.user = result
          this.user.accessToken = null // مش محتاج الاكسيس توكن  هنا ف الامن تقريبا يتشال ع طول
          this.successMessage = result.message || 'Login successful'
          return true
        }
        return false
      } catch (err) {
        if (err?.response?.data?.message.includes('getaddrinfo ENOTFOUND')) {
          this.errorMessage = 'حدث خطأ اثناء الاتصال بقاعدة البيانات!'
        } else {
          this.errorMessage = err?.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً'
        }

        console.error('debug: ', err?.response?.data?.message)
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
        // عدّل logoutUser — مرر الـ token
        const result = await logout()
        if (result?.success) {
          this.successMessage = result.message || 'Logout successful'
        }
        this.clearAccessToken()
      } catch (err) {
        this.errorMessage = err?.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً'
        console.error(err)
        return false
      } finally {
        this.isLoading = false
      }
    },
  },
})
