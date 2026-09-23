export const handleSearch = async ({
  searchInput,
  notiStore,
  targetStore,
  apiCallById,
  apiCallAll,
  apiCallByName,
  defaultErrorMsg = 'Not found!',
}) => {
  let data = {}
  const rawValue = searchInput.value.trim()
  if (!rawValue) return false

  // التحقق هل القيمة رقم صحيح صافي (بدون علامات عشرية أو حروف)
  const targetId = Number(rawValue)
  const isId = Number.isInteger(targetId) && String(targetId) === rawValue

  if (!isId && rawValue.length < 3) {
    notiStore('حقل البحث بالاسم يجب ألا يكون أصغر من 3 حروف !')
    searchInput.value = ''
    return false
  }
  if (isId) {
    const foundItemById = await apiCallById(targetId)
    if (!foundItemById || foundItemById.length < 1 || Object.keys(foundItemById).length < 1) {
      targetStore.errorMessage = targetStore.errorMessage ?? defaultErrorMsg
      await apiCallAll(true)
      data.targetId = null
      data.rawValue = null
    }

    if (foundItemById) {
      if (foundItemById?.length > 0 || Object.keys(foundItemById)?.length > 0) {
        data.targetId = targetId
        data.rawValue = null
      }
    }
  } else {
    await apiCallByName(rawValue, true)
    data.targetId = null
    data.rawValue = rawValue
  }

  searchInput.value = ''
  return data
}
