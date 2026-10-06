import type { SearchParamsType, SearchResultData } from '@/types/globalTypes'

export const handleSearch = async ({
  searchInput,
  notiStore,
  targetStore,
  apiCallById,
  apiCallAll,
  apiCallByName,
  defaultErrorMsg = 'Not found!',
}: SearchParamsType): Promise<SearchResultData | false> => {

  let data: SearchResultData = {
    targetId: null,
    rawValue: null,
  }

  const rawValue: string = searchInput.trim()
  if (!rawValue) return false

  const targetId: number = Number(rawValue)
  const isId: boolean = Number.isInteger(targetId) && String(targetId) === rawValue

  if (!isId && rawValue.length < 3) {
    notiStore('حقل البحث بالاسم يجب ألا يكون أصغر من 3 حروف !')
    return false
  }

  if (isId) {
    const foundItemById = await apiCallById(targetId)

    if (!foundItemById || Object.keys(foundItemById).length < 1) {
      targetStore.errorMessage = targetStore.errorMessage ?? defaultErrorMsg
      await apiCallAll(true)
      data.targetId = null
      data.rawValue = null
    } else {
      data.targetId = targetId
      data.rawValue = null
    }
  } else {
    await apiCallByName(rawValue, true)
    data.targetId = null
    data.rawValue = rawValue
  }

  return data 
}
