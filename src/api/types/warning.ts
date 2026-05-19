/** 风险预警模块类型定义 */

// ===== 6.1 产业发展预警 =====

/** 指标状态 */
export type IndicatorStatus = 'normal' | 'warning' | 'critical'

/** 指标分类 */
export type IndicatorCategory = 'scale' | 'efficiency' | 'risk' | 'sustainable' | 'innovation'

/** 核心监测指标 */
export interface CoreIndicator {
  id: string
  name: string
  category: IndicatorCategory
  categoryName: string
  currentValue: number
  unit: string
  warnThreshold: number
  criticalThreshold: number
  status: IndicatorStatus
  change: number // 变化趋势%
  updateTime: string
}

/** 核心监测指标汇总 */
export interface CoreIndicatorSummary {
  kpiCards: {
    totalIndicators: number
    normalCount: number
    warningCount: number
    criticalCount: number
  }
  indicators: CoreIndicator[]
  trendData: {
    months: string[]
    series: { name: string; data: number[] }[]
  }
  healthDistribution: { name: string; value: number }[]
}

/** 阈值类型 */
export type ThresholdType = 'static' | 'dynamic'

/** 动态阈值规则 */
export interface ThresholdRule {
  id: string
  indicator: string
  indicatorId: string
  warnThreshold: string
  criticalThreshold: string
  type: ThresholdType
  triggerCount: number
  enabled: boolean
}

/** 动态阈值汇总 */
export interface DynamicThresholdSummary {
  kpiCards: {
    totalRules: number
    dynamicCount: number
    monthlyTriggers: number
    accuracy: number
  }
  rules: ThresholdRule[]
  triggerTrend: {
    months: string[]
    warnTriggers: number[]
    criticalTriggers: number[]
  }
  distribution: { name: string; value: number }[]
}

/** 模型类型 */
export type ModelType =
  | 'time_series'
  | 'anomaly_detection'
  | 'correlation'
  | 'regression'
  | 'nlp'
  | 'ensemble'

/** 预警分析模型 */
export interface WarningModel {
  id: string
  name: string
  type: ModelType
  typeName: string
  accuracy: number
  recall: number
  lastRun: string
  running: boolean
}

/** 预警分析模型汇总 */
export interface WarningModelSummary {
  kpiCards: {
    totalModels: number
    runningCount: number
    avgAccuracy: number
    monthlyPredictions: number
  }
  models: WarningModel[]
  trendData: {
    months: string[]
    alertCount: number[]
    confirmedCount: number[]
  }
  accuracyComparison: {
    models: string[]
    accuracy: number[]
    recall: number[]
  }
}

// ===== 6.2 企业外迁预警 =====

/** 指标维度 */
export type IndicatorDimension = 'financial' | 'operation' | 'asset' | 'relation' | 'governance'

/** 外迁预警指标 */
export interface RelocationIndicator {
  id: string
  name: string
  dimension: IndicatorDimension
  dimensionName: string
  weight: number
  dataSource: string
  frequency: string
  enabled: boolean
  /** 是否为直接外迁信号 */
  isDirectSignal: boolean
}

/** 预警指标体系汇总 */
export interface RelocationIndicatorSummary {
  kpiCards: {
    totalIndicators: number
    dimensionCount: number
    realtimeCount: number
    coverage: number
  }
  indicators: RelocationIndicator[]
  dimensionDistribution: { name: string; value: number }[]
  weightDistribution: { dimension: string; weight: number }[]
}

/** 风险信号类型 */
export type RiskSignalType =
  | 'asset_change'
  | 'personnel_change'
  | 'operation_change'
  | 'finance_change'
  | 'supply_chain_change'
  | 'opinion_change'

/** 间接风险信号 */
export interface RiskSignal {
  id: string
  enterprise: string
  signalType: RiskSignalType
  signalTypeName: string
  signal: string
  strength: number // 0-100
  time: string
}

/** 间接风险信号汇总 */
export interface RiskSignalSummary {
  kpiCards: {
    totalSignals: number
    highStrengthCount: number
    confirmedCount: number
    falseAlarmRate: number
  }
  signals: RiskSignal[]
  trendData: {
    months: string[]
    high: number[]
    medium: number[]
    low: number[]
  }
  typeDistribution: { name: string; value: number }[]
}

/** 风险等级 */
export type RiskLevel = 'low' | 'medium' | 'high'

/** 风险评分 */
export interface RiskScore {
  id: string
  enterprise: string
  score: number // 0-100, 越高越危险
  level: RiskLevel
  levelName: string
  financeScore: number
  operationScore: number
  assetScore: number
  relationScore: number
  governanceScore: number
  relocationProb: number // 外迁概率 0-100
  trend: 'up' | 'down' | 'stable'
}

/** 风险评分模型汇总 */
export interface RiskScoringSummary {
  kpiCards: {
    evaluatedCount: number
    highRiskCount: number
    mediumRiskCount: number
    lowRiskCount: number
  }
  scores: RiskScore[]
  levelDistribution: { name: string; value: number }[]
  scoreDistribution: { range: string; count: number; color: string }[]
}
