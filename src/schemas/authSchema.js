import { z } from 'zod'
import { nameRe } from '@/utils/regex'

export const createUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
        .max(30, 'اسم المستخدم يجب ألا يتجاوز 30 حرفاً')
        .regex(nameRe, 'اسم المستخدم يحتوي على رموز غير مسموحة'),
    email: z
        .string()
        .trim()
        .lowercase()
        .email('البريد الإلكتروني غير صالح'),
    password: z
        .string()
        .trim()
        .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
        .max(100, 'كلمة المرور طويلة جداً'),
})

// التعديل هنا: استخدام .partial() مباشرة على السكيما بدون params أو body
export const updateUserSchema = createUserSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'يجب تعديل حقل واحد على الأقل للتحديث' }
)

export const loginSchema = z.object({
    email: z.string().trim().lowercase().email('البريد الإلكتروني غير صالح'),
    password: z.string().trim().min(1, 'كلمة المرور مطلوبة'),
})
