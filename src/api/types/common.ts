// 公共类型定义

/** 通用 API 响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页参数 */
export interface PaginationParams {
  current: number
  pageSize: number
}

/** 分页响应 */
export interface PaginatedData<T> {
  list: T[]
  total: number
  current: number
  pageSize: number
}

/** 筛选参数 */
export interface FilterParams {
  keyword?: string
  [key: string]: unknown
}

/** 排序参数 */
export interface SortParams {
  field: string
  order: 'asc' | 'desc'
}

/** 通用列表查询参数 */
export interface ListQueryParams extends PaginationParams, FilterParams {
  sort?: SortParams
}
