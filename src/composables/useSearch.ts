import type { SearchParamsType, SearchResultData } from '@/types/globalTypes'

export const handleSearch = async <TData>({
    searchInput,
    notiStore,
    targetStore,
    apiCallById,
    apiCallAll,
    apiCallByName,
    defaultErrorMsg = 'Not found!',
}: SearchParamsType<TData>): Promise<SearchResultData | false> => {
    const data: SearchResultData = {
        targetId: null,
        rawValue: null,
    }

    // ✅ حماية ضد الـ Objects والـ Vue Refs
    const rawInput =
        typeof searchInput === 'object' && searchInput !== null && 'value' in searchInput
            ? (searchInput as any).value
            : searchInput

    const rawValue: string =
        typeof rawInput === 'string' || typeof rawInput === 'number' ? String(rawInput).trim() : ''
    if (!rawValue) return false

    const targetId: number = Number(rawValue)
    const isId: boolean =
        Number.isInteger(targetId) && targetId > 0 && String(targetId) === rawValue

    if (!isId && rawValue.length < 3) {
        notiStore('حقل البحث بالاسم يجب ألا يكون أصغر من 3 حروف !')
        return false
    }

    if (isId) {
        console.log('Value type:1', typeof rawValue, rawValue)
        const foundItemById = await apiCallById(targetId)

        // فحص وجود البيانات مباشرة لأن الدالة بترجع العنصر نفسه مش Wrapper
        const hasItem = Boolean(
            foundItemById &&
            (Array.isArray(foundItemById)
                ? foundItemById.length > 0
                : Object.keys(foundItemById).length > 0),
        )

        if (!hasItem) {
            targetStore.errorMessage = defaultErrorMsg
            await apiCallAll(true)
            data.targetId = null
            data.rawValue = null
        } else {
            data.targetId = targetId
            data.rawValue = null
        }
    } else {
        console.log('Value type3:', typeof rawValue, rawValue)
        await apiCallByName(rawValue, true)
        data.targetId = null
        data.rawValue = rawValue
    }

    return data
}
