/**
 * 区域地图模块 (模块七) 类型定义
 * PRD 指标体系：经济效益40%、创新活力30%、社会贡献20%、成长潜力10%
 */

// ===== 通用 =====

/** 指标维度 */
export type IndicatorDimension = 'economic' | 'innovation' | 'social' | 'growth'

/** 维度中文名映射 */
export const DIMENSION_LABEL: Record<IndicatorDimension, string> = {
  economic: '经济效益',
  innovation: '创新活力',
  social: '社会贡献',
  growth: '成长潜力',
}

/** 维度权重映射 */
export const DIMENSION_WEIGHT: Record<IndicatorDimension, number> = {
  economic: 40,
  innovation: 30,
  social: 20,
  growth: 10,
}

// ===== 榜单指标体系 =====

/** 榜单指标 */
export interface RankingIndicator {
  id: string
  name: string
  dimension: IndicatorDimension
  weight: number // 该指标在所属维度内的权重(%)
  calcMethod: string
  dataSource: string
  status: 'active' | 'inactive'
}

/** 榜单指标体系 Summary */
export interface IndicatorSystemSummary {
  kpiCards: {
    totalIndicators: number
    dimensions: number
    quantitative: number
    coverageRate: number
  }
  indicators: RankingIndicator[]
  dimensionDistribution: { name: string; value: number }[]
  weightDistribution: { dimension: string; weight: number }[]
}

// ===== 企业综合榜 =====

/** 企业综合榜条目 */
export interface EnterpriseRankingItem {
  rank: number
  enterpriseId: string
  enterpriseName: string
  parkName: string
  industry: string
  totalScore: number
  economicScore: number
  innovationScore: number
  socialScore: number
  growthScore: number
  rankChange: number // 正=上升，负=下降
}

/** 企业综合榜 Summary */
export interface EnterpriseRankingSummary {
  kpiCards: {
    totalParks: number
    totalEnterprises: number
    topScore: number
    avgScore: number
  }
  rankings: EnterpriseRankingItem[]
  topParks: { park: string; score: number }[]
  radarIndicators: { name: string; max: number }[]
  radarSeries: { value: number[]; name: string }[]
}

// ===== 产业链协同榜 =====

/** 产业链协同榜条目 */
export interface ChainRankingItem {
  rank: number
  parkName: string
  chainName: string
  completeness: number
  synergyScore: number
  upstreamCount: number
  downstreamCount: number
  rankChange: number
}

/** 产业链协同榜 Summary */
export interface ChainRankingSummary {
  kpiCards: {
    totalChains: number
    avgCompleteness: number
    highSynergyParks: number
    avgScore: number
  }
  rankings: ChainRankingItem[]
  chainScores: { park: string; score: number }[]
  radarIndicators: { name: string; max: number }[]
  radarSeries: { value: number[]; name: string }[]
  upstreamDownstreamTrend: {
    months: string[]
    upstream: number[]
    downstream: number[]
  }
}
