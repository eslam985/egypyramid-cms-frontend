import { z } from 'zod'

// createLink(episode_id, data = {})
const createLinkSchema = z.object({
    server_name: z.string().trim().min(2).max(50),
    url: z.string().trim().url(),
    is_fixed: z.boolean().optional(),
    check_count: z.number().int().nonnegative().optional(),
    last_check_status: z.enum(['pending', 'valid', 'broken']).optional(),
    link_type: z.enum(['watch', 'download']).optional(),
    quality: z.enum(['1080p', '720p', '480p', '360p', '4k']).optional(),
})

// updateLinkById(id, data = {})
const updateLinkByIdSchema = createLinkSchema.partial().refine(
        (data) => Object.keys(data).length > 0,
        { message: 'يجب إرسال حقل واحد على الأقل للتحديث'}
    )


export { createLinkSchema, updateLinkByIdSchema }
