import { ref, unref, type MaybeRef } from 'vue'
import { z } from 'zod'

// ✅ التعديل الأول: استخدمنا z.ZodType<T> بدلاً من ZodSchema المهجورة
export function useFormValidation<T>(schema: MaybeRef<z.ZodType<T>>) {

  // كائن الأخطاء مفاتيحه هي نفس حقول الفورم وقيمها نصوص (رسائل الخطأ)
  const errors = ref<Partial<Record<keyof T, string>>>({})

  const validate = (formData: unknown) => {
    errors.value = {}

    // فك الـ ref وعمل الفحص
    const result = unref(schema).safeParse(formData)

        if (!result.success) {
      // ✅ الحل الصحيح: استخدام .issues المخصصة لمصفوفة أخطاء Zod
      result.error.issues.forEach((err) => {
        // استخراج اسم الحقل (مثل email أو password) من أول خانة في المسار
        const field = err.path[0] as keyof T;

        if (field) {
          // تخزين رسالة الخطأ الصريحة للحقل
          errors.value[field] = err.message;
        }
      });

      return { isValid: false, data: null };
    }


    // في حال النجاح، الداتا مضمونة 100% أنها تتبع القالب T
    return { isValid: true, data: result.data as T }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    errors,
    validate,
    clearErrors,
  }
}
