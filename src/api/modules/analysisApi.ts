// 运行分析 API
import {
  getMockKpiCards,
  getMockChartData,
  getMockComparisonDimensions,
  getMockEntReportDataCollection,
  getMockReportDataCollection,
  getMockRelatedEnterprises,
  getMockReportTemplates,
  getMockEntReportEnterprises,
} from '@/api/mock/analysis'
import type {
  KpiCard,
  ChartData,
  ComparisonDimensionsData,
  DataCollectionData,
  RelatedEnterprisesData,
  ReportTemplatesData,
  EntReportGenerateData,
} from '@/api/types/analysis'

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

export function fetchComparisonDimensions(): Promise<ComparisonDimensionsData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockComparisonDimensions()), 200)
  })
}

export function fetchEntReportDataCollection(): Promise<DataCollectionData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEntReportDataCollection()), 200)
  })
}

export function fetchReportDataCollection(): Promise<DataCollectionData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockReportDataCollection()), 200)
  })
}

export function fetchRelatedEnterprises(): Promise<RelatedEnterprisesData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRelatedEnterprises()), 200)
  })
}

export function fetchReportTemplates(): Promise<ReportTemplatesData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockReportTemplates()), 200)
  })
}

export function fetchEntReportEnterprises(): Promise<EntReportGenerateData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEntReportEnterprises()), 200)
  })
}
