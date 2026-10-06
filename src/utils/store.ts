import type {
  ExportStoreParams,
  StoreFetchParams,
  StoreAddParams,
  StoreEditParams,
  StoreDeleteParams
} from '@/types/globalTypes'


export async function handleStoreDelete({
  store,
  apiCall,
  id,
  listKey,
  idKey = 'id',
  defaultError = 'حدث خطأ أثناء الحذف',
  filterFn = null,
}: StoreDeleteParams): Promise<boolean> { // ✅ أضفنا نوع المخرجات الصريح للدالة

  if (!store) throw new Error('store is undefined or null');

  store.isLoading = true;
  store.successMessage = '';
  store.errorMessage = '';

  try {
    const result = id !== undefined ? await apiCall(id) : await apiCall();

    if (result && result.success) {
      store.successMessage = result.message;

      if (listKey) {
        if (Array.isArray(store[listKey])) {
          if (filterFn) {
            store[listKey] = filterFn(store[listKey]);
          } else if (Array.isArray(id)) {
            const idsSet = new Set(id);
            store[listKey] = store[listKey].filter((item: any) => !idsSet.has(item[idKey]));
          } else {
            store[listKey] = store[listKey].filter((item: any) => item[idKey] !== id);
          }
        } else if (store[listKey] !== null && typeof store[listKey] === 'object') {
          if (result.data) {
            store[listKey] = { ...store[listKey], ...result.data };
          }
        }
      }
      return true;
    }

    // ✅ التعديل: في حال عودة result ولكن success بـ false نضع حقل الـ errorMessage ونرجع false
    store.errorMessage = result?.message || defaultError;
    return false;

  } catch (err) {
    store.errorMessage = (err as any)?.response?.data?.message || defaultError;
    console.error(err);
    return false;
  } finally {
    store.isLoading = false;
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
}: StoreEditParams): Promise<any> {
  // ✅ التعديل: أضفنا نوع المخرجات الصريح Promise<any>

  if (!store) throw new Error('store is undefined or null')

  store.isLoading = true
  store.successMessage = ''
  store.errorMessage = ''

  try {
    // ✅ التعديل: تأكدنا أن id و data موجودين يقيناً لتضييق الأنواع (Type Narrowing)
    if ((!id && !data) || !data) return null

    const result = await apiCall(id, data)
    console.log('الهيكل الفعلي لـ result داخل الـ Util:', result)

    if (result && result.success) {
      store.successMessage = result.message

      if (listKey) {
        if (Array.isArray(store[listKey])) {
          // التايب سكريبت هنا يضمن 100% أن id ليس undefined بفضل شرط الحماية بالأعلى
          const index = store[listKey].findIndex((item: any) => item[idKey] === id)
          if (index !== -1) {
            store[listKey][index] = result.data
          }
        } else if (store[listKey] !== null && typeof store[listKey] === 'object') {
          store[listKey] = { ...store[listKey], ...result.data }
        } else {
          store[listKey] = result.data
        }
      }

      return result.data !== undefined ? result.data : true
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

export async function handleStoreAdd({
  store,
  apiCall,
  id,
  data,
  listKey,
  defaultError = 'حدث خطأ اثناء الإضافة!',
}: StoreAddParams): Promise<any> {
  if (!store) throw new Error('store is undefined or null')

  store.isLoading = true
  store.successMessage = ''
  store.errorMessage = ''
  try {
    const result =
      id !== undefined && data !== undefined ? await apiCall(id, data) : await apiCall(data ?? {})

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
    store.errorMessage = (err as any)?.response?.data?.message || defaultError
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
  force = false,
}: StoreFetchParams): Promise<any> {
  // ✅ أضفنا نوع المخرجات الصريح للدالة

  const currentArgsStr = args ? JSON.stringify(args) : ''
  if (!store) throw new Error('store is undefined or null')

  // ✅ التعديل: تأكدنا أولاً أن targetKey ممرر وله قيمة (targetKey && ...) لتجنب أخطاء المفاتيح الفارغة
  if (
    !force &&
    targetKey &&
    store[targetKey] !== null &&
    store[targetKey] !== undefined &&
    store._lastFetchArgs === currentArgsStr
  ) {
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

    if (result && result.success) {
      store.successMessage = result.message

      if (targetKey) {
        store[targetKey] = result.data
      }

      if (paginationKey && result.pagination !== undefined) {
        store[paginationKey] = result.pagination
      }

      store._lastFetchArgs = currentArgsStr
      return result.data
    } else {
      store.errorMessage = result?.message || defaultError
      return null
    }
  } catch (err) {
    // ✅ التعديل: تحويل err إلى any لقراءة الـ response بأمان تحت الوضع الصارم
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
export async function handleStoreExport({
  store,
  apiCall,
  args,
  defaultFileName = 'export.csv',
  defaultError = 'حدث خطأ أثناء تصدير البيانات',
}: ExportStoreParams): Promise<boolean> {
  // أضفنا نوع المخرجات الصريح : Promise<boolean>

  if (!store) throw new Error('store is undefined or null')

  store.isLoading = true
  store.successMessage = ''
  store.errorMessage = ''

  try {
    let blobData
    if (args !== undefined) {
      blobData = Array.isArray(args) ? await apiCall(...args) : await apiCall(args)
    } else {
      blobData = await apiCall()
    }

    const url: string = window.URL.createObjectURL(
      new Blob([blobData], { type: 'text/csv;charset=utf-8;' }),
    )
    const link: HTMLAnchorElement = document.createElement('a')
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
