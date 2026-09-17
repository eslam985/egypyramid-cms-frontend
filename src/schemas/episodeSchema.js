import { z } from 'zod'

const createEpisodeSchema = z.object({
    episode_number: z.coerce.number().int().positive('episode_number يجب أن يكون رقماً موجباً'),
    season_id: z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
        z.number().int().positive('season_id يجب أن يكون رقماً موجباً').nullable()
    ),
    progress_percent: z.coerce.number().int().min(0).max(100).optional(),
    status_message: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.string().trim().min(3).max(100).optional()
    ),
    download_speed: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.string().trim().min(1).max(100).optional()
    ),
    status: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.string().trim().min(1).max(100).optional()
    ),
    download_url: z.preprocess(
        (val) => (val === '' ? null : val),
        z.string().trim().nullable().optional()
    ),
})


// updateEpisodeById(id, data)
const updateEpisodeSchema = createEpisodeSchema.partial().refine(
        (data) => Object.keys(data).length > 0, {
        message: 'يجب إرسال حقل واحد على الأقل للتحديث',
    })



export { createEpisodeSchema, updateEpisodeSchema }
