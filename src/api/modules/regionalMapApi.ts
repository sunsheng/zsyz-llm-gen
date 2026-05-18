/**
 * 区域地图模块 API 调用函数
 */
import {
  getMockIndicatorSystemSummary,
  getMockEnterpriseRankingSummary,
  getMockChainRankingSummary,
} from '@/api/mock/regional-map'
import type {
  IndicatorSystemSummary,
  EnterpriseRankingSummary,
  ChainRankingSummary,
} from '@/api/types/regional-map'

/** 获取榜单指标体系 */
export function fetchIndicatorSystem(): Promise<IndicatorSystemSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockIndicatorSystemSummary()), 200)
  })
}

/** 获取企业综合榜 */
export function fetchEnterpriseRanking(): Promise<EnterpriseRankingSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEnterpriseRankingSummary()), 200)
  })
}

/** 获取产业链协同榜 */
export function fetchChainRanking(): Promise<ChainRankingSummary> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChainRankingSummary()), 200)
  })
}
