// 产业对比分析 & 产业占比分析 API
import {
  getMockRegions,
  getMockScaleData,
  getMockScaleTrend,
  getMockStructureData,
  getMockEconomicData,
  getMockEconomicTrend,
  getMockInnovationData,
  getMockInnovationTrend,
  getMockTalentData,
  getMockTalentTrend,
  getMockGlobalProportion,
  getMockHeatmapData,
  getMockDashboardData,
} from '@/api/mock/benchmarking'
import type {
  CompareRegion,
  ScaleIndicators,
  ScaleTrendItem,
  StructureIndicators,
  EconomicIndicators,
  EconomicTrendItem,
  InnovationIndicators,
  InnovationTrendItem,
  TalentIndicators,
  TalentTrendItem,
  GlobalProportionData,
  HeatmapData,
  DashboardData,
} from '@/api/types/benchmarking'

/** 获取可对比的区域列表 */
export function fetchCompareRegions(): Promise<CompareRegion[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRegions()), 200)
  })
}

/** 获取产业规模对比数据 */
export function fetchScaleCompare(regionIds: string[]): Promise<ScaleIndicators[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockScaleData(regionIds)), 200)
  })
}

/** 获取产业规模趋势数据 */
export function fetchScaleTrend(regionNames: string[]): Promise<ScaleTrendItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockScaleTrend(regionNames)), 200)
  })
}

/** 获取产业结构对比数据 */
export function fetchStructureCompare(regionIds: string[]): Promise<StructureIndicators[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockStructureData(regionIds)), 200)
  })
}

/** 获取经济效益对比数据 */
export function fetchEconomicCompare(regionIds: string[]): Promise<EconomicIndicators[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEconomicData(regionIds)), 200)
  })
}

/** 获取经济效益趋势数据 */
export function fetchEconomicTrend(regionNames: string[]): Promise<EconomicTrendItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEconomicTrend(regionNames)), 200)
  })
}

/** 获取创新能力对比数据 */
export function fetchInnovationCompare(regionIds: string[]): Promise<InnovationIndicators[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockInnovationData(regionIds)), 200)
  })
}

/** 获取创新能力趋势数据 */
export function fetchInnovationTrend(regionNames: string[]): Promise<InnovationTrendItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockInnovationTrend(regionNames)), 200)
  })
}

/** 获取人才资源对比数据 */
export function fetchTalentCompare(regionIds: string[]): Promise<TalentIndicators[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTalentData(regionIds)), 200)
  })
}

/** 获取人才资源趋势数据 */
export function fetchTalentTrend(regionNames: string[]): Promise<TalentTrendItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTalentTrend(regionNames)), 200)
  })
}

// ===== 产业占比分析 =====

/** 获取全局产业分布数据 */
export function fetchGlobalProportion(): Promise<GlobalProportionData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockGlobalProportion()), 200)
  })
}

/** 获取热力图数据 */
export function fetchHeatmapData(): Promise<HeatmapData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockHeatmapData()), 200)
  })
}

/** 获取动态看板数据 */
export function fetchDashboardData(): Promise<DashboardData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockDashboardData()), 200)
  })
}
