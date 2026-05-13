/** 分析数据类型 */

export interface KpiCard {
  key: string
  label: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'flat'
  trendValue: string
  icon: string
  iconColor: string
  iconBgColor: string
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'radar' | 'gauge' | 'scatter' | 'heatmap' | 'wordcloud'
  title: string
  data: any
}

export interface AnalysisOverview {
  kpiCards: KpiCard[]
  charts: ChartData[]
}
