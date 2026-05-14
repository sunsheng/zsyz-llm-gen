/** 企业数据类型 */
export interface Enterprise {
  id: string
  name: string
  shortName?: string
  unifiedCode: string // 统一社会信用代码
  industry: string // 所属行业
  industryCode: string
  registeredCapital: number // 注册资本（万元）
  establishedDate: string // 成立日期
  legalPerson: string // 法人
  address: string // 地址
  businessScope: string // 经营范围
  status: 'operating' | 'revoked' | 'moved' | 'dissolved'
  scale: 'large' | 'medium' | 'small' | 'micro'
  tags: string[] // 标签: 高企/专精特新/上市/独角兽等
  revenue: number // 营收（万元）
  taxPaid: number // 税收（万元）
  employeeCount: number // 员工数
  province: string
  city: string
  district: string
  longitude?: number
  latitude?: number
  phone?: string
  website?: string
  email?: string
  riskScore?: number // 风险评分 0-100
  healthScore?: number // 健康评分 0-100
  growthRate?: number // 增长率(%)
  innovationScore?: number // 创新力评分
  qualificationList: string[] // 资质列表
}

export interface EnterpriseListItem {
  id: string
  name: string
  industry: string
  scale: string
  status: string
  tags: string[]
  registeredCapital: number
  revenue: number
  growthRate?: number
  city: string
  riskScore?: number
}

export interface EnterpriseDetail extends Enterprise {
  subsidiaries: string[] // 子公司
  shareholders: string[] // 股东
  patents: number // 专利数
  trademarks: number // 商标数
  certifications: string[] // 认证列表
}
