// /src/schemas/authSchema.ts
import { z } from 'zod'
import { nameRe } from '@/utils/regex'
import { RolesList } from '@/utils/roles_list'

// 1️⃣ المخطط الأساسي للمستخدم
export const baseUserSchema = z.object({
    username: z.string().trim().min(3).max(30).regex(nameRe),
    email: z.string().trim().lowercase().pipe(z.email('بريد إلكتروني غير صالح')),

    avatar_url: z.string().url('يجب أن يكون رابط صورة صالح').nullish().or(z.literal('')),
    roles: z
        .enum(
            [String(RolesList.Admin), String(RolesList.Editor), String(RolesList.User)] as const,
            {
                message: 'roles must be only [ 5150, 1984, 2001 ]',
            },
        )
        .default(String(RolesList.User))
        .optional(),
})

// 2️⃣ مخطط إنشاء مستخدم جديد
export const createUserSchema = baseUserSchema.extend({
    password: z.string().trim().min(6).max(100),
})

// 3️⃣ مخطط تحديث بيانات المستخدم
export const updateUserByIdSchema = baseUserSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'يجب إرسال حقل واحد على الأقل للتحديث',
    })

// 4️⃣ مخطط تغيير كلمة المرور
export const changePasswordSchema = z.object({
    currentPassword: z.string().trim().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z
        .string()
        .trim()
        .min(6, 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
        .max(100),
})

// 5️⃣ مخطط تسجيل الدخول
export const loginUserSchema = z.object({
    email: z.string().trim().lowercase().pipe(z.email('بريد إلكتروني غير صالح')),
    password: z.string().trim().min(1, 'كلمة المرور مطلوبة'),
})

// 6️⃣ مخطط حذف الجلسة
export const deleteSessionsBy_uuid = z.object({
    sessionId: z.string().trim(),
})

// ==============================================================
//  استخراج Types
// ==============================================================

export type BaseUserInputsType = z.infer<typeof baseUserSchema>
export type CreateUserInputsType = z.infer<typeof createUserSchema>
export type UpdateUserInputsType = z.infer<typeof updateUserByIdSchema>
export type ChangePasswordInputsType = z.infer<typeof changePasswordSchema>
export type LoginUserInputsType = z.infer<typeof loginUserSchema>
export type DeleteSessionInputsType = z.infer<typeof deleteSessionsBy_uuid>
