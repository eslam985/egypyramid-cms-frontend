import { defineStore } from 'pinia'
import { login, logout, refresh, handleRegister } from '@/api/auth/auth'
import { useNotificationStore } from '@/stores/notificationStore'
import { handleStoreAdd } from '@/utils/store'
import { RolesList } from '@/utils/roles_list'
import { decodeJwt } from '@/utils/decodeJwt'

import type { UserDataResponse, JwtUserPayload } from '@/types/userType'
import type { LoginUserInputsType, CreateUserInputsType } from '@/schemas/authSchema'
import type { BaseApiResponse } from '@/types/globalTypes'
import type { AuthState } from '@/types/storeType'
import { isAxiosError } from 'axios'

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        userRole: null,
        accessToken: null,
        isLoading: false,
        isInitialized: false,
        isServerError: false,
        successMessage: '',
        errorMessage: '',
    }),

    getters: {
        notiStore: () => useNotificationStore(),

        isAuthenticated: (state): boolean => !!state.accessToken,

        isAdmin: (state): boolean => state.userRole === RolesList.Admin,

        isEditorAndAbove: (state): boolean =>
            state.userRole === RolesList.Editor || state.userRole === RolesList.Admin,

        // 👈 التعديل الصريح هنا: حددنا إن الـ getter ده بيرجع دالة تأخذ رقم وترجع boolean
        hasRole(state): (requiredRole: number) => boolean {
            return (requiredRole: number): boolean => {
                if (!state.userRole) return false
                if (requiredRole === RolesList.Editor) {
                    return state.userRole === RolesList.Editor || state.userRole === RolesList.Admin
                }
                if (requiredRole === RolesList.Admin) {
                    return state.userRole === RolesList.Admin
                }
                return true
            }
        },
    },
    actions: {
        async loginUser(credentials: LoginUserInputsType): Promise<boolean> {
            this.isLoading = true
            this.errorMessage = ''
            this.successMessage = ''

            try {
                const result: BaseApiResponse<UserDataResponse> = await login(credentials)

                if (result && result.success) {
                    this.setAccessToken(result.data?.accessToken ?? null)

                    const rolesAttr: string | undefined = result.data?.roles
                    this.userRole = rolesAttr ? Number(rolesAttr) : null

                    const userData: UserDataResponse = { ...result.data }
                    delete userData.accessToken
                    this.user = userData

                    this.successMessage = result.message || 'تم تسجيل الدخول بنجاح'

                    this.notiStore.triggerNotification(this.successMessage)
                    return true
                }

                return false
            } catch (err: unknown  ) {
                const status: number | undefined = isAxiosError(err) ? err.response?.status : undefined
                const msg: string = isAxiosError(err) ? err.response?.data?.message || '' : ''

                if (msg.includes('getaddrinfo ENOTFOUND')) {
                    this.errorMessage = 'حدث خطأ اثناء الاتصال بقاعدة البيانات!'
                } else {
                    this.errorMessage = msg || 'حدث خطأ ما، يرجى المحاولة لاحقاً'

                    // الطريقة الأظطف والنظيفة بدون if فارغ
                    if (!status || status >= 500) {
                        this.isServerError = true
                    }
                }

                this.notiStore.triggerNotification(this.errorMessage)
                console.error(err)
                return false
            } finally {
                this.isLoading = false
            }
        },
        setAccessToken(token: string | null): void {
            this.accessToken = token
        },

        clearAccessToken(): void {
            this.accessToken = null
        },

        async restoreSession(): Promise<boolean> {
            if (!this.isInitialized) {
                this.isLoading = true
            }

            this.errorMessage = ''
            this.successMessage = ''
            try {
                const result: BaseApiResponse<UserDataResponse['accessToken']> = await refresh()

                if (result && result.success) {
                    this.setAccessToken(result.data ?? null)

                    const decoded: JwtUserPayload | null = decodeJwt(
                        result.data,
                    ) as JwtUserPayload | null

                    if (decoded) {
                        this.userRole = parseInt(decoded.roles, 10) || null
                        this.user = { id: decoded.userId } as UserDataResponse
                    }
                    this.successMessage = result.message || 'Access token updated successfully'
                    return true
                }
                this.clearAccessToken()
                return false
            } catch (err: unknown  ) {
                this.clearAccessToken()
                const status: number | undefined = isAxiosError(err) ? err.response?.status : undefined
                const msg: string = isAxiosError(err) ? err.response?.data?.message || 'حدث خطا اثناء استرجاع الجلسة' : ''
                const isStatusErr: boolean = status === 401

                this.errorMessage = msg
                console.error(err)
                if (isStatusErr) return false
                return false
            } finally {
                this.isLoading = false
                this.isInitialized = true
            }
        },

        async register(data: CreateUserInputsType): Promise<UserDataResponse | null> {
            if (!data) {
                this.notiStore.triggerNotification('data is required!')
                return null
            }

            const isSuccess: UserDataResponse | null = await handleStoreAdd<
                UserDataResponse,
                CreateUserInputsType,
                AuthState
            >({
                store: this,
                apiCall: handleRegister,
                data,
                defaultError: 'حدثت مشكلة اثناء إضافة المستخدم!',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(
                    this.errorMessage || 'An error occurred while adding the user!',
                )
            } else {
                this.notiStore.triggerNotification(
                    this.successMessage || `user ${data?.username} Created successfully!`,
                )
            }

            return isSuccess
        },

        async logoutUser(): Promise<boolean | void> {
            this.isLoading = true
            this.errorMessage = ''
            this.successMessage = ''

            try {
                const result: BaseApiResponse<null> = await logout()

                if (result?.success) {
                    this.successMessage = result.message || 'Logout successful'
                }

                this.notiStore.triggerNotification(this.successMessage)
                this.clearAccessToken()
            } catch (err: any) {
                this.errorMessage =
                    err?.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً'

                this.notiStore.triggerNotification(this.errorMessage)
                console.error(err)
                return false
            } finally {
                this.isLoading = false
            }
        },
    },
})
