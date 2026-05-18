// 企业监测 API
import {
  getMockMonitorKpi,
  getMockHealthData,
  getMockRevenueRanking,
  getMockGrowthRanking,
  getMockEnterpriseDistribution,
  getMockEvaluationData,
  getMockPortraitData,
  getMockEnterpriseBasicList,
  getMockEconomicContribution,
  getMockDynamicRanking,
  getMockOverviewKpi,
  getMockKeyDashboardKpi,
  getMockKeyDashboardTrend,
  getMockChainCollaborateData,
  getMockSustainabilityKpi,
  getMockSustainabilityData,
  getMockRankingIntegrationList,
  getMockFluctuationWarningList,
  getMockFilterEnterpriseList,
  getMockHealthIndexData,
  getMockMultiDimensionPortrait,
  getMockChainRelationData,
  getMockFiveDimensionData,
} from '@/api/mock/monitor'
import { getMockEnterpriseList } from '@/api/mock/enterprises'
import type { PaginatedData } from '@/api/types/common'
import type { EnterpriseListItem } from '@/api/types/enterprise'

export function fetchMonitorKpi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockMonitorKpi()), 200)
  })
}

export function fetchMonitorList(params: {
  current?: number
  pageSize?: number
  keyword?: string
}): Promise<PaginatedData<EnterpriseListItem>> {
  const { current = 1, pageSize = 20 } = params
  const list = getMockEnterpriseList(pageSize)
  return new Promise((resolve) => {
    setTimeout(() => resolve({ list, total: 1286, current, pageSize }), 300)
  })
}

export function fetchHealthData(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockHealthData(count)), 200)
  })
}

export function fetchRevenueRanking(count = 20) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRevenueRanking(count)), 200)
  })
}

export function fetchGrowthRanking(count = 20) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockGrowthRanking(count)), 200)
  })
}

export function fetchEnterpriseDistribution() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEnterpriseDistribution()), 200)
  })
}

export function fetchEvaluationData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEvaluationData()), 200)
  })
}

export function fetchPortraitData(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockPortraitData(id)), 200)
  })
}

// ===== 10.1 企业总览 =====

export function fetchOverviewKpi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockOverviewKpi()), 200)
  })
}

export function fetchEnterpriseBasicList(count = 20) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEnterpriseBasicList(count)), 200)
  })
}

export function fetchEconomicContribution() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEconomicContribution()), 200)
  })
}

export function fetchDynamicRanking(count = 20, sortBy: 'tax' | 'employment' | 'rd' = 'tax') {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockDynamicRanking(count, sortBy)), 200)
  })
}

// ===== 10.2 经营健康度监测 =====

export function fetchKeyDashboardKpi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockKeyDashboardKpi()), 200)
  })
}

export function fetchKeyDashboardTrend() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockKeyDashboardTrend()), 200)
  })
}

export function fetchChainCollaborateData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChainCollaborateData()), 200)
  })
}

export function fetchSustainabilityKpi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockSustainabilityKpi()), 200)
  })
}

export function fetchSustainabilityData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockSustainabilityData()), 200)
  })
}

// ===== 10.3 企业榜单 =====

export function fetchRankingIntegrationList(count = 30) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRankingIntegrationList(count)), 200)
  })
}

export function fetchFluctuationWarningList(count = 20) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockFluctuationWarningList(count)), 200)
  })
}

// ===== 10.4 企业筛选器 =====

export function fetchFilterEnterpriseList(count = 30) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockFilterEnterpriseList(count)), 200)
  })
}

// ===== 10.5 企业画像 =====

export function fetchHealthIndexData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockHealthIndexData()), 200)
  })
}

export function fetchMultiDimensionPortrait(id = 'ent-1') {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockMultiDimensionPortrait(id)), 200)
  })
}

export function fetchChainRelationData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChainRelationData()), 200)
  })
}

// ===== 10.6 企业综合评价 =====

export function fetchFiveDimensionData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockFiveDimensionData()), 200)
  })
}
