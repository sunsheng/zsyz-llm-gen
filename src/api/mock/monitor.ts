// 企业监测 Mock 数据工厂
import { companyNames, industries } from './shared-data'

export interface MonitorKpi {
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

export interface HealthData {
  id: string
  name: string
  overallScore: number
  growthScore: number
  profitScore: number
  innovationScore: number
  riskScore: number
  socialScore: number
}

export interface RankingItem {
  rank: number
  id: string
  name: string
  industry: string
  value: number
  growth: number
  city: string
}

const cities = ['德阳市', '成都市', '绵阳市', '宜宾市', '泸州市', '南充市', '达州市', '乐山市']

export function getMockMonitorKpi(): MonitorKpi[] {
  return [
    {
      key: 'total',
      label: '监测企业',
      value: 1286,
      unit: '家',
      trend: 'up',
      trendValue: '+42',
      icon: 'Monitor',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'healthy',
      label: '健康企业',
      value: 1024,
      unit: '家',
      trend: 'up',
      trendValue: '+5.2%',
      icon: 'CircleCheck',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'warning',
      label: '预警企业',
      value: 186,
      unit: '家',
      trend: 'down',
      trendValue: '-3.8%',
      icon: 'Warning',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'risk',
      label: '风险企业',
      value: 76,
      unit: '家',
      trend: 'up',
      trendValue: '+2.1%',
      icon: 'CircleClose',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
  ]
}

export function getMockHealthData(count = 10): HealthData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `health-${i + 1}`,
    name: companyNames[i % companyNames.length],
    overallScore: Math.floor(Math.random() * 30 + 70),
    growthScore: Math.floor(Math.random() * 40 + 60),
    profitScore: Math.floor(Math.random() * 35 + 65),
    innovationScore: Math.floor(Math.random() * 40 + 60),
    riskScore: Math.floor(Math.random() * 30 + 70),
    socialScore: Math.floor(Math.random() * 35 + 65),
  }))
}

export function getMockRevenueRanking(count = 20): RankingItem[] {
  return companyNames
    .slice(0, count)
    .map((name, i) => ({
      rank: i + 1,
      id: `rank-${i + 1}`,
      name,
      industry: industries[i % industries.length],
      value: Math.floor(Math.random() * 200000 + 10000),
      growth: Math.floor(Math.random() * 40 - 5),
      city: cities[i % cities.length],
    }))
    .sort((a, b) => b.value - a.value)
    .map((item, i) => ({ ...item, rank: i + 1 }))
}

export function getMockGrowthRanking(count = 20): RankingItem[] {
  return companyNames
    .slice(0, count)
    .map((name, i) => ({
      rank: i + 1,
      id: `growth-${i + 1}`,
      name,
      industry: industries[i % industries.length],
      value: Math.floor(Math.random() * 200 + 5),
      growth: Math.floor(Math.random() * 80 + 10),
      city: cities[i % cities.length],
    }))
    .sort((a, b) => b.growth - a.growth)
    .map((item, i) => ({ ...item, rank: i + 1 }))
}

export function getMockEnterpriseDistribution() {
  return industries.map((name) => ({
    name,
    value: Math.floor(Math.random() * 300 + 50),
  }))
}

export function getMockEvaluationData() {
  return {
    dimensions: ['盈利能力', '成长潜力', '创新能力', '市场竞争力', '风险控制'],
    enterprises: companyNames.slice(0, 5).map((name) => ({
      name,
      scores: Array.from({ length: 5 }, () => Math.floor(Math.random() * 30 + 70)),
    })),
  }
}

