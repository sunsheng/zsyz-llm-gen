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

/** 对比维度数据 */
export interface ComparisonDimensionData {
  key: string
  label: string
  tableData: Record<string, string>[]
}

export interface ComparisonDimensionsData {
  compareParks: string[]
  dimensions: ComparisonDimensionData[]
}

/** 数据采集与整合 - 数据源 */
export interface DataSourceInfo {
  name: string
  icon: string
  color: string
  status: string
  count: string
  frequency: string
  lastUpdate: string
  completion: number
}

/** 数据采集与整合 - 整合任务 */
export interface IntegrationTask {
  name: string
  source: string
  status: string
  progress: number
  records: number
  updateTime: string
}

/** 数据采集与整合汇总 */
export interface DataCollectionData {
  dataSources: DataSourceInfo[]
  integrationTasks: IntegrationTask[]
}

/** 报告模板 */
export interface ReportTemplate {
  id: number
  name: string
  description: string
  cycle: string
  indicators: number
  color: string
  indicatorList: string[]
  structure: { label: string; children?: { label: string }[] }[]
}

export interface ReportTemplatesData {
  templates: ReportTemplate[]
}

/** 关联企业 */
export interface RelatedEnterprise {
  id: number
  name: string
  segment: string
  industry: string
  region: string
  capital: number
  matchScore: number
  contact: string
  phone: string
}

export interface RelatedEnterprisesData {
  enterprises: RelatedEnterprise[]
  segments: string[]
}

/** 报告生成 - 企业选项 */
export interface EntReportEnterprise {
  id: number
  name: string
  industry: string
}

export interface EntReportGenerateData {
  enterprises: EntReportEnterprise[]
}
