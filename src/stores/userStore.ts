import { defineStore } from 'pinia'

import { handleStoreDelete, handleStoreEdit, handleStoreFetch } from '@/utils/store'
import { useNotificationStore } from '@/stores/notificationStore'

import type { UpdateUserInputsType, ChangePasswordInputsType } from '@/schemas/authSchema'
import type { UserDataResponse, UserSessionDataResponse } from '@/types/userType'
import type { SortedSessionRequest } from '@/types/seasonType'
import type { OrderingEnum } from '@/types/globalTypes'
import type { UserState } from '@/types/storeType'

import {
    handleFindUserById,
    handleGetSessionsByUserId,
    handleUpdateUserInfo,
    handleChangePassword,
    handleRemoveSessionById,
    handleUploadAvatar,
    handleDeleteAvatar,
    handleSetAvatarFromHistory,
} from '@/api/auth/userApi'

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        isLoading: false,
        successMessage: '',
        errorMessage: '',
        userInfo: null,
        sessions: [],
        filters: {
            sortBy: 'created_at',
            sortOrder: 'ASC' as OrderingEnum,
        },
    }),
    getters: {
        notiStore: () => useNotificationStore(),
    },
    actions: {
        async updateUserInfo(data: UpdateUserInputsType): Promise<UserDataResponse | null> {
            if (!data) {
                this.notiStore.triggerNotification('data is required')
                return null
            }

            const isSuccess: UserDataResponse | null = await handleStoreEdit<
                UserDataResponse,
                UpdateUserInputsType,
                never,
                UserState
            >({
                store: this,
                apiCall: handleUpdateUserInfo,
                data,
                listKey: 'userInfo',
                defaultError: 'حدثت مشكلة اثناء تعديل بيانات المستخدم',
            })

            return isSuccess
        },

        async ChangePassword(data: ChangePasswordInputsType): Promise<number | null> {
            if (!data) {
                this.notiStore.triggerNotification('Data Is Required')
                return null
            }

            const isSuccess: number | null = await handleStoreEdit<
                number | null,
                ChangePasswordInputsType,
                never,
                UserState
            >({
                store: this,
                apiCall: handleChangePassword,
                data,
                defaultError: 'حدثت مشكلة اثناء تغيير كلمة مرور المستخدم',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage)
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'تم تغير الباسورد بنجاح')
            }

            return isSuccess
        },

        async getUserById(force: boolean = false): Promise<UserDataResponse | null> {
            const isSuccess: UserDataResponse | null = await handleStoreFetch<
                UserDataResponse,
                unknown,
                UserState
            >({
                store: this,
                apiCall: handleFindUserById,
                targetKey: 'userInfo',
                defaultError: 'حدثت مشكلة اثناء جلب بيانات المستخدم!',
                force,
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage)
            }

            return isSuccess
        },

        async getSessionsByUserId({
            sortBy = 'expires_at',
            sortOrder = 'ASC' as OrderingEnum,
            force = false,
        }: SortedSessionRequest & { force?: boolean } = {}): Promise<
            UserSessionDataResponse[] | null
        > {
            return handleStoreFetch<UserSessionDataResponse[], SortedSessionRequest, UserState>({
                store: this,
                apiCall: handleGetSessionsByUserId,
                args: [{ sortBy, sortOrder }],
                targetKey: 'sessions',
                defaultError: 'حدثت مشكلة اثناء جلب جلسات المستخدم!',
                force,
            })
        },

        async removeSessionById(sessionId: string | number): Promise<boolean> {
            return handleStoreDelete<null, string, UserState>({
                store: this,
                apiCall: handleRemoveSessionById as any,
                id: sessionId as any,
                listKey: 'sessions',
                defaultError: 'حدث خطأ اثناء حذف جلسة المستخدم!',
            })
        },

        async uploadAvatar(data: FormData): Promise<UserDataResponse | null> {
            if (!data) {
                this.notiStore.triggerNotification('Data Is Required')
                return null
            }

            const isSuccess: UserDataResponse | null = await handleStoreEdit<
                UserDataResponse,
                FormData,
                never,
                UserState
            >({
                store: this,
                apiCall: handleUploadAvatar,
                data,
                listKey: 'userInfo',
                defaultError: 'حدثت مشكلة اثناء رفع صورة الافاتار!',
            })

            if (isSuccess && Object.keys(isSuccess).length > 0) {
                this.notiStore.triggerNotification(this.successMessage || 'تم رفع الصوره بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage)
            }

            return isSuccess
        },

        async deleteAvatar(): Promise<boolean> {
            const isSuccess: boolean = await handleStoreDelete<UserDataResponse, never, UserState>({
                store: this,
                apiCall: handleDeleteAvatar,
                listKey: 'userInfo',
                defaultError: 'حدث خطأ اثناء حذف صورة المستخدم!',
            })

            if (isSuccess) {
                this.notiStore.triggerNotification(this.successMessage || 'تم حذف الصوره بنجاح')
            } else {
                this.notiStore.triggerNotification(this.errorMessage)
            }

            return isSuccess
        },

        async setAvatarFromHistory(avatarUrl: string): Promise<UserDataResponse | null> {
            if (!avatarUrl) {
                this.notiStore.triggerNotification('avatar Url is required')
                return null
            }

            const isSuccess: UserDataResponse | null = await handleStoreEdit<
                UserDataResponse,
                string,
                never,
                UserState
            >({
                store: this,
                apiCall: handleSetAvatarFromHistory,
                data: avatarUrl,
                listKey: 'userInfo',
                defaultError: 'حدثت مشكلة أثناء تعيين الصورة من السجل!',
            })

            if (!isSuccess) {
                this.notiStore.triggerNotification(this.errorMessage)
            } else {
                this.notiStore.triggerNotification(this.successMessage || 'تم استرجاع الصوره بنجاح')
            }

            return isSuccess
        },

        async setFilters(
            newFilters: Partial<SortedSessionRequest>,
        ): Promise<UserSessionDataResponse[] | null> {
            this.filters = { ...this.filters, ...newFilters }
            return await this.getSessionsByUserId({ ...this.filters })
        },

        async setSort(column: string): Promise<UserSessionDataResponse[] | null> {
            if (this.filters.sortBy === column) {
                this.filters.sortOrder =
                    this.filters.sortOrder === 'ASC'
                        ? ('DESC' as OrderingEnum)
                        : ('ASC' as OrderingEnum)
            } else {
                this.filters.sortBy = column
                this.filters.sortOrder = 'ASC' as OrderingEnum
            }

            return await this.getSessionsByUserId({ ...this.filters })
        },
    },
})
