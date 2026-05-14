// 运行分析 API
import { getMockKpiCards, getMockChartData } from '@/api/mock/analysis'
import type { KpiCard, ChartData } from '@/api/types/analysis'

export function fetchKpiCards(): Promise<KpiCard[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockKpiCards()), 200)
  })
}

export function fetchChartData(type: string): Promise<ChartData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChartData(type)), 200)
  })
}
