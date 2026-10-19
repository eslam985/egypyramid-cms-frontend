// =================================
// ========== globalTypes ==========
// =================================
// /src/types/globalTypes.ts

export type ValidationResult = {
    isValid: boolean
    data: any | null
}

// 1. تعريف الكائن القيم (Value)
export const OrderingEnum = {
    DESC: 'DESC',
    ASC: 'ASC',
} as const

export type OrderingEnum = (typeof OrderingEnum)[keyof typeof OrderingEnum]

export type dataType = string | number | Date

export type OrderingType = 'DESC' | 'ASC'

export type TableRow = Record<string, any>

export interface PageAndLimitType {
    page?: number
    limit?: number
}

export interface OrderingAndSearchType extends PageAndLimitType {
    search?: string | undefined
    order?: OrderingType | undefined
}

export interface BaseQueryRequest {
    page?: string | number | null
    limit?: string | number | null
    sortOrder?: OrderingEnum
}

export interface PaginationResponse {
    total: number
    page: number
    limit: number
    totalPage: number
}

export interface BaseApiResponse<T = null> {
    success: boolean
    message: string
    data: T
    pagination?: PaginationResponse
}

export interface Column {
    key: string
    label: string
    sortable?: boolean
}