export function getMockPortraitData(id: string) {
  return {
    id,
    name: companyNames[Math.floor(Math.random() * companyNames.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    scale: ['大型', '中型', '小型'][Math.floor(Math.random() * 3)],
    revenue: Math.floor(Math.random() * 100000 + 5000),
    employees: Math.floor(Math.random() * 5000 + 100),
    established: `${2005 + Math.floor(Math.random() * 15)}`,
    tags: ['高新技术企业', '专精特新', '上市公司'].slice(0, Math.floor(Math.random() * 3 + 1)),
    healthScore: Math.floor(Math.random() * 30 + 70),
    innovationScore: Math.floor(Math.random() * 40 + 60),
    growthScore: Math.floor(Math.random() * 35 + 65),
    riskScore: Math.floor(Math.random() * 30 + 10),
  }
}

// ===== 10.1 企业总览 =====

export interface EnterpriseBasicInfo {
  id: string
  name: string
  registeredDate: string
  industry: string
  localShareholderRatio: number // 本地股东占比(%)
  foreignShareholderRatio: number // 外资股东占比(%)
  isChainOwner: boolean // 是否链主企业
  chainOwnerTag?: string // 链主标识，如"东电""二重"
  subsidiaries: string[] // 控股子公司
  registeredCapital: number // 注册资本(万元)
  legalPerson: string
  status: string
}

export interface EconomicContributionData {
  year: number
  totalOutput: number // 年度总产值(万元)
  cleanEnergyOutput: number // 清洁能源装备产值(万元)
  advancedMaterialOutput: number // 先进材料产值(万元)
  electronicsOutput: number // 电子信息产值(万元)
  taxTop3: { name: string; tax: number; industry: string }[]
  outputTrend: {
    year: number
    totalOutput: number
    cleanEnergyOutput: number
    advancedMaterialOutput: number
    electronicsOutput: number
  }[]
}

export interface DynamicRankingItem {
  rank: number
  id: string
  name: string
  industry: string
  taxAmount: number // 纳税额(万元)
  employeeCount: number // 就业人数
  rdInvestment: number // 研发投入(万元)
  rdRatio: number // 研发投入占比(%)
  growth: number
  city: string
}

// 链主企业及控股子公司 Mock
const chainOwnerSubsidiaries: Record<string, string[]> = {
  东方电机有限公司: ['东电水力设备公司', '东电风电技术公司', '东电电机修造公司'],
  中国二重集团: ['二重重装', '二重精锻', '二重万航模锻'],
  国机重装: ['国机重装德阳基地', '国机重装成都分公司'],
}

export function getMockEnterpriseBasicList(count = 20): EnterpriseBasicInfo[] {
  return Array.from({ length: count }, (_, i) => {
    const isChainOwner = i < 3 // 前三个为链主企业
    const name = companyNames[i % companyNames.length]
    const industry = industries[i % industries.length]
    return {
      id: `ent-${i + 1}`,
      name,
      registeredDate: `${1998 + Math.floor(Math.random() * 25)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      industry,
      localShareholderRatio: Math.floor(Math.random() * 40 + 60),
      foreignShareholderRatio: Math.floor(Math.random() * 30 + 5),
      isChainOwner,
      chainOwnerTag: isChainOwner ? name.replace('有限公司', '').replace('集团', '') : undefined,
      subsidiaries: isChainOwner ? chainOwnerSubsidiaries[name] || [] : [],
      registeredCapital: Math.floor(Math.random() * 50000 + 1000),
      legalPerson: ['张明', '李华', '王强', '赵刚', '陈伟'][i % 5],
      status: '运营中',
    }
  })
}

export function getMockEconomicContribution(): EconomicContributionData {
  const currentYear = new Date().getFullYear()
  return {
    year: currentYear,
    totalOutput: 3256800,
    cleanEnergyOutput: 1285600,
    advancedMaterialOutput: 682300,
    electronicsOutput: 528900,
    taxTop3: [
      { name: '东方电机有限公司', tax: 86520, industry: '清洁能源装备' },
      { name: '中国二重集团', tax: 72380, industry: '清洁能源装备' },
      { name: '华创新材料科技', tax: 45600, industry: '先进材料' },
    ],
    outputTrend: Array.from({ length: 5 }, (_, i) => ({
      year: currentYear - 4 + i,
      totalOutput: 2100000 + i * 280000 + Math.floor(Math.random() * 100000),
      cleanEnergyOutput: 850000 + i * 110000 + Math.floor(Math.random() * 50000),
      advancedMaterialOutput: 420000 + i * 65000 + Math.floor(Math.random() * 30000),
      electronicsOutput: 380000 + i * 55000 + Math.floor(Math.random() * 25000),
    })),
  }
}

export function getMockDynamicRanking(
  count = 20,
  sortBy: 'tax' | 'employment' | 'rd' = 'tax',
): DynamicRankingItem[] {
  const items = companyNames.slice(0, count).map((name, i) => ({
    rank: i + 1,
    id: `dr-${i + 1}`,
    name,
    industry: industries[i % industries.length],
    taxAmount: Math.floor(Math.random() * 80000 + 500),
    employeeCount: Math.floor(Math.random() * 5000 + 50),
    rdInvestment: Math.floor(Math.random() * 15000 + 200),
    rdRatio: Math.floor(Math.random() * 8 + 2),
    growth: Math.floor(Math.random() * 40 - 5),
    city: cities[i % cities.length],
  }))

  const sortKey =
    sortBy === 'tax' ? 'taxAmount' : sortBy === 'employment' ? 'employeeCount' : 'rdInvestment'
  return items
    .sort((a, b) => (b as any)[sortKey] - (a as any)[sortKey])
    .map((item, i) => ({ ...item, rank: i + 1 }))
}

// 10.1 基础信息总览 KPI
export function getMockOverviewKpi(): MonitorKpi[] {
  return [
    {
      key: 'total',
      label: '企业总数',
      value: 1286,
      unit: '家',
      trend: 'up',
      trendValue: '+42',
      icon: 'OfficeBuilding',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'chain-owner',
      label: '链主企业',
      value: 8,
      unit: '家',
      trend: 'up',
      trendValue: '+1',
      icon: 'Crown',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'local-ratio',
      label: '本地股权占比',
      value: 72,
      unit: '%',
      trend: 'up',
      trendValue: '+2.3%',
      icon: 'PieChart',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'foreign-ratio',
      label: '外资股权占比',
      value: 18,
      unit: '%',
      trend: 'down',
      trendValue: '-1.5%',
      icon: 'TrendCharts',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
  ]
}

// ===== 10.2 经营健康度监测 =====

export interface KeyDashboardKpi {
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

export interface KeyDashboardTrend {
  month: string
  taxVolatility: number
  powerCapacityRatio: number
  employeeStability: number
  healthScore: number
}

export function getMockKeyDashboardKpi(): KeyDashboardKpi[] {
  return [
    {
      key: 'tax-volatility',
      label: '纳税波动率',
      value: 12.5,
      unit: '%',
      trend: 'down',
      trendValue: '-2.1%',
      icon: 'TrendCharts',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'power-capacity',
      label: '用电产能比',
      value: 78.3,
      unit: '%',
      trend: 'up',
      trendValue: '+3.2%',
      icon: 'Lightning',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'employee-stability',
      label: '员工稳定性',
      value: 85.6,
      unit: '%',
      trend: 'flat',
      trendValue: '+0.3%',
      icon: 'User',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'health-score',
      label: '综合健康评分',
      value: 82.1,
      unit: '分',
      trend: 'up',
      trendValue: '+1.8',
      icon: 'CircleCheck',
      iconColor: '#975FE5',
      iconBgColor: '#F0EBFF',
    },
  ]
}

const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

export function getMockKeyDashboardTrend(): KeyDashboardTrend[] {
  return months.map((month) => ({
    month,
    taxVolatility: Math.floor(Math.random() * 20 + 5),
    powerCapacityRatio: Math.floor(Math.random() * 15 + 70),
    employeeStability: Math.floor(Math.random() * 10 + 80),
    healthScore: Math.floor(Math.random() * 15 + 75),
  }))
}

export interface ChainCollaborateData {
  localRate: number
  industryAvg: number
  segments: { name: string; localRate: number; industryAvg: number }[]
  warningItems: { segment: string; localRate: number; reason: string }[]
  trend: { month: string; localRate: number }[]
}

const segmentNames = [
  '原材料采购',
  '零部件加工',
  '核心制造',
  '组装集成',
  '物流仓储',
  '销售服务',
  '技术研发',
  '售后维护',
]

export function getMockChainCollaborateData(): ChainCollaborateData {
  const segments = segmentNames.map((name) => ({
    name,
    localRate: Math.floor(Math.random() * 40 + 35),
    industryAvg: 60,
  }))
  const warningItems = segments
    .filter((s) => s.localRate < 60)
    .map((s) => ({
      segment: s.name,
      localRate: s.localRate,
      reason: `本地配套率${s.localRate}%低于行业均值60%`,
    }))

  return {
    localRate: Math.floor(Math.random() * 15 + 62),
    industryAvg: 60,
    segments,
    warningItems,
    trend: months.slice(0, 6).map((month) => ({
      month,
      localRate: Math.floor(Math.random() * 10 + 60),
    })),
  }
}

export interface SustainabilityKpi {
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

export interface SustainabilityData {
  carbonTrend: { month: string; value: number }[]
  complianceRadar: { dimension: string; value: number }[]
  nonCompliantList: { name: string; reason: string; level: 'warning' | 'danger' }[]
}

export function getMockSustainabilityKpi(): SustainabilityKpi[] {
  return [
    {
      key: 'carbon',
      label: '单位产值碳排放',
      value: 0.38,
      unit: '吨/万元',
      trend: 'down',
      trendValue: '-5.2%',
      icon: 'Sunny',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'compliance',
      label: '危废处置合规率',
      value: 94.2,
      unit: '%',
      trend: 'up',
      trendValue: '+1.8%',
      icon: 'CircleCheck',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'green-power',
      label: '园区绿电覆盖率',
      value: 60,
      unit: '%',
      trend: 'up',
      trendValue: '+8%',
      icon: 'Lightning',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'non-compliant',
      label: '未达标企业',
      value: 23,
      unit: '家',
      trend: 'down',
      trendValue: '-5',
      icon: 'Warning',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
  ]
}

export function getMockSustainabilityData(): SustainabilityData {
  const complianceDimensions = ['废水排放', '废气排放', '固废处置', '噪声控制', '危废管理']
  const nonCompliantReasons = [
    '废水排放超标',
    '危废存储不合规',
    '废气排放超标',
    '噪声超标',
    '固废处置不当',
    '环评手续不全',
  ]

  return {
    carbonTrend: months.slice(0, 6).map((month) => ({
      month,
      value: +(Math.random() * 0.3 + 0.3).toFixed(2),
    })),
    complianceRadar: complianceDimensions.map((dimension) => ({
      dimension,
      value: Math.floor(Math.random() * 20 + 80),
    })),
    nonCompliantList: Array.from({ length: 8 }, (_, i) => ({
      name: companyNames[i % companyNames.length],
      reason: nonCompliantReasons[i % nonCompliantReasons.length],
      level: (['warning', 'danger'] as const)[i % 2],
    })),
  }
}

// ===== 10.3 企业榜单 =====

export interface RankingIntegrationItem {
  id: string
  name: string
  source: string
  rank: number
  category: string
  period: string
  industry: string
  riskLevel: 'low' | 'medium' | 'high'
  valueLinkage: string
}

const rankingSources = [
  '中国企业500强',
  '制造业单项冠军',
  '专精特新小巨人',
  '高新技术企业百强',
  '绿色制造示范',
  '德阳市纳税大户',
]
const rankingCategories = ['综合实力', '行业排名', '区域排名', '专项评价']

const valueLinkageOptions = ['强关联', '中等关联', '弱关联', '无关联']

export function getMockRankingIntegrationList(count = 30): RankingIntegrationItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ri-${i + 1}`,
    name: companyNames[i % companyNames.length],
    source: rankingSources[i % rankingSources.length],
    rank: Math.floor(Math.random() * 50 + 1),
    category: rankingCategories[i % rankingCategories.length],
    period: `2025-Q${(i % 4) + 1}`,
    industry: industries[i % industries.length],
    riskLevel: (['low', 'medium', 'high'] as const)[i % 3],
    valueLinkage: valueLinkageOptions[i % valueLinkageOptions.length],
  }))
}

export interface FluctuationWarningItem {
  id: string
  name: string
  horizontalFluctuation: number
  verticalFluctuation: number
  warningLevel: 'low' | 'medium' | 'high' | 'critical'
  reason: string
  rankChange: number
  industry: string
  triggerRule: '横向波动' | '纵向波动' | '双向波动'
}

const warningReasons = [
  '跨榜单排名差异达25位',
  '季度排名下降18位',
  '专利数突增300%',
  '营收排名骤降22位',
  '综合排名波动超30位',
  '纳税排名下降16位',
]

export function getMockFluctuationWarningList(count = 20): FluctuationWarningItem[] {
  return Array.from({ length: count }, (_, i) => {
    const hf = Math.floor(Math.random() * 40 + 5)
    const vf = Math.floor(Math.random() * 30 + 5)
    const triggerRule =
      hf >= 20 && vf >= 15
        ? '双向波动'
        : hf >= 20
          ? '横向波动'
          : vf >= 15
            ? '纵向波动'
            : (['横向波动', '纵向波动'] as const)[i % 2]
    return {
      id: `fw-${i + 1}`,
      name: companyNames[i % companyNames.length],
      horizontalFluctuation: hf,
      verticalFluctuation: vf,
      warningLevel: (['low', 'medium', 'high', 'critical'] as const)[i % 4],
      reason: warningReasons[i % warningReasons.length],
      rankChange: Math.floor(Math.random() * 30 - 15),
      industry: industries[i % industries.length],
      triggerRule,
    }
  })
}

// ===== 10.4 企业筛选器 =====

export interface FilterEnterpriseItem {
  id: string
  name: string
  industry: string
  scale: string
  status: string
  tags: string[]
  revenue: number
  employeeCount: number
  registeredCapital: number
  city: string
  healthScore: number
  riskScore: number
  rdRatio: number
  chainOwnerRelated?: string
  relationType?: string
  complianceLevel?: string
  taxAmount: number
  taxVolatility: number
  taxStability: '稳定' | '一般' | '异常'
  lng: number
  lat: number
}

const scaleOptions = ['大型', '中型', '小型', '微型']
const statusOptions = ['运营中', '已迁出', '已注销', '休眠']
const tagOptions = ['高新技术企业', '专精特新', '上市公司', '绿色工厂', '独角兽', '瞪羚企业']
const complianceLevels = ['优秀', '良好', '一般', '不合规']
const relationTypes = ['一级供应商', '一级客户', '技术合作方', '控股子公司']

const taxStabilityOptions: ('稳定' | '一般' | '异常')[] = ['稳定', '一般', '异常']

export function getMockFilterEnterpriseList(count = 30): FilterEnterpriseItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `fe-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    scale: scaleOptions[i % scaleOptions.length],
    status: statusOptions[i % statusOptions.length],
    tags: tagOptions.slice(i % tagOptions.length, (i % tagOptions.length) + 2),
    revenue: Math.floor(Math.random() * 200000 + 5000),
    employeeCount: Math.floor(Math.random() * 5000 + 50),
    registeredCapital: Math.floor(Math.random() * 50000 + 500),
    city: cities[i % cities.length],
    healthScore: Math.floor(Math.random() * 30 + 70),
    riskScore: Math.floor(Math.random() * 40 + 10),
    rdRatio: +(Math.random() * 8 + 1).toFixed(1),
    chainOwnerRelated: i % 3 === 0 ? companyNames[i % 3] : undefined,
    relationType: i % 3 === 0 ? relationTypes[i % relationTypes.length] : undefined,
    complianceLevel: complianceLevels[i % complianceLevels.length],
    taxAmount: Math.floor(Math.random() * 50000 + 100),
    taxVolatility: +(Math.random() * 30 + 5).toFixed(1),
    taxStability: taxStabilityOptions[i % 3],
    lng: 104.39 + Math.random() * 0.5,
    lat: 30.75 + Math.random() * 0.35,
  }))
}

// ===== 10.5 企业画像 =====

export interface HealthIndexData {
  levelDistribution: { level: string; count: number; color: string }[]
  enterpriseList: {
    id: string
    name: string
    industry: string
    healthScore: number
    level: string
  }[]
}

const healthLevels = [
  { level: '优秀', color: '#4ECB73' },
  { level: '良好', color: '#1889E8' },
  { level: '预警', color: '#FBD437' },
  { level: '高危', color: '#F2637B' },
]

export function getMockHealthIndexData(): HealthIndexData {
  return {
    levelDistribution: healthLevels.map((h, i) => ({
      ...h,
      count: [520, 386, 186, 76][i],
    })),
    enterpriseList: Array.from({ length: 20 }, (_, i) => {
      const score = Math.floor(Math.random() * 50 + 50)
      const level = score >= 90 ? '优秀' : score >= 75 ? '良好' : score >= 60 ? '预警' : '高危'
      return {
        id: `hi-${i + 1}`,
        name: companyNames[i % companyNames.length],
        industry: industries[i % industries.length],
        healthScore: score,
        level,
      }
    }),
  }
}

export interface MultiDimensionPortraitData {
  id: string
  name: string
  industry: string
  scale: string
  established: string
  legalPerson: string
  registeredCapital: number
  revenue: number
  employeeCount: number
  healthScore: number
  tags: string[]
  shareholders: { name: string; ratio: number; type: string }[]
  branches: string[]
  investments: { name: string; ratio: number }[]
  qualifications: { name: string; status: string; validUntil: string }[]
  coordinates?: { lng: number; lat: number }
}

const shareholderTypes = ['国有资本', '民营资本', '外资', '混合所有制']
const qualificationNames = ['高新技术企业', '专精特新', '绿色工厂', 'ISO9001', 'ISO14001', 'CMMI5']
const qualStatuses = ['有效', '即将到期', '已过期']

export function getMockMultiDimensionPortrait(id = 'ent-1'): MultiDimensionPortraitData {
  return {
    id,
    name: companyNames[Math.floor(Math.random() * companyNames.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    scale: scaleOptions[Math.floor(Math.random() * scaleOptions.length)],
    established: `${2005 + Math.floor(Math.random() * 15)}`,
    legalPerson: ['张明', '李华', '王强', '赵刚', '陈伟'][Math.floor(Math.random() * 5)],
    registeredCapital: Math.floor(Math.random() * 50000 + 1000),
    revenue: Math.floor(Math.random() * 200000 + 5000),
    employeeCount: Math.floor(Math.random() * 5000 + 50),
    healthScore: Math.floor(Math.random() * 30 + 70),
    tags: tagOptions.slice(0, Math.floor(Math.random() * 3 + 1)),
    shareholders: Array.from({ length: 3 }, (_, i) => ({
      name: ['德阳市国资', '四川发展控股', '中电科投资'][i % 3],
      ratio: Math.floor(Math.random() * 30 + 10),
      type: shareholderTypes[i % shareholderTypes.length],
    })),
    branches: ['成都分公司', '绵阳办事处', '宜宾生产基地'].slice(
      0,
      Math.floor(Math.random() * 3 + 1),
    ),
    investments: Array.from({ length: 2 }, (_, i) => ({
      name: companyNames[(i + 5) % companyNames.length],
      ratio: Math.floor(Math.random() * 30 + 5),
    })),
    qualifications: qualificationNames.slice(0, Math.floor(Math.random() * 4 + 2)).map((name) => ({
      name,
      status: qualStatuses[Math.floor(Math.random() * qualStatuses.length)],
      validUntil: `2026-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}`,
    })),
    coordinates: {
      lng: 104.3 + Math.random() * 0.8,
      lat: 30.8 + Math.random() * 0.6,
    },
  }
}

export interface ChainRelationNode {
  id: string
  name: string
  category: 'core' | 'supplier' | 'customer' | 'partner'
  industry: string
  controlIndex: number
  orderShare?: number
  patentCitations?: number
}

export interface ChainRelationEdge {
  source: string
  target: string
  relationType: string
  weight: number
}

export interface ChainRelationData {
  nodes: ChainRelationNode[]
  edges: ChainRelationEdge[]
  coreControlIndex: number
}

const relationTypes_edge = ['采购', '销售', '技术合作', '投资']
const nodeCategories = ['supplier', 'customer', 'partner'] as const

export function getMockChainRelationData(): ChainRelationData {
  const coreId = 'core-1'
  const nodes: ChainRelationNode[] = [
    {
      id: coreId,
      name: companyNames[0],
      category: 'core',
      industry: industries[0],
      controlIndex: 72,
      orderShare: 35,
      patentCitations: 128,
    },
  ]
  const edges: ChainRelationEdge[] = []

  // 5 suppliers, 5 customers, 3 partners
  Array.from({ length: 13 }, (_, i) => {
    const category = nodeCategories[i < 5 ? 0 : i < 10 ? 1 : 2]
    const nodeId = `node-${i + 1}`
    nodes.push({
      id: nodeId,
      name: companyNames[(i + 1) % companyNames.length],
      category,
      industry: industries[(i + 1) % industries.length],
      controlIndex: Math.floor(Math.random() * 50 + 20),
      orderShare: Math.floor(Math.random() * 30 + 5),
      patentCitations: Math.floor(Math.random() * 80 + 5),
    })
    edges.push({
      source: category === 'supplier' ? nodeId : coreId,
      target: category === 'supplier' ? coreId : nodeId,
      relationType:
        relationTypes_edge[category === 'supplier' ? 0 : category === 'customer' ? 1 : 2],
      weight: Math.floor(Math.random() * 80 + 20),
    })
  })

  return {
    nodes,
    edges,
    coreControlIndex: 72,
  }
}

// ===== 10.6 企业综合评价 =====

export interface FiveDimensionData {
  dimensions: {
    key: string
    label: string
    score: number
    indicators: { name: string; value: number; unit: string; benchmark: number }[]
  }[]
  enterprises: { name: string; scores: number[] }[]
  trend: { year: number; scores: number[] }[]
}

const fiveDimensionDefs = [
  {
    key: 'operation',
    label: '经营质量',
    indicators: ['营收增速', '净利率', '现金流/负债比'],
    units: ['%', '%', '%'],
  },
  {
    key: 'innovation',
    label: '创新能力',
    indicators: ['有效专利数', '研发投入占比', '技术转化率'],
    units: ['项', '%', '%'],
  },
  {
    key: 'collaboration',
    label: '产业协同',
    indicators: ['本地采购率', '链主订单占比', '专利引用数'],
    units: ['%', '%', '次'],
  },
  {
    key: 'resilience',
    label: '风险韧性',
    indicators: ['ESG评分', '环保处罚记录', '供应链备份指数'],
    units: ['分', '次', '%'],
  },
  {
    key: 'policy',
    label: '政策适配',
    indicators: ['资质匹配度', '政策申报成功率', '补贴依赖度'],
    units: ['%', '%', '%'],
  },
]

export function getMockFiveDimensionData(): FiveDimensionData {
  const dimensions = fiveDimensionDefs.map((def) => ({
    key: def.key,
    label: def.label,
    score: Math.floor(Math.random() * 25 + 70),
    indicators: def.indicators.map((name, j) => ({
      name,
      value: +(Math.random() * 40 + 50).toFixed(1),
      unit: def.units[j],
      benchmark: +(Math.random() * 20 + 55).toFixed(1),
    })),
  }))

  const enterpriseNames = companyNames.slice(0, 5)
  const enterprises = enterpriseNames.map((name) => ({
    name,
    scores: Array.from({ length: 5 }, () => Math.floor(Math.random() * 30 + 65)),
  }))

  const currentYear = new Date().getFullYear()
  const trend = Array.from({ length: 5 }, (_, i) => ({
    year: currentYear - 4 + i,
    scores: Array.from({ length: 5 }, () => Math.floor(Math.random() * 20 + 65)),
  }))

  return { dimensions, enterprises, trend }
}
