// 风险预警 API
import {
  getMockCoreIndicatorSummary,
  getMockDynamicThresholdSummary,
  getMockWarningModelSummary,
  getMockRelocationIndicatorSummary,
  getMockRiskSignalSummary,
  getMockRiskScoringSummary,
} from '@/api/mock/warning'
import type {
  CoreIndicatorSummary,
  DynamicThresholdSummary,
  WarningModelSummary,
  RelocationIndicatorSummary,
  RiskSignalSummary,
  RiskScoringSummary,
} from '@/api/types/warning'

/** 获取核心监测指标汇总 */
export function fetchCoreIndicators(): Promise<CoreIndicatorSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockCoreIndicatorSummary()), 200)
  })
}

/** 获取动态阈值设定汇总 */
export function fetchDynamicThreshold(): Promise<DynamicThresholdSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockDynamicThresholdSummary()), 200)
  })
}

/** 获取预警分析模型汇总 */
export function fetchWarningModels(): Promise<WarningModelSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockWarningModelSummary()), 200)
  })
}

/** 获取外迁预警指标体系汇总 */
export function fetchRelocationIndicators(): Promise<RelocationIndicatorSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRelocationIndicatorSummary()), 200)
  })
}

/** 获取间接风险信号汇总 */
export function fetchRiskSignals(): Promise<RiskSignalSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRiskSignalSummary()), 200)
  })
}

/** 获取风险评分模型汇总 */
export function fetchRiskScoring(): Promise<RiskScoringSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRiskScoringSummary()), 200)
  })
}
