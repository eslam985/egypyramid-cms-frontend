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
    const result = id !== undefined ? await apiCall(id) : await apiCall()
    if (result.success) {
      store.successMessage = result.message

      if (listKey) {
        if (Array.isArray(store[listKey])) {
          // كود المصفوفات الحالي الخاص بك (سليم 100%)
          if (filterFn) {
            store[listKey] = filterFn(store[listKey])
          } else if (Array.isArray(id)) {
            const idsSet = new Set(id)
            store[listKey] = store[listKey].filter((item) => !idsSet.has(item[idKey]))
          } else {
            store[listKey] = store[listKey].filter((item) => item[idKey] !== id)
          }
        } else if (store[listKey] !== null && typeof store[listKey] === 'object') {
          // 💡 بما أن السيرفر أرسل الكائن الجديد، نحدث الـ userInfo به فوراً هنا!
          if (result.data) {
            // 💡 نقوم بدمج البيانات الجديدة مع الحفاظ على بقية بيانات المستخدم القديمة
            store[listKey] = { ...store[listKey], ...result.data }
          }
        }
      }
      return true
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
    if ((!id && !data) || !data) return null

    const result = id && data ? await apiCall(id, data) : await apiCall(data)
    console.log('الهيكل الفعلي لـ result داخل الـ Util:', result)

    if (result.success) {
      store.successMessage = result.message

      // تحديث العنصر في القائمة إن وجدت
      // تحديث العنصر في القائمة أو الكائن إن وجد
      if (listKey) {
        if (Array.isArray(store[listKey])) {
          // تحديث العنصر داخل المصفوفة (كودك الحالي سليم جداً)
          const index = store[listKey].findIndex((item) => item[idKey] === id)
          if (index !== -1) {
            store[listKey][index] = result.data
          }
        } else if (store[listKey] !== null && typeof store[listKey] === 'object') {
          // 💡 إذا كان كائناً مفرداً (مثل userInfo)، نقوم بدمج التعديلات الجديدة مع الحفاظ على البيانات القديمة
          store[listKey] = { ...store[listKey], ...result.data }
        } else {
          // 💡 حالة احتياطية: إذا كانت القيمة الابتدائية null تماماً ولم يتم قراءتها ككائن بعد
          store[listKey] = result.data
        }
      }

      return result.data !== undefined ? result.data : true
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


/**
 * دالة عامة وموحدة لإدارة عمليات تصدير الجداول وتحميلها كملفات CSV
 * مع إدارة حالات الـ Loading ورسائل النجاح والأخطاء للستور الممرر تلقائياً
 */
export async function handleStoreExport({
  store,
  apiCall,
  args,
  defaultFileName = 'export.csv',
  defaultError = 'حدث خطأ أثناء تصدير البيانات'
}) {
  store.isLoading = true
  store.successMessage = ''
  store.errorMessage = ''

  try {
    let blobData
    // 1. استدعاء الـ API وتمرير البارامترات (الفلاتر) إن وجدت بنفس منطق دالتك السابقة
    if (args !== undefined) {
      blobData = Array.isArray(args) ? await apiCall(...args) : await apiCall(args)
    } else {
      blobData = await apiCall()
    }

    // 2. تحويل الـ Blob إلى رابط وهمي في المتصفح والضغط عليه لبدء التحميل فوراً
    const url = window.URL.createObjectURL(new Blob([blobData], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', defaultFileName)

    document.body.appendChild(link)
    link.click()
    link.remove() // كود مباشر وبسيط ويغنيك عن parentNode
    window.URL.revokeObjectURL(url)

    store.successMessage = 'تم تصدير وتحميل الملف بنجاح'
    return true
  } catch (err) {
    store.errorMessage = err?.response?.data?.message || defaultError
    console.error('Export Utility Error:', err)
    return false
  } finally {
    store.isLoading = false
  }
}
