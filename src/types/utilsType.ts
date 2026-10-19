import { useNotificationStore } from '@/stores/notificationStore'

import type { BaseApiResponse } from '@/types/globalTypes'
import type { BaseStore } from '@/types/storeType'

export interface ConfirmAndDeleteParams {
    message?: string
    action: () => Promise<boolean> | boolean
    store?: BaseStore | null
    notiStore: {
        triggerConfirm: (msg: string) => Promise<boolean> | boolean
        triggerNotification: (msg: string, ...args: unknown[]) => void
    }
    onSuccess?: () => Promise<unknown> | unknown
    fallbackSuccess?: string
    fallbackError?: string
}

export interface StoreFetchParams<
    TData = unknown,
    TInput = unknown,
    TStore extends BaseStore = BaseStore,
> {
    store?: TStore
    apiCall: (
        ...args: any[]
    ) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>
    args?: TInput[] | TInput | undefined
    targetKey?: keyof TStore
    defaultError?: string
    paginationKey?: keyof TStore
    force?: boolean
}

export interface StoreAddParams<
    TData = unknown,
    TInput = unknown,
    TStore extends BaseStore = BaseStore,
> {
    store?: TStore
    apiCall: (
        ...args: any[]
    ) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>

    id?: number | string
    data: TInput
    listKey?: keyof TStore
    defaultError?: string
    force?: boolean
}

export interface StoreEditParams<
    TData = unknown,
    TInput = unknown,
    TId = number | string, // 👈 نوع الـ ID أصلح Generic
    TStore extends BaseStore = BaseStore,
> {
    store?: TStore
    apiCall:
        | ((
              id: TId,
              data: TInput,
          ) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
        | ((data: TInput) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)
        | ((id: TId) => Promise<BaseApiResponse<TData | null>> | BaseApiResponse<TData | null>)

    id?: TId
    data?: TInput
    listKey?: keyof TStore
    idKey?: keyof TData
    defaultError?: string
}

export interface StoreDeleteParams<
    TData = unknown,
    TId extends number | string | (number | string)[] = number | string,
    TStore extends BaseStore = BaseStore,
> {
    store?: TStore
    apiCall: (...args: any[]) => Promise<any> | any
    id?: TId
    listKey?: keyof TStore
    idKey?: keyof TData
    defaultError?: string
    filterFn?: (items: TData[]) => TData[]
}

export interface ExportStoreParams<TInput = unknown, TStore extends BaseStore = BaseStore> {
    store?: TStore
    apiCall: (...args: any[]) => Promise<any> | any
    args?: TInput
    defaultFileName?: string
    defaultError?: string
}

export interface SearchParamsType<TData = unknown> {
    searchInput?: string | number | null
    notiStore: ReturnType<typeof useNotificationStore>
    targetStore: {
        errorMessage: string
    }
    apiCallById: (id: number) => Promise<TData | null> | TData | null
    apiCallAll: (force?: boolean) => Promise<TData[] | TData | null> | TData[] | TData | null
    apiCallByName: (
        name: string,
        force?: boolean,
    ) => Promise<TData | TData[] | null> | TData | TData[] | null
    defaultErrorMsg?: string
}

export interface SearchResultData {
    targetId: number | null
    rawValue: string | null
}
