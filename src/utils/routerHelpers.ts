export const fromRouteQuery = (val: string | (string | null)[] | null | undefined): string => {
    if (!val) return ''
    if (typeof val === 'string') return val
    if (Array.isArray(val)) return val[0] ?? ''
    return ''
}
