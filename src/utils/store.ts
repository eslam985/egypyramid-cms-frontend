import type {
    BaseApiResponse,
    BaseStore,
    ExportStoreParams,
    StoreFetchParams,
    StoreAddParams,
    StoreEditParams,
    StoreDeleteParams,
} from '@/types/globalTypes'

export async function handleStoreDelete<
    TData = unknown,
    TId extends number | string | (number | string)[] = number | string,
    TStore extends BaseStore = BaseStore,
>({
    store,
    apiCall,
    id,
    listKey,
    idKey = 'id' as keyof TData,
    defaultError = 'حدث خطأ أثناء الحذف',
    filterFn,
}: StoreDeleteParams<TData, TId, TStore>): Promise<boolean> {
    if (!store) throw new Error('store is undefined or null')

    store.isLoading = true
    store.successMessage = ''
    store.errorMessage = ''

    try {
        const result =
            id !== undefined && id !== null
                ? await (apiCall as (id: TId) => Promise<BaseApiResponse<TData | null>>)(id)
                : await (apiCall as () => Promise<BaseApiResponse<TData | null>>)()

        if (result && result.success) {
            store.successMessage = result.message
            if (listKey) {
                if (Array.isArray(store[listKey])) {
                    if (filterFn) {
                        ;(store[listKey] as TData[]) = filterFn(store[listKey] as TData[])
                    } else if (Array.isArray(id)) {
                        const idsSet = new Set<unknown>(id)

                        ;(store[listKey] as TData[]) = (store[listKey] as TData[]).filter(
                            (item: TData) =>
                                !idsSet.has((item as Record<string, unknown>)[idKey as string]),
                        )
                    } else {
                        ;(store[listKey] as TData[]) = (store[listKey] as TData[]).filter(
                            (item: TData) =>
                                (item as Record<string, unknown>)[idKey as string] !== id,
                        )
                    }
                } else if (store[listKey] !== null && typeof store[listKey] === 'object') {
                    if (result.data) {
                        store[listKey] = { ...store[listKey], ...result.data }
                    }
                }
            }
            return true
        }

        store.errorMessage = result?.message || defaultError
        return false
    } catch (err) {
        store.errorMessage = (err as any)?.response?.data?.message || defaultError
        console.error(err)
        return false
    } finally {
        store.isLoading = false
    }
}

export async function handleStoreEdit<
    TData = unknown,
    TInput = unknown,
    TId extends number | string = number | string,
    TStore extends BaseStore = BaseStore,
>({
    store,
    apiCall,
    id,
    data,
    listKey,
    idKey = 'id' as keyof TData,
    defaultError = 'حدث خطأ اثناء التعديل!',
}: StoreEditParams<TData, TInput, TId, TStore>): Promise<TData | null> {
    if (!store) throw new Error('store is undefined or null')

    store.isLoading = true
    store.successMessage = ''
    store.errorMessage = ''

    try {
        if (data === undefined || data === null) {
            throw new Error('data argument is required for handleStoreEdit')
        }

        const result =
            id !== undefined && id !== null
                ? await (
                      apiCall as (id: TId, data: TInput) => Promise<BaseApiResponse<TData | null>>
                  )(id, data)
                : await (apiCall as (data: TInput) => Promise<BaseApiResponse<TData | null>>)(data)

        if (result && result.success) {
            store.successMessage = result.message

            if (listKey) {
                const targetList = store[listKey]

                if (Array.isArray(targetList)) {
                    const keyToCompare = (idKey || 'id') as keyof TData
                    const searchId =
                        id !== undefined
                            ? id
                            : (data as Record<string, unknown>)?.[keyToCompare as string]

                    const index = (targetList as TData[]).findIndex(
                        (item: TData) =>
                            (item as Record<string, unknown>)[keyToCompare as string] === searchId,
                    )
                    if (index !== -1 && result.data) {
                        targetList[index] = result.data
                    }
                } else if (targetList !== null && typeof targetList === 'object') {
                    store[listKey] = { ...targetList, ...result.data }
                } else {
                    ;(store[listKey] as TData | null) = result.data
                }
            }

            return result.data !== undefined ? result.data : null
        } else {
            store.errorMessage = result?.message || defaultError
            return null
        }
    } catch (err) {
        store.errorMessage = (err as any)?.response?.data?.message || defaultError
        console.error(err)
        return null
    } finally {
        store.isLoading = false
    }
}

export async function handleStoreAdd<
    TData = unknown,
    TInput = unknown,
    TStore extends BaseStore = BaseStore,
