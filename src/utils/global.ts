import type { dataType, ConfirmAndDeleteParams } from '@/types/globalTypes'

// أضفنا : string في الآخر لإجبار الدالة على إرجاع نص دائماً
const formatDate = (dateStr: dataType): string => {
    if (!dateStr) return '-'

    const d: Date = new Date(dateStr)

    // التعديل هنا: استخدمنا Number.isNaN لأن دالة getTime ترجع رقماً
    if (Number.isNaN(d.getTime())) return '-'

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const time = d.toLocaleTimeString('en-US', { timeStyle: 'short' })

    return `${year}/${month}/${day}, ${time}`
}

// 2. قمنا بكتابة الدالة وجعلناها تلتزم بالعقد المقيد أعلاه
async function confirmAndDelete({
    message = 'هل أنت متأكد من عملية الحذف؟',
    action,
    store,
    notiStore,
    onSuccess,
    fallbackSuccess = 'تم الحذف بنجاح',
    fallbackError = 'حدث خطأ أثناء الحذف',
}: ConfirmAndDeleteParams): Promise<boolean> {
    // ننتظر قرار المستخدم من الـ Modal
    const isConfirmed: boolean = await notiStore.triggerConfirm(message)
    if (!isConfirmed) return false

    const success: boolean = await action()

    if (success) {
        notiStore.triggerNotification(store?.successMessage || fallbackSuccess)
        if (typeof onSuccess === 'function') {
            await onSuccess()
        }
        return true
    } else {
        notiStore.triggerNotification(store?.errorMessage || fallbackError)
        return false
    }
}


function sortByProperty<T>(
    arr: T[],
    key: keyof T,
    asc: boolean = true
): T[] {
    return [...arr].sort((a, b) => {
        const valA: T[keyof T] = a[key]
        const valB: T[keyof T] = b[key]

        // 1. التعامل مع القيم الفارغة (null / undefined) وإرسالها للنهاية
        if (valA == null && valB == null) return 0
        if (valA == null) return asc ? 1 : -1
        if (valB == null) return asc ? -1 : 1

        let comparison: number = 0

        // 2. إذا كانت القيم أرقاماً حقيقية
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB
        }
        // 3. للنصوص والأنواع الأخرى نستخدم localeCompare
        else {
            const strA = String(valA)
            const strB = String(valB)

            comparison = strA.localeCompare(strB, undefined, {
                numeric: true,      // يضمن ترتيب "الموسم 2" قبل "الموسم 10"
                sensitivity: 'base' // يتجاهل الفروق بين الحروف الكبيرة والصغيرة والتشكيل
            })
        }

        return asc ? comparison : -comparison
    })
}
/*
// 1. ترتيب المواسم بالرقم
this.seasons = sortByProperty(seasonsList, 'season_number')

// 2. ترتيب العناوين أبجدياً بالأسم (نصوص)
this.episodes = sortByProperty(episodesList, 'title')

// 3. ترتيب تنازلي بناءً على تاريخ الإنشاد أو أي نص/رقم آخر
this.media = sortByProperty(mediaList, 'created_at', false)
*/

export { formatDate, confirmAndDelete, sortByProperty }
