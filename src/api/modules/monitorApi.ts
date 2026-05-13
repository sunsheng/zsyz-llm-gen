// 企业监测 API
import { getMockMonitorKpi, getMockHealthData, getMockRevenueRanking, getMockGrowthRanking, getMockEnterpriseDistribution, getMockEvaluationData, getMockPortraitData } from '@/api/mock/monitor'
import { getMockEnterpriseList, getMockEnterpriseDetail } from '@/api/mock/enterprises'
import type { PaginatedData } from '@/api/types/common'
import type { EnterpriseListItem } from '@/api/types/enterprise'

export function fetchMonitorKpi() {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockMonitorKpi()), 200)
  })
}

export function fetchMonitorList(params: { current?: number; pageSize?: number; keyword?: string }): Promise<PaginatedData<EnterpriseListItem>> {
  const { current = 1, pageSize = 20 } = params
  const list = getMockEnterpriseList(pageSize)
  return new Promise(resolve => {
    setTimeout(() => resolve({ list, total: 1286, current, pageSize }), 300)
  })
}

export function fetchHealthData(count = 10) {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockHealthData(count)), 200)
  })
}

export function fetchRevenueRanking(count = 20) {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockRevenueRanking(count)), 200)
  })
}

export function fetchGrowthRanking(count = 20) {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockGrowthRanking(count)), 200)
  })
}

export function fetchEnterpriseDistribution() {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockEnterpriseDistribution()), 200)
  })
}

export function fetchEvaluationData() {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockEvaluationData()), 200)
  })
}

export function fetchPortraitData(id: string) {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockPortraitData(id)), 200)
  })
}
