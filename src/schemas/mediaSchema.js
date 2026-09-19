// /frontend/vue-dashbord/src/schemas/mediaSchema.js
import { z } from 'zod'
import { durationIsoRegex, labelRe } from '@/utils/regex'
// تحويل النص الفارغ إلى null حتى يتجاوز Zod الشروط عند ترك الخانة فارغة
const emptyToNull = (schema) =>
  z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? null : val),
    schema.nullable().optional(),
  )

export const createMediaSchema = z.object({
  // استبدل التعريفات القديمة لهذه الحقول بما يلي:
  tmdb_id: emptyToNull(z.string().trim().min(3).max(20)),
  poster_url: emptyToNull(z.string().trim().url('رابط البوستر غير صالح')),
  story: emptyToNull(z.string().trim().min(8).max(500)),
  rating: emptyToNull(z.string().trim().min(1).max(8)),
  runtime: emptyToNull(z.string().trim().min(3).max(30)),
  labels: emptyToNull(
    z.string().trim().regex(labelRe, 'التصنيفات يجب أن تكون كلمات مفصولة بفواصل'),
  ),
  duration_iso: emptyToNull(
    z.string().trim().regex(durationIsoRegex, 'صيغة duration_iso غير صحيحة (مثال: PT1H30M)'),
  ),
  title: z.string().trim().min(3, 'العنوان يجب ألا يقل عن 3 أحرف').max(100),
  year: z.string().trim().length(4, 'السنة يجب أن تكون 4 أرقام'),
  is_ready: z
    .preprocess((val) => val === true || val === 'true' || val === 'on', z.boolean())
    .default(false),
  is_facebook_posted: z
    .preprocess((val) => val === true || val === 'true' || val === 'on', z.boolean())
    .default(false),
  genres: z.array(z.coerce.number().int().positive()).optional(),

  category: z.enum(['movie', 'tv'], {
    errorMap: () => ({ message: 'النوع يجب أن يكون movie أو tv' }),
  }),

  media_type: z.enum(['movie', 'series'], {
    errorMap: () => ({ message: 'النوع يجب أن يكون movie أو series' }),
  }),
})

export const updateMediaSchema = createMediaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'يجب إرسال حقل واحد على الأقل للتحديث',
  })

export const getMediasQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().max(100).default(10),
    search: z.string().trim().optional(),
    category: z.enum(['movie', 'tv']).optional(),
  }),
})
