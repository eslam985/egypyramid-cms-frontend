import { z } from 'zod'
import { nameRe } from '@/utils/regex'


const baseUserSchema = z.object({
  username: z.string().trim().min(3).max(30).regex(nameRe),
  email: z.string().trim().lowercase().email(),
  avatar_url: z.string().url("يجب أن يكون رابط صورة صالح").nullish().or(z.literal('')),
  roles: z.enum(["5150", "1984", "2001"], {
    errorMap: () => ({ message: "roles must be only [ 5150, 1984, 2001 ]" })
  }).default("2001").optional()
});

const createUserSchema =  baseUserSchema.extend({
    password: z.string().trim().min(6).max(100),
  })


const updateUserByIdSchema = baseUserSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "يجب إرسال حقل واحد على الأقل للتحديث" }
)

const changePasswordSchema = z.object({
    currentPassword: z.string().trim().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string().trim().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل").max(100)
});



const loginUserSchema = z.object({
        email: z.string().trim().lowercase().email(),
        password: z.string().trim().min(1, "كلمة المرور مطلوبة")
    })

const deleteSessionsBy_uuid = z.object({
        sessionId: z.string().trim()
});

export {
  baseUserSchema,
  createUserSchema,
  changePasswordSchema,
  updateUserByIdSchema,
  loginUserSchema,
  deleteSessionsBy_uuid
}