>({
    store,
    apiCall,
    id,
    data,
    listKey,
    defaultError = 'حدث خطأ اثناء الإضافة!',
}: StoreAddParams<TData, TInput, TStore>): Promise<TData | null> {
    if (!store) throw new Error('store is undefined or null')

    store.isLoading = true
    store.successMessage = ''
    store.errorMessage = ''

    try {
        if (data === undefined || data === null)
            throw new Error('data argument is required for handleStoreAdd')

        const result =
            id !== undefined && id !== null
                ? await (
                      apiCall as (
                          id: string | number,
                          data: TInput,
                      ) => Promise<BaseApiResponse<TData>>
                  )(id, data)
                : await (apiCall as (data: TInput) => Promise<BaseApiResponse<TData>>)(data)

        if (result.success) {
            store.successMessage = result.message

            // إذا كان هناك listKey والـ store يحتوي على هذه القائمة
            if (listKey && Array.isArray(store[listKey])) {
                ;(store[listKey] as TData[]).push(result.data)
            }

            return result.data // TypeScript أصبح يعلم أن result.data نوعها TData!
        } else {
            store.errorMessage = result.message
            return null
        }
    } catch (err: any) {
        store.errorMessage = err?.response?.data?.message || defaultError
        console.error(err)
        return null
    } finally {
        store.isLoading = false
    }
}

export async function handleStoreFetch<
    TData = unknown,
    TInput = unknown,
    TStore extends BaseStore = BaseStore,
>({
    store,
    apiCall,
    args,
    targetKey,
    paginationKey = 'pagination' as keyof TStore,
    defaultError = 'حدث خطأ أثناء جلب البيانات',
    force = false,
}: StoreFetchParams<TData, TInput, TStore>): Promise<TData | null> {
    const currentArgsStr = args ? JSON.stringify(args) : ''
    if (!store) throw new Error('store is undefined or null')

    if (
        !force &&
        targetKey &&
        store[targetKey] !== null &&
        store[targetKey] !== undefined &&
        store._lastFetchArgs === currentArgsStr
    ) {
        const targetVal = store[targetKey]
        const hasData = Array.isArray(targetVal)
            ? targetVal.length > 0
            : targetVal && typeof targetVal === 'object'
              ? Object.keys(targetVal).length > 0
              : Boolean(targetVal)

        if (hasData) {
            return store[targetKey] as TData
        }
    }

    store.isLoading = true
    store.successMessage = ''
    store.errorMessage = ''

    try {
        let result
        if (Array.isArray(args) && args.length > 1) {
            const firstArg = args[0] as TInput
            const secondArg = args[1] as TInput

            result = await (
                apiCall as (arg1: TInput, arg2: TInput) => Promise<BaseApiResponse<TData>>
            )(firstArg, secondArg)
        } else if (Array.isArray(args) && args.length === 1) {
            result = await (apiCall as (data: TInput) => Promise<BaseApiResponse<TData>>)(
                args[0] as TInput,
            )
        } else if (args !== undefined && !Array.isArray(args)) {
            result = await (apiCall as (data: TInput) => Promise<BaseApiResponse<TData>>)(args)
        } else {
            result = await (apiCall as () => Promise<BaseApiResponse<TData>>)()
        }

        if (result && result.success) {
            store.successMessage = result.message

            if (targetKey) {
                store[targetKey] = result.data as TStore[keyof TStore]
            }

            if (paginationKey && result.pagination !== undefined) {
                store[paginationKey] = result.pagination as TStore[keyof TStore]
            }

            store._lastFetchArgs = currentArgsStr
            return result.data
        } else {
            store.errorMessage = result?.message || defaultError
            return null
        }
    } catch (err) {
        store.errorMessage = (err as any)?.response?.data?.message || defaultError
        console.error(err)
        return null
    } finally {
        store.isLoading = false
    }
}

/**
 * دالة عامة وموحدة لإدارة عمليات تصدير الجداول وتحميلها كملفات CSV
 * مع إدارة حالات الـ Loading ورسائل النجاح والأخطاء للستور الممرر تلقائياً
 */
export async function handleStoreExport<TInput = unknown, TStore extends BaseStore = BaseStore>({
    store,
    apiCall,
    args,
    defaultFileName = 'export.csv',
    defaultError = 'حدث خطأ أثناء تصدير البيانات',
}: ExportStoreParams<TInput, TStore>): Promise<boolean> {
    if (!store) throw new Error('store is undefined or null')

    store.isLoading = true
    store.successMessage = ''
    store.errorMessage = ''

    try {
        // استدعاء الـ API بمرونة (سواء ممرر args أم لا)
        const response = args !== undefined ? await apiCall(args) : await apiCall()

        // استخراج الداتا الحقيقية (سواء كانت response.data من أكسيوس أو Blob مباشر)
        const blobData =
            typeof response === 'object' && response !== null && 'data' in response
                ? (response as { data: BlobPart }).data
                : (response as BlobPart)

        // التأكد من تحويل البيانات لـ Blob صالح للـ CSV
        const blob =
            blobData instanceof Blob
                ? blobData
                : new Blob([blobData as BlobPart], { type: 'text/csv;charset=utf-8;' })

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', defaultFileName)

        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        store.successMessage = 'تم تصدير وتحميل الملف بنجاح'
        return true
    } catch (err) {
        store.errorMessage = (err as any)?.response?.data?.message || defaultError
        console.error('Export Utility Error:', err)
        return false
    } finally {
        store.isLoading = false
    }
}
