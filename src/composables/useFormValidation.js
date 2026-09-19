import { ref, unref } from 'vue'

export function useFormValidation(schema) {
  const errors = ref({})

  const validate = (formData) => {
    errors.value = {}
    const result = unref(schema).safeParse(formData)
    if (!result.success) {
      // تحويل أخطاء Zod إلى كائن بسيط: { fieldName: "رسالة الخطأ" }
      const fieldErrors = result.error.flatten().fieldErrors
      for (const field in fieldErrors) {
        errors.value[field] = fieldErrors[field][0]
      }
      return { isValid: false, data: null }
    }

    return { isValid: true, data: result.data }
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
