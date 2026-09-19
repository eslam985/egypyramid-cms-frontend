const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('ar-EG', {
    dateStyle: 'short',
  })
}

async function confirmAndDelete({
  message = 'هل أنت متأكد من عملية الحذف؟',
  action, // دالة الحذف القادمة من الـ Store
  store, // الـ Store الخاص بالعنصر لقراءة الرسائل منه
  notiStore, // الـ Store الخاص بالإشعارات
  onSuccess, // callback اختياري (مثل router.push أو تنظيف بيانات)
  fallbackSuccess = 'تم الحذف بنجاح',
  fallbackError = 'حدث خطأ أثناء الحذف',
}) {
  // ننتظر قرار المستخدم من الـ Modal
  const isConfirmed = await notiStore.triggerConfirm(message)
  if (!isConfirmed) return false

  const success = await action()

  if (success) {
    notiStore.triggerNotification(store?.successMessage || fallbackSuccess)
    if (typeof onSuccess === 'function') await onSuccess()
    return true
  } else {
    notiStore.triggerNotification(store?.errorMessage || fallbackError)
    return false
  }
}

export { formatDate, confirmAndDelete }
