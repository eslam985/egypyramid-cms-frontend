import { defineStore } from 'pinia'
import { handleStoreDelete, handleStoreEdit, handleStoreFetch } from '@/utils/store'

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

import type { UpdateUserInputsType, ChangePasswordInputsType } from '@/schemas/authSchema'
import type {
    BaseStore,
    UserDataResponse,
    UserSessionDataResponse,
    SortedSessionRequest,
    OrderingEnum,
} from '@/types/globalTypes'

export interface UserState extends BaseStore {
    userInfo: UserDataResponse | null
    sessions: UserSessionDataResponse[]
    filters: SortedSessionRequest
}

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

    actions: {
        async updateUserInfo(data: UpdateUserInputsType = {}) {
            return handleStoreEdit<UserDataResponse, UpdateUserInputsType, UserState>({
                store: this,
                apiCall: handleUpdateUserInfo,
                data,
                listKey: 'userInfo',
                defaultError: 'حدثت مشكلة اثناء تعديل بيانات المستخدم',
            })
        },

        async ChangePassword(data: ChangePasswordInputsType) {
            return handleStoreEdit<null, ChangePasswordInputsType, UserState>({
                store: this,
                apiCall: handleChangePassword,
                data,
                defaultError: 'حدثت مشكلة اثناء تغيير كلمة مرور المستخدم',
            })
        },

        async getUserById(force = true) {
            return handleStoreFetch<UserDataResponse, unknown, UserState>({
                store: this,
                apiCall: handleFindUserById,
                targetKey: 'userInfo',
                defaultError: 'حدثت مشكلة اثناء جلب بيانات المستخدم!',
                force,
            })
        },

        async getSessionsByUserId(
            {
                sortBy = 'expires_at',
                sortOrder = 'ASC' as OrderingEnum,
                force = true,
            }: SortedSessionRequest & { force?: boolean } = {},
        ) {
            return handleStoreFetch<UserSessionDataResponse[], SortedSessionRequest, UserState>({
                store: this,
                apiCall: handleGetSessionsByUserId,
                args: [{ sortBy, sortOrder }],
                targetKey: 'sessions',
                defaultError: 'حدثت مشكلة اثناء جلب جلسات المستخدم!',
                force,
            })
        },

        async removeSessionById(sessionId: string | number) {
            return handleStoreDelete<null, UserState>({
                store: this,
                apiCall: handleRemoveSessionById as any,
                id: sessionId as any,
                listKey: 'sessions',
                defaultError: 'حدث خطأ اثناء حذف جلسة المستخدم!',
            })
        },

        async uploadAvatar(data: FormData) {
            return handleStoreEdit<UserDataResponse, FormData, UserState>({
                store: this,
                apiCall: handleUploadAvatar,
                data,
                listKey: 'userInfo',
                defaultError: 'حدثت مشكلة اثناء رفع صورة الافاتار!',
            })
        },

        async deleteAvatar() {
            return handleStoreDelete<UserDataResponse, UserState>({
                store: this,
                apiCall: handleDeleteAvatar,
                listKey: 'userInfo',
                defaultError: 'حدث خطأ اثناء حذف صورة المستخدم!',
            })
        },

        async setAvatarFromHistory(avatarUrl: string) {
            return handleStoreEdit<UserDataResponse, string, UserState>({
                store: this,
                apiCall: handleSetAvatarFromHistory,
                data: avatarUrl,
                listKey: 'userInfo',
                defaultError: 'حدثت مشكلة أثناء تعيين الصورة من السجل!',
            })
        },

        async setFilters(newFilters: Partial<SortedSessionRequest>) {
            this.filters = { ...this.filters, ...newFilters }
            return await this.getSessionsByUserId({ ...this.filters })
        },

        async setSort(column: string) {
            if (this.filters.sortBy === column) {
                this.filters.sortOrder = this.filters.sortOrder === 'ASC' ? 'DESC' as OrderingEnum : 'ASC' as OrderingEnum
            } else {
                this.filters.sortBy = column
                this.filters.sortOrder = 'ASC' as OrderingEnum
            }

            return await this.getSessionsByUserId({ ...this.filters })
        },
    },
})
