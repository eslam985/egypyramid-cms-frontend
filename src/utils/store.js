export async function handleStoreDelete({
  store,
  apiCall,
  id,
  listKey,
  idKey = 'id',
  defaultError = 'حدث خطأ أثناء الحذف',
  filterFn = null, // هنضيف ده
}) {
  store.isLoading = true
  store.successMessage = ''
  store.errorMessage = ''
  try {
    const result = id!== undefined? await apiCall(id) : await apiCall()
    if (result.success) {
      store.successMessage = result.message
      if (listKey && Array.isArray(store[listKey])) {
        if (filterFn) {
          store[listKey] = filterFn(store[listKey])
        } else if (Array.isArray(id)) {
          const idsSet = new Set(id)
          store[listKey] = store[listKey].filter((item) =>!idsSet.has(item[idKey]))
        } else {
          store[listKey] = store[listKey].filter((item) => item[idKey]!== id)
        }
      }
      return true
    } else {
      store.errorMessage = result.message
      return false
    }
  } catch (err) {
    store.errorMessage = err?.response?.data?.message || defaultError
    console.error(err)
    return false
  } finally {
    store.isLoading = false
  }
}

export async function handleStoreEdit({
  store,
  apiCall,
  id,
  data,
  listKey,
  idKey = 'id',
  defaultError = 'حدث خطأ اثناء التعديل!',
}) {
  store.isLoading = true
  store.successMessage = ''
  store.errorMessage = ''
  try {
    const result = await apiCall(id, data)
    if (result.success) {
      store.successMessage = result.message

      // تحديث العنصر في القائمة إن وجدت
      if (listKey && Array.isArray(store[listKey])) {
        const index = store[listKey].findIndex((item) => item[idKey] === id)
        if (index !== -1) {
          store[listKey][index] = result.data
        }
      }

      return result.data
    } else {
      store.errorMessage = result.message
      return null
    }
  } catch (err) {
    store.errorMessage = err?.response?.data?.message || defaultError
    console.error(err)
    return null
  } finally {
    store.isLoading = false
  }
}

export async function handleStoreAdd({
  store,
  apiCall,
  id,
  data,
  listKey,
  defaultError = 'حدث خطأ اثناء الإضافة!',
}) {
  store.isLoading = true
  store.successMessage = ''
  store.errorMessage = ''
  try {
    // فحص ما إذا كان هناك id ممرر أم نرسل data فقط
    const result = id !== undefined ? await apiCall(id, data) : await apiCall(data)

    if (result.success) {
      store.successMessage = result.message

      if (listKey && Array.isArray(store[listKey])) {
        store[listKey].push(result.data)
      }

      return result.data
    } else {
      store.errorMessage = result.message
      return null
    }
  } catch (err) {
    store.errorMessage = err?.response?.data?.message || defaultError
    console.error(err)
    return null
  } finally {
    store.isLoading = false
  }
}

export async function handleStoreFetch({
  store,
  apiCall,
  args,
  targetKey,
  paginationKey = 'pagination',
  defaultError = 'حدث خطأ أثناء جلب البيانات',
  force = false, // خيار لتجاوز الكاش وإجبار الريكويست عند الحاجة
}) {
  // 1. فحص الكاش: إذا لم يتم طلب التحديث الإجباري وكانت البيانات موجودة مسبقاً
  if (!force && targetKey && store[targetKey] !== null && store[targetKey] !== undefined) {
    const hasData = Array.isArray(store[targetKey])
      ? store[targetKey].length > 0
      : Object.keys(store[targetKey]).length > 0

    if (hasData) {
      return store[targetKey]
    }
  }

  store.isLoading = true
  store.successMessage = ''
  store.errorMessage = ''
  try {
    let result
    if (args !== undefined) {
      result = Array.isArray(args) ? await apiCall(...args) : await apiCall(args)
    } else {
      result = await apiCall()
    }

    if (result.success) {
      store.successMessage = result.message

      if (targetKey) {
        store[targetKey] = result.data
      }

      if (paginationKey && result.pagination !== undefined) {
        store[paginationKey] = result.pagination
      }

      return result.data
    } else {
      store.errorMessage = result.message
      return null
    }
  } catch (err) {
    store.errorMessage = err?.response?.data?.message || defaultError
    console.error(err)
    return null
  } finally {
    store.isLoading = false
  }
}
