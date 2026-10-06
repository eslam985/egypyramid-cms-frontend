import type { dataType,  ConfirmAndDeleteParams} from "@/types/globalTypes"

// أضفنا : string في الآخر لإجبار الدالة على إرجاع نص دائماً
const formatDate = (dateStr: dataType): string => {
  if (!dateStr) return '-';

  const d = new Date(dateStr);

  // التعديل هنا: استخدمنا Number.isNaN لأن دالة getTime ترجع رقماً
  if (Number.isNaN(d.getTime())) return '-';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = d.toLocaleTimeString('en-US', { timeStyle: 'short' });

  return `${year}/${month}/${day}, ${time}`;
};


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
  const isConfirmed = await notiStore.triggerConfirm(message);
  if (!isConfirmed) return false;

  const success = await action();

  if (success) {
    notiStore.triggerNotification(store?.successMessage || fallbackSuccess);
    if (typeof onSuccess === 'function') {
      await onSuccess();
    }
    return true;
  } else {
    notiStore.triggerNotification(store?.errorMessage || fallbackError);
    return false;
  }
}


export { formatDate, confirmAndDelete }
