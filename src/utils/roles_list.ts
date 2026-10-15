export const RolesList = {
    Admin: 5150,
    Editor: 1984,
    User: 2001,
} as const

export type RolesList = (typeof RolesList)[keyof typeof RolesList]
