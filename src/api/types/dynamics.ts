// 产业动态类型定义

/** 新闻领域 */
export type NewsDomain = 'policy' | 'industry' | 'technology' | 'market'

/** 产业新闻 */
export interface DynamicsNews {
  id: number
  title: string
  summary: string
  domain: NewsDomain
  source: string
  publishDate: string
  url: string
}

/** 政策摘要卡 */
export interface PolicySummary {
  id: number
  title: string
  status: string
  subsidyAmount: string
  conditions: string
  deadline: string
}

/** 热点事件 */
export interface HotspotEvent {
  id: number
  title: string
  date: string
  type: 'major' | 'important' | 'normal'
  description: string
  relatedNews: string[]
}

/** 政策层级 */
export type PolicyLevel = 'national' | 'municipal'

/** 政策类型 */
export type PolicyType = 'industry-plan' | 'industry-support' | 'talent' | 'housing'

/** 政策信息 */
export interface DynamicsPolicy {
  title: string
  department: string
  level: PolicyLevel
  policyType: PolicyType
  publishDate: string
  status: '现行' | '废止'
  url: string
}

/** 政策监测项 */
export interface PolicyMonitor {
  policy: string
  progress: number
  benefitedEnterprises: number
  fundScale: string
  jobsCreated: number
  keyNode: '资金拨付' | '项目验收'
  deadline: string
  responsible: string
}
