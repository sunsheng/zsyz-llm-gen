// 企业监测 Mock 数据工厂

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

const industries = [
  '清洁能源装备',
  '先进材料',
  '电子信息',
  '高端装备制造',
  '生物医药',
  '新能源',
  '节能环保',
  '现代服务业',
]
const companyNames = [
  '东方电机有限公司',
  '中国二重集团',
  '国机重装',
  '华创新材料科技',
  '东方精密制造',
  '博远生物医药',
  '天域半导体',
  '绿能新能源',
  '中科智联信息',
  '鼎盛环保科技',
  '创想数字技术',
  '恒达装备制造',
  '瑞丰新材料',
  '恒宇光电科技',
  '昌盛药业集团',
  '芯源集成电路',
  '亿能动力电池',
  '安泰环保设备',
  '智汇信息技术',
  '云帆数据科技',
]
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
  return industries.map((name, i) => ({
    name,
    value: Math.floor(Math.random() * 300 + 50),
  }))
}

export function getMockEvaluationData() {
  return {
    dimensions: ['盈利能力', '成长潜力', '创新能力', '市场竞争力', '风险控制'],
    enterprises: companyNames.slice(0, 5).map((name, i) => ({
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
  outputTrend: { year: number; totalOutput: number; cleanEnergyOutput: number }[]
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
