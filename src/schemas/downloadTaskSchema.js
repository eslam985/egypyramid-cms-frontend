import { z } from 'zod'

const baseTaskSchema = z.object({
  task_name: z.string().trim().min(2).max(50),
  source_url: z.string().trim().url('رابط المصدر غير صحيح'),
  status: z.enum(['idle', 'processing', 'failed'], {
    errorMap: () => ({ message: 'status must be only [ idle, processing, failed ]' }),
  }),
  progress_percent: z.number().int().min(0).max(100),
  download_speed: z.string().trim(),
  status_message: z.string().trim(),
  is_cancelled: z.boolean(),
  trailer_url: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().trim().url('رابط العرض غير صحيح').nullish(),
  ),
  fallback_urls: z.array(z.string().trim().url('رابط غير صحيح')).nullable().optional(),
})

// سكيما إنشاء التاسك (تضيف القيم الافتراضية على الـ Base Schema)
const createTaskSchema = baseTaskSchema.extend({
  status: baseTaskSchema.shape.status.default('idle'),
  progress_percent: baseTaskSchema.shape.progress_percent.default(0),
  download_speed: baseTaskSchema.shape.download_speed.default('0 MB/s'),
  status_message: baseTaskSchema.shape.status_message.default('Waiting...'),
  is_cancelled: baseTaskSchema.shape.is_cancelled.default(false),
})

// سكيما التحديث (تأخذ الـ Base Schema وتجعلها Partial بدون أي .default زائف)
const UpdateTaskByIdSchema = baseTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'يجب إرسال حقل واحد على الأقل للتحديث',
  })

export { createTaskSchema, UpdateTaskByIdSchema }
