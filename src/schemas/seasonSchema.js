// /middleware/schemas/seasonSchema.js

import { z } from 'zod'

const createSeasonSchema = z.object({
    season_number: z.coerce.number().int().positive('season_number يجب أن يكون رقماً موجباً'),
})

const updateSeasonSchema = createSeasonSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'يجب إرسال حقل واحد على الأقل للتحديث',
    })

export { createSeasonSchema, updateSeasonSchema }
