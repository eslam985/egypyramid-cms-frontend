import { defineStore } from 'pinia'
import { login, logout, refresh, handleRegister } from '@/api/auth/auth'
import { handleStoreAdd } from '@/utils/store'
import { RolesList } from '@/utils/roles_list'
import { decodeJwt } from '@/utils/decodeJwt'
import type { LoginUserInputsType, CreateUserInputsType } from '@/schemas/authSchema'

import type {
    UserDataResponse,
    RegisterDataResponse,
    JwtUserPayload,
    BaseStore,
    BaseApiResponse,
} from '@/types/globalTypes'

export interface AuthState extends BaseStore {
    user: UserDataResponse | { id: string } | null
    userRole: number | null
    accessToken: string | null
    isInitialized: boolean
    isServerError: boolean
}

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
        isAuthenticated: (state): boolean => !!state.accessToken,

        isAdmin: (state): boolean => state.userRole === RolesList.Admin,

        isEditorAndAbove: (state): boolean =>
            state.userRole === RolesList.Editor || state.userRole === RolesList.Admin,

        hasRole:
            (state) =>
            (requiredRole: number): boolean => {
                if (!state.userRole) return false
                if (requiredRole === RolesList.Editor) {
                    return state.userRole === RolesList.Editor || state.userRole === RolesList.Admin
                }
                if (requiredRole === RolesList.Admin) {
                    return state.userRole === RolesList.Admin
                }
                return true
            },
    },

    actions: {
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
                const result: BaseApiResponse<string> = await refresh()

                if (result && result.success) {
                    this.setAccessToken(result.data)

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
            } catch (err: any) {
                this.clearAccessToken()
                const status: number | undefined = err?.response?.status
                const isStatusErr: boolean = status === 403 || status === 401
                if (isStatusErr) return false

                this.errorMessage = err?.response?.data?.message || 'حدث خطا اثناء استرجاع الجلسة'
                console.error(err)
                return false
            } finally {
                this.isLoading = false
                this.isInitialized = true
            }
        },

        async register(data: CreateUserInputsType) {
            return handleStoreAdd<RegisterDataResponse, CreateUserInputsType, AuthState>({
                store: this,
                apiCall: handleRegister,
                data,
                defaultError: 'حدثت مشكلة اثناء إضافة المستخدم!',
            })
        },

        async loginUser(credentials: LoginUserInputsType): Promise<boolean> {
            this.isLoading = true
            this.errorMessage = ''
            this.successMessage = ''
            try {
                const result: BaseApiResponse<UserDataResponse> = await login(credentials)
                if (result && result.success) {
                    // استخدام ?? null يضمن عدم تمرير undefined لـ setAccessToken
                    this.setAccessToken(result.data?.accessToken ?? null)

                    // استخراج الـ Role بشكل آمن بـ Optional Chaining
                    const rolesAttr: string | undefined = result.data?.roles
                    this.userRole = rolesAttr ? Number(rolesAttr) : null

                    // حفظ بيانات المستخدم
                    const userData: UserDataResponse = { ...result.data }
                    delete userData.accessToken
                    this.user = userData

                    this.successMessage = result.message || 'Login successful'
                    return true
                }
                return false
            } catch (err: any) {
                const msg: string = err?.response?.data?.message || ''
                if (msg.includes('getaddrinfo ENOTFOUND')) {
                    this.errorMessage = 'حدث خطأ اثناء الاتصال بقاعدة البيانات!'
                } else {
                    this.errorMessage = msg || 'حدث خطأ ما، يرجى المحاولة لاحقاً'
                }

                console.error('debug: ', msg)
                console.error(err)
                return false
            } finally {
                this.isLoading = false
            }
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
                this.clearAccessToken()
            } catch (err: any) {
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
