import { z } from 'zod'

// createGenre
const createGenreSchema = z.object({
    name: z.string().trim().min(2).max(20),
})

const updateGenreByIdSchema = createGenreSchema.refine((data) => Object.keys(data).length > 0, {
    message: 'يجب إرسال حقل واحد على الأقل للتحديث',
})

export { createGenreSchema, updateGenreByIdSchema }
