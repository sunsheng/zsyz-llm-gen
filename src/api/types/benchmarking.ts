/** 产业对比分析类型定义 */

/** 对比区域/实体 */
export interface CompareRegion {
  id: string
  name: string
  shortName?: string
  level?: string // 国家级/省级/市级
  gdp?: number
}

/** 对比维度选择参数 */
export interface CompareQuery {
  regionIds: string[]
  year?: number
}

// ===== 产业规模 =====

export interface ScaleIndicators {
  regionId: string
  regionName: string
  enterpriseCount: number // 企业数量
  totalOutput: number // 总产值（亿元）
  addedValue: number // 增加值（亿元）
  taxContribution: number // 税收贡献（亿元）
  fixedAssetInvestment: number // 固定资产投资（亿元）
  outputPerArea: number // 单位面积产值（亿元/km²）
  outputPerCapita: number // 人均产值（万元/人）
  growth: number // 增速（%）
  employeeCount: number // 从业人数（万人）
}

export interface ScaleTrendItem {
  year: string
  [regionName: string]: string | number
}

// ===== 产业结构 =====

export interface IndustryShare {
  name: string // 主导产业名称
  value: number // 占比%
}

export interface SubIndustry {
  parent: string // 所属主导产业
  name: string // 细分行业名称
  share: number // 占比%
}

export interface ChainCompleteness {
  upstream: number // 上游原材料完整度%
  midstream: number // 中游制造完整度%
  downstream: number // 下游应用完整度%
  overall: number // 综合完整度%
}

export interface StructureIndicators {
  regionId: string
  regionName: string
  dominantIndustries: IndustryShare[] // 主导产业占比
  subIndustries: SubIndustry[] // 细分行业分布
  chainCompleteness: ChainCompleteness // 产业链完整性
  highTechRatio: number // 高新技术占比%
  advancedManufacturingRatio: number // 先进制造业占比%
  traditionalRatio: number // 传统产业占比%
}

// ===== 经济效益 =====

export interface EconomicIndicators {
  regionId: string
  regionName: string
  profitRate: number // 利润率%
  revenueGrowth: number // 营收增长率%
  taxGrowth: number // 税收增长率%
  roi: number // 投资回报率%
  outputPerEnergy: number // 单位能耗产值（万元/吨标煤）
  carbonIntensity: number // 碳排放强度（吨CO₂/万元）
  taxPerCapita: number // 人均纳税（万元）
  outputPerCapita: number // 人均产值（万元）
}

export interface EconomicTrendItem {
  year: string
  [regionName: string]: string | number
}

// ===== 创新能力 =====

export interface InnovationIndicators {
  regionId: string
  regionName: string
  rdRatio: number // 研发投入占比%
  highTechEnterpriseCount: number // 高新技术企业数量
  patentCount: number // 专利授权量
  techTradeAmount: number // 技术交易额（亿元）
  innovationPlatformCount: number // 创新平台数量（实验室、研究院等）
  rdTalentCount: number // 研发人员（万人）
  innovationIndex: number // 创新指数
}

export interface InnovationTrendItem {
  year: string
  [regionName: string]: string | number
}

// ===== 人才资源 =====

export interface TalentIndicators {
  regionId: string
  regionName: string
  totalEmployees: number // 从业人员总数（万人）
  seniorTalentRatio: number // 高层次人才占比%
  talentPolicyScore: number // 人才引进政策力度评分（1-100）
  universities: number // 高校数量
  researchInstitutes: number // 科研机构数量
  rdTalentCount: number // 研发人才（万人）
  netInflowRate: number // 人才净流入率%
  avgSalary: number // 平均薪资（万元）
}

export interface TalentTrendItem {
  year: string
  [regionName: string]: string | number
}

// ===== 对比雷达图数据 =====

export interface RadarIndicator {
  name: string
  max: number
}

export interface RadarSeriesItem {
  value: number[]
  name: string
}

// ===== 产业占比分析 =====

/** 指标维度枚举 */
export type ProportionMetric = 'output' | 'tax' | 'enterprise' | 'employment'

/** 全局产业分布 - 单个产业占比 */
export interface IndustryProportion {
  name: string
  outputShare: number // 产值占比%
  taxShare: number // 税收贡献占比%
  enterpriseShare: number // 企业数量占比%
  employmentShare: number // 就业人数占比%
  outputValue: number // 产值（亿元）
  taxValue: number // 税收（亿元）
  enterpriseCount: number // 企业数量（家）
  employmentCount: number // 就业人数（万人）
  growth: number // 增速%
}

/** 全局产业分布 - 省份数据 */
export interface ProvinceProportion {
  name: string
  value: number
}

/** 全局产业分布汇总 */
export interface GlobalProportionData {
  kpiCards: {
    totalIndustry: number
    coverageRate: number
    advantageIndustry: number
    industryCluster: number
  }
  industries: IndustryProportion[]
  provinceData: Record<ProportionMetric, ProvinceProportion[]>
}

/** 热力图 - 区域数据 */
export interface HeatmapRegion {
  id: string
  name: string
  lng: number
  lat: number
  density: Record<string, number> // 各产业密度
  totalDensity: number
  type: string // 高密度工业区/新兴科技园区/传统产业区
}

/** 热力图汇总 */
export interface HeatmapData {
  kpiCards: {
    maxDensity: number
    avgDensity: number
    hotspotCount: number
    coldspotCount: number
  }
  regions: HeatmapRegion[]
  industryTypes: string[]
}

/** 动态看板 - 产业趋势 */
export interface DashboardIndustryTrend {
  name: string
  data: number[]
}

/** 动态看板 - 区域占比对比 */
export interface DashboardRegionCompare {
  name: string
  current: number
  lastYear: number
}

/** 动态看板汇总 */
export interface DashboardData {
  kpiCards: {
    monitorCount: number
    risingCount: number
    fallingCount: number
    stableCount: number
  }
  industryTrends: DashboardIndustryTrend[]
  trendMonths: string[]
  regionCompares: DashboardRegionCompare[]
  growthTrend: {
    yearOnYear: number[]
    monthOnMonth: number[]
  }
  changeRanking: {
    name: string
    value: number
  }[]
}
