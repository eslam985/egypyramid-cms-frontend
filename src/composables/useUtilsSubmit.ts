import type { ValidationResult } from '@/types/globalTypes'
import { toRaw } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
const notiStore = useNotificationStore()

export const utilsSubmit = async <TInputs, TResponse>(
    id: number | undefined,
    formData: TInputs,
    validateSchema: (data: any) => ValidationResult,
    apiCall:
        | ((data: TInputs) => Promise<TResponse | null>)
        | ((id: number, data: TInputs) => Promise<TResponse | null>),
    onSuccess?: () => Promise<unknown> | unknown,
): Promise<TResponse | null> => {

    if (!formData) {
        notiStore.triggerNotification('يجب ارسال بيانات اولا!')
        return null
    }

    const rawFormData: TInputs = toRaw(formData)

    const { isValid, data } = validateSchema(rawFormData)

    if (!isValid || !data) return null

    const isSuccess: Awaited<TResponse> | null =
        id !== undefined
            ? await (apiCall as (id: number, data: TInputs) => Promise<TResponse | null>)(id, data)
            : await (apiCall as (data: TInputs) => Promise<TResponse | null>)(data)

    if (isSuccess && isSuccess !== null) {
        if (typeof onSuccess === 'function') {
            await onSuccess()
        }
    }

    return isSuccess
}
