// 全局常量

// API 基础路径
export const API_BASE = ''

// 分页默认值
export const DEFAULT_PAGE_SIZE = 20
export const DEFAULT_CURRENT_PAGE = 1

// 图表统一配色
export const CHART_COLORS = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

// 企业标签类型
export const ENTERPRISE_TAG_TYPES = {
  industry: { bg: '#ECF5FF', color: '#1889E8' },
  scale: { bg: '#F0F9EB', color: '#67C23A' },
  status: { bg: '#FDF6EC', color: '#E6A23C' },
  qualify: { bg: '#FEF0F0', color: '#F56C6C' },
} as const

// 风险等级
export const RISK_LEVELS = {
  low: { label: '低风险', color: '#67C23A' },
  medium: { label: '中风险', color: '#E6A23C' },
  high: { label: '高风险', color: '#F56C6C' },
  critical: { label: '极高风险', color: '#F56C6C' },
} as const
