// 产业对比分析 Mock 数据工厂
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
  IndustryProportion,
  ProvinceProportion,
  GlobalProportionData,
  HeatmapRegion,
  HeatmapData,
  DashboardData,
} from '@/api/types/benchmarking'

// ===== 区域基础数据 =====

const regions: CompareRegion[] = [
  { id: 'cyj', name: '长三角地区', shortName: '长三角', level: '国家级', gdp: 28560 },
  { id: 'zsj', name: '珠三角地区', shortName: '珠三角', level: '国家级', gdp: 21340 },
  { id: 'jjj', name: '京津冀地区', shortName: '京津冀', level: '国家级', gdp: 15680 },
  { id: 'cy', name: '成渝地区', shortName: '成渝', level: '国家级', gdp: 10240 },
  { id: 'zb', name: '中部地区', shortName: '中部', level: '国家级', gdp: 9800 },
  { id: 'dng', name: '东北地区', shortName: '东北', level: '国家级', gdp: 5680 },
]

// ===== 产业规模 =====

const scaleData: Record<string, ScaleIndicators> = {
  cyj: {
    regionId: 'cyj',
    regionName: '长三角',
    enterpriseCount: 6820,
    totalOutput: 28560,
    addedValue: 9520,
    taxContribution: 3280,
    fixedAssetInvestment: 4150,
    outputPerArea: 128.5,
    outputPerCapita: 68.2,
    growth: 9.2,
    employeeCount: 42,
  },
  zsj: {
    regionId: 'zsj',
    regionName: '珠三角',
    enterpriseCount: 5280,
    totalOutput: 21340,
    addedValue: 7120,
    taxContribution: 2450,
    fixedAssetInvestment: 3280,
    outputPerArea: 115.6,
    outputPerCapita: 62.5,
    growth: 8.6,
    employeeCount: 35,
  },
  jjj: {
    regionId: 'jjj',
    regionName: '京津冀',
    enterpriseCount: 4120,
    totalOutput: 15680,
    addedValue: 5230,
    taxContribution: 1820,
    fixedAssetInvestment: 2650,
    outputPerArea: 98.2,
    outputPerCapita: 55.8,
    growth: 7.8,
    employeeCount: 28,
  },
  cy: {
    regionId: 'cy',
    regionName: '成渝',
    enterpriseCount: 3280,
    totalOutput: 10240,
    addedValue: 3420,
    taxContribution: 1180,
    fixedAssetInvestment: 2180,
    outputPerArea: 76.5,
    outputPerCapita: 46.5,
    growth: 10.5,
    employeeCount: 22,
  },
  zb: {
    regionId: 'zb',
    regionName: '中部',
    enterpriseCount: 5360,
    totalOutput: 9800,
    addedValue: 3280,
    taxContribution: 1050,
    fixedAssetInvestment: 1960,
    outputPerArea: 62.8,
    outputPerCapita: 42.3,
    growth: 7.2,
    employeeCount: 29,
  },
  dng: {
    regionId: 'dng',
    regionName: '东北',
    enterpriseCount: 2450,
    totalOutput: 5680,
    addedValue: 1860,
    taxContribution: 680,
    fixedAssetInvestment: 1280,
    outputPerArea: 45.2,
    outputPerCapita: 38.5,
    growth: 4.8,
    employeeCount: 15,
  },
}

const scaleTrendYears = ['2020', '2021', '2022', '2023', '2024', '2025']

const scaleTrendData: Record<string, number[]> = {
  长三角: [21000, 23000, 24500, 26000, 27500, 28560],
  珠三角: [16000, 17500, 18500, 19600, 20500, 21340],
  京津冀: [12000, 13000, 13800, 14500, 15100, 15680],
  成渝: [7200, 8000, 8600, 9200, 9800, 10240],
  中部: [6800, 7500, 8100, 8600, 9200, 9800],
  东北: [4800, 5000, 5200, 5350, 5500, 5680],
}

// ===== 产业结构 =====

const structureData: Record<string, StructureIndicators> = {
  cyj: {
    regionId: 'cyj',
    regionName: '长三角',
    dominantIndustries: [
      { name: '高端装备制造', value: 28.5 },
      { name: '电子信息', value: 22.3 },
      { name: '新材料', value: 18.6 },
      { name: '生物医药', value: 14.2 },
      { name: '新能源', value: 10.8 },
    ],
    subIndustries: [
      { parent: '电子信息', name: '集成电路', share: 8.5 },
      { parent: '电子信息', name: '显示面板', share: 6.2 },
      { parent: '电子信息', name: '通信设备', share: 4.8 },
      { parent: '电子信息', name: '智能终端', share: 2.8 },
      { parent: '高端装备制造', name: '数控机床', share: 9.2 },
      { parent: '高端装备制造', name: '工业机器人', share: 8.5 },
      { parent: '高端装备制造', name: '航空航天装备', share: 6.3 },
      { parent: '新材料', name: '先进钢铁材料', share: 7.8 },
      { parent: '新材料', name: '碳纤维复合材料', share: 5.6 },
      { parent: '生物医药', name: '创新药', share: 6.2 },
      { parent: '生物医药', name: '医疗器械', share: 5.0 },
    ],
    chainCompleteness: { upstream: 78, midstream: 85, downstream: 72, overall: 78.3 },
    highTechRatio: 42.1,
    advancedManufacturingRatio: 38.5,
    traditionalRatio: 22.5,
  },
  zsj: {
    regionId: 'zsj',
    regionName: '珠三角',
    dominantIndustries: [
      { name: '电子信息', value: 32.5 },
      { name: '高端装备制造', value: 22.8 },
      { name: '生物医药', value: 16.5 },
      { name: '新能源', value: 12.2 },
      { name: '新材料', value: 9.8 },
    ],
    subIndustries: [
      { parent: '电子信息', name: '集成电路', share: 10.2 },
      { parent: '电子信息', name: '智能终端', share: 8.5 },
      { parent: '电子信息', name: '通信设备', share: 7.8 },
      { parent: '电子信息', name: '显示面板', share: 6.0 },
      { parent: '高端装备制造', name: '工业机器人', share: 8.2 },
      { parent: '高端装备制造', name: '数控机床', share: 7.5 },
      { parent: '生物医药', name: '创新药', share: 7.2 },
      { parent: '生物医药', name: '医疗器械', share: 5.8 },
      { parent: '新能源', name: '锂电池', share: 6.5 },
      { parent: '新能源', name: '光伏', share: 3.8 },
    ],
    chainCompleteness: { upstream: 72, midstream: 88, downstream: 80, overall: 80.0 },
    highTechRatio: 45.6,
    advancedManufacturingRatio: 36.2,
    traditionalRatio: 20.3,
  },
  jjj: {
    regionId: 'jjj',
    regionName: '京津冀',
    dominantIndustries: [
      { name: '高端装备制造', value: 25.2 },
      { name: '生物医药', value: 20.8 },
      { name: '新材料', value: 18.5 },
      { name: '新能源', value: 15.2 },
      { name: '电子信息', value: 12.3 },
    ],
    subIndustries: [
      { parent: '高端装备制造', name: '航空航天装备', share: 9.5 },
      { parent: '高端装备制造', name: '数控机床', share: 7.2 },
      { parent: '生物医药', name: '创新药', share: 8.8 },
      { parent: '生物医药', name: '医疗器械', share: 6.5 },
      { parent: '新材料', name: '先进钢铁材料', share: 8.2 },
      { parent: '新材料', name: '碳纤维复合材料', share: 5.8 },
      { parent: '新能源', name: '风电', share: 6.2 },
      { parent: '新能源', name: '光伏', share: 5.0 },
    ],
    chainCompleteness: { upstream: 68, midstream: 75, downstream: 65, overall: 69.3 },
    highTechRatio: 38.9,
    advancedManufacturingRatio: 32.8,
    traditionalRatio: 28.2,
  },
  cy: {
    regionId: 'cy',
    regionName: '成渝',
    dominantIndustries: [
      { name: '电子信息', value: 30.2 },
      { name: '高端装备制造', value: 22.5 },
      { name: '新能源', value: 18.8 },
      { name: '新材料', value: 15.2 },
      { name: '生物医药', value: 8.5 },
    ],
    subIndustries: [
      { parent: '电子信息', name: '集成电路', share: 12.5 },
      { parent: '电子信息', name: '显示面板', share: 9.8 },
      { parent: '电子信息', name: '智能终端', share: 7.9 },
      { parent: '新能源', name: '锂电池', share: 8.2 },
      { parent: '新能源', name: '新能源汽车', share: 6.8 },
      { parent: '高端装备制造', name: '航空航天装备', share: 7.5 },
      { parent: '高端装备制造', name: '数控机床', share: 6.2 },
    ],
    chainCompleteness: { upstream: 58, midstream: 72, downstream: 68, overall: 66.0 },
    highTechRatio: 32.5,
    advancedManufacturingRatio: 40.2,
    traditionalRatio: 35.8,
  },
  zb: {
    regionId: 'zb',
    regionName: '中部',
    dominantIndustries: [
      { name: '高端装备制造', value: 26.5 },
      { name: '新材料', value: 20.8 },
      { name: '新能源', value: 18.2 },
      { name: '电子信息', value: 15.5 },
      { name: '生物医药', value: 10.2 },
    ],
    subIndustries: [
      { parent: '高端装备制造', name: '数控机床', share: 10.2 },
      { parent: '高端装备制造', name: '工程机械', share: 8.5 },
      { parent: '新材料', name: '先进钢铁材料', share: 9.8 },
      { parent: '新材料', name: '有色金属', share: 6.5 },
      { parent: '新能源', name: '光伏', share: 8.2 },
      { parent: '新能源', name: '锂电池', share: 5.8 },
      { parent: '电子信息', name: '显示面板', share: 6.5 },
    ],
    chainCompleteness: { upstream: 55, midstream: 68, downstream: 60, overall: 61.0 },
    highTechRatio: 28.6,
    advancedManufacturingRatio: 42.5,
    traditionalRatio: 40.2,
  },
  dng: {
    regionId: 'dng',
    regionName: '东北',
    dominantIndustries: [
      { name: '高端装备制造', value: 35.2 },
      { name: '新材料', value: 22.5 },
      { name: '生物医药', value: 15.8 },
      { name: '新能源', value: 12.5 },
      { name: '电子信息', value: 8.2 },
    ],
    subIndustries: [
      { parent: '高端装备制造', name: '航空航天装备', share: 12.5 },
      { parent: '高端装备制造', name: '数控机床', share: 10.8 },
      { parent: '高端装备制造', name: '工程机械', share: 8.2 },
      { parent: '新材料', name: '先进钢铁材料', share: 12.5 },
      { parent: '新材料', name: '有色金属', share: 5.8 },
      { parent: '生物医药', name: '创新药', share: 6.5 },
      { parent: '生物医药', name: '医疗器械', share: 5.2 },
    ],
    chainCompleteness: { upstream: 62, midstream: 70, downstream: 55, overall: 62.3 },
    highTechRatio: 22.8,
    advancedManufacturingRatio: 38.5,
    traditionalRatio: 45.2,
  },
}

// ===== 经济效益 =====

const economicData: Record<string, EconomicIndicators> = {
  cyj: {
    regionId: 'cyj',
    regionName: '长三角',
    profitRate: 14.2,
    revenueGrowth: 12.5,
    taxGrowth: 10.8,
    roi: 17.5,
    outputPerEnergy: 2.86,
    carbonIntensity: 0.28,
    taxPerCapita: 10.8,
    outputPerCapita: 68.2,
  },
  zsj: {
    regionId: 'zsj',
    regionName: '珠三角',
    profitRate: 13.8,
    revenueGrowth: 11.8,
    taxGrowth: 9.5,
    roi: 16.2,
    outputPerEnergy: 2.63,
    carbonIntensity: 0.32,
    taxPerCapita: 9.6,
    outputPerCapita: 62.5,
  },
  jjj: {
    regionId: 'jjj',
    regionName: '京津冀',
    profitRate: 12.5,
    revenueGrowth: 9.8,
    taxGrowth: 8.2,
    roi: 15.0,
    outputPerEnergy: 2.38,
    carbonIntensity: 0.38,
    taxPerCapita: 8.2,
    outputPerCapita: 55.8,
  },
  cy: {
    regionId: 'cy',
    regionName: '成渝',
    profitRate: 11.2,
    revenueGrowth: 14.5,
    taxGrowth: 12.8,
    roi: 13.8,
    outputPerEnergy: 2.08,
    carbonIntensity: 0.42,
    taxPerCapita: 7.5,
    outputPerCapita: 46.5,
  },
  zb: {
    regionId: 'zb',
    regionName: '中部',
    profitRate: 10.8,
    revenueGrowth: 8.5,
    taxGrowth: 7.2,
    roi: 12.5,
    outputPerEnergy: 1.92,
    carbonIntensity: 0.48,
    taxPerCapita: 6.8,
    outputPerCapita: 42.3,
  },
  dng: {
    regionId: 'dng',
    regionName: '东北',
    profitRate: 8.5,
    revenueGrowth: 5.2,
    taxGrowth: 4.5,
    roi: 10.2,
    outputPerEnergy: 1.56,
    carbonIntensity: 0.58,
    taxPerCapita: 5.2,
    outputPerCapita: 38.5,
  },
}

const economicTrendYears = ['2020', '2021', '2022', '2023', '2024', '2025']

const economicTrendData: Record<string, number[]> = {
  长三角: [12.5, 12.8, 13.2, 13.6, 13.9, 14.2],
  珠三角: [11.8, 12.2, 12.5, 13.0, 13.4, 13.8],
  京津冀: [10.5, 11.0, 11.5, 11.8, 12.2, 12.5],
  成渝: [8.5, 9.2, 9.8, 10.2, 10.8, 11.2],
  中部: [8.8, 9.2, 9.6, 10.0, 10.5, 10.8],
  东北: [7.2, 7.5, 7.8, 8.0, 8.2, 8.5],
}

// ===== 创新能力 =====

const innovationData: Record<string, InnovationIndicators> = {
  cyj: {
    regionId: 'cyj',
    regionName: '长三角',
    rdRatio: 3.8,
    highTechEnterpriseCount: 10860,
    patentCount: 56200,
    techTradeAmount: 3280,
    innovationPlatformCount: 186,
    rdTalentCount: 8.2,
    innovationIndex: 92,
  },
  zsj: {
    regionId: 'zsj',
    regionName: '珠三角',
    rdRatio: 3.5,
    highTechEnterpriseCount: 9520,
    patentCount: 48500,
    techTradeAmount: 2860,
    innovationPlatformCount: 152,
    rdTalentCount: 6.8,
    innovationIndex: 88,
  },
  jjj: {
    regionId: 'jjj',
    regionName: '京津冀',
    rdRatio: 3.2,
    highTechEnterpriseCount: 8250,
    patentCount: 42300,
    techTradeAmount: 2150,
    innovationPlatformCount: 168,
    rdTalentCount: 5.6,
    innovationIndex: 82,
  },
  cy: {
    regionId: 'cy',
    regionName: '成渝',
    rdRatio: 2.5,
    highTechEnterpriseCount: 4280,
    patentCount: 21800,
    techTradeAmount: 860,
    innovationPlatformCount: 72,
    rdTalentCount: 4.2,
    innovationIndex: 68,
  },
  zb: {
    regionId: 'zb',
    regionName: '中部',
    rdRatio: 2.2,
    highTechEnterpriseCount: 2910,
    patentCount: 17720,
    techTradeAmount: 620,
    innovationPlatformCount: 58,
    rdTalentCount: 3.7,
    innovationIndex: 58,
  },
  dng: {
    regionId: 'dng',
    regionName: '东北',
    rdRatio: 1.8,
    highTechEnterpriseCount: 1850,
    patentCount: 12800,
    techTradeAmount: 380,
    innovationPlatformCount: 85,
    rdTalentCount: 2.5,
    innovationIndex: 48,
  },
}

const innovationTrendYears = ['2020', '2021', '2022', '2023', '2024', '2025']

const innovationTrendData: Record<string, number[]> = {
  长三角: [78, 82, 85, 88, 90, 92],
  珠三角: [72, 76, 80, 83, 86, 88],
  京津冀: [68, 72, 75, 78, 80, 82],
  成渝: [52, 56, 60, 63, 66, 68],
  中部: [42, 46, 50, 53, 56, 58],
  东北: [35, 38, 40, 43, 45, 48],
}

// ===== 人才资源 =====

const talentData: Record<string, TalentIndicators> = {
  cyj: {
    regionId: 'cyj',
    regionName: '长三角',
    totalEmployees: 82,
    seniorTalentRatio: 22.5,
    talentPolicyScore: 92,
    universities: 86,
    researchInstitutes: 128,
    rdTalentCount: 8.2,
    netInflowRate: 5.2,
    avgSalary: 22.8,
  },
  zsj: {
    regionId: 'zsj',
    regionName: '珠三角',
    totalEmployees: 68,
    seniorTalentRatio: 20.8,
    talentPolicyScore: 88,
    universities: 62,
    researchInstitutes: 95,
    rdTalentCount: 6.8,
    netInflowRate: 4.5,
    avgSalary: 21.5,
  },
  jjj: {
    regionId: 'jjj',
    regionName: '京津冀',
    totalEmployees: 56,
    seniorTalentRatio: 19.2,
    talentPolicyScore: 85,
    universities: 105,
    researchInstitutes: 156,
    rdTalentCount: 5.6,
    netInflowRate: 3.8,
    avgSalary: 20.2,
  },
  cy: {
    regionId: 'cy',
    regionName: '成渝',
    totalEmployees: 42,
    seniorTalentRatio: 15.6,
    talentPolicyScore: 78,
    universities: 52,
    researchInstitutes: 48,
    rdTalentCount: 4.2,
    netInflowRate: 2.8,
    avgSalary: 15.8,
  },
  zb: {
    regionId: 'zb',
    regionName: '中部',
    totalEmployees: 37,
    seniorTalentRatio: 13.2,
    talentPolicyScore: 72,
    universities: 68,
    researchInstitutes: 42,
    rdTalentCount: 3.7,
    netInflowRate: 1.5,
    avgSalary: 14.5,
  },
  dng: {
    regionId: 'dng',
    regionName: '东北',
    totalEmployees: 15,
    seniorTalentRatio: 12.5,
    talentPolicyScore: 65,
    universities: 78,
    researchInstitutes: 62,
    rdTalentCount: 2.5,
    netInflowRate: -2.5,
    avgSalary: 12.8,
  },
}

const talentTrendYears = ['2020', '2021', '2022', '2023', '2024', '2025']

const talentTrendData: Record<string, number[]> = {
  长三角: [68, 72, 75, 78, 80, 82],
  珠三角: [55, 58, 62, 64, 66, 68],
  京津冀: [48, 50, 52, 53, 55, 56],
  成渝: [32, 35, 37, 39, 41, 42],
  中部: [28, 30, 32, 34, 35, 37],
  东北: [18, 17, 16, 16, 15, 15],
}

// ===== 导出函数 =====

export function getMockRegions(): CompareRegion[] {
  return [...regions]
}

export function getMockScaleData(regionIds: string[]): ScaleIndicators[] {
  return regionIds.map((id) => scaleData[id]).filter(Boolean)
}

export function getMockScaleTrend(regionNames: string[]): ScaleTrendItem[] {
  return scaleTrendYears.map((year, i) => {
    const item: ScaleTrendItem = { year }
    regionNames.forEach((name) => {
      item[name] = scaleTrendData[name]?.[i] ?? 0
    })
    return item
  })
}

export function getMockStructureData(regionIds: string[]): StructureIndicators[] {
  return regionIds.map((id) => structureData[id]).filter(Boolean)
}

export function getMockEconomicData(regionIds: string[]): EconomicIndicators[] {
  return regionIds.map((id) => economicData[id]).filter(Boolean)
}

export function getMockEconomicTrend(regionNames: string[]): EconomicTrendItem[] {
  return economicTrendYears.map((year, i) => {
    const item: EconomicTrendItem = { year }
    regionNames.forEach((name) => {
      item[name] = economicTrendData[name]?.[i] ?? 0
    })
    return item
  })
}

export function getMockInnovationData(regionIds: string[]): InnovationIndicators[] {
  return regionIds.map((id) => innovationData[id]).filter(Boolean)
}

export function getMockInnovationTrend(regionNames: string[]): InnovationTrendItem[] {
  return innovationTrendYears.map((year, i) => {
    const item: InnovationTrendItem = { year }
    regionNames.forEach((name) => {
      item[name] = innovationTrendData[name]?.[i] ?? 0
    })
    return item
  })
}

export function getMockTalentData(regionIds: string[]): TalentIndicators[] {
  return regionIds.map((id) => talentData[id]).filter(Boolean)
}

export function getMockTalentTrend(regionNames: string[]): TalentTrendItem[] {
  return talentTrendYears.map((year, i) => {
    const item: TalentTrendItem = { year }
    regionNames.forEach((name) => {
      item[name] = talentTrendData[name]?.[i] ?? 0
    })
    return item
  })
}

// ===== 产业占比分析 =====

// 全局产业分布
const globalProportionIndustries: IndustryProportion[] = [
  {
    name: '电子信息',
    outputShare: 18.5,
    taxShare: 16.2,
    enterpriseShare: 15.8,
    employmentShare: 14.2,
    outputValue: 16820,
    taxValue: 2580,
    enterpriseCount: 4250,
    employmentCount: 68.5,
    growth: 9.2,
  },
  {
    name: '高端装备',
    outputShare: 14.5,
    taxShare: 15.8,
    enterpriseShare: 12.5,
    employmentShare: 13.8,
    outputValue: 13180,
    taxValue: 2510,
    enterpriseCount: 3380,
    employmentCount: 66.2,
    growth: 7.5,
  },
  {
    name: '生物医药',
    outputShare: 10.8,
    taxShare: 12.5,
    enterpriseShare: 10.2,
    employmentShare: 8.5,
    outputValue: 9820,
    taxValue: 1980,
    enterpriseCount: 2750,
    employmentCount: 40.8,
    growth: 12.8,
  },
  {
    name: '新材料',
    outputShare: 9.5,
    taxShare: 8.8,
    enterpriseShare: 9.8,
    employmentShare: 10.2,
    outputValue: 8640,
    taxValue: 1398,
    enterpriseCount: 2650,
    employmentCount: 48.5,
    growth: 8.6,
  },
  {
    name: '新能源',
    outputShare: 8.2,
    taxShare: 7.5,
    enterpriseShare: 8.5,
    employmentShare: 7.8,
    outputValue: 7450,
    taxValue: 1190,
    enterpriseCount: 2300,
    employmentCount: 37.2,
    growth: 15.2,
  },
  {
    name: '现代服务',
    outputShare: 12.5,
    taxShare: 14.2,
    enterpriseShare: 16.5,
    employmentShare: 18.5,
    outputValue: 11380,
    taxValue: 2258,
    enterpriseCount: 4480,
    employmentCount: 88.5,
    growth: 6.8,
  },
  {
    name: '节能环保',
    outputShare: 5.2,
    taxShare: 4.5,
    enterpriseShare: 6.8,
    employmentShare: 5.2,
    outputValue: 4730,
    taxValue: 715,
    enterpriseCount: 1840,
    employmentCount: 24.8,
    growth: 10.5,
  },
  {
    name: '数字创意',
    outputShare: 6.8,
    taxShare: 5.5,
    enterpriseShare: 7.2,
    employmentShare: 5.8,
    outputValue: 6180,
    taxValue: 875,
    enterpriseCount: 1950,
    employmentCount: 27.5,
    growth: 18.2,
  },
  {
    name: '其他',
    outputShare: 14.0,
    taxShare: 15.0,
    enterpriseShare: 12.7,
    employmentShare: 16.0,
    outputValue: 12720,
    taxValue: 2384,
    enterpriseCount: 3440,
    employmentCount: 76.2,
    growth: 4.5,
  },
]

const provinceOutputData: ProvinceProportion[] = [
  { name: '广东', value: 12850 },
  { name: '江苏', value: 11680 },
  { name: '山东', value: 9150 },
  { name: '浙江', value: 8680 },
  { name: '河南', value: 6520 },
  { name: '四川', value: 6180 },
  { name: '湖北', value: 5420 },
  { name: '湖南', value: 5180 },
  { name: '福建', value: 4850 },
  { name: '安徽', value: 4520 },
  { name: '河北', value: 4280 },
  { name: '上海', value: 3980 },
]

const provinceTaxData: ProvinceProportion[] = [
  { name: '广东', value: 2050 },
  { name: '江苏', value: 1860 },
  { name: '浙江', value: 1380 },
  { name: '山东', value: 1250 },
  { name: '上海', value: 1120 },
  { name: '北京', value: 1080 },
  { name: '四川', value: 980 },
  { name: '河南', value: 860 },
  { name: '湖北', value: 750 },
  { name: '福建', value: 680 },
]

const provinceEnterpriseData: ProvinceProportion[] = [
  { name: '广东', value: 3580 },
  { name: '江苏', value: 3120 },
  { name: '浙江', value: 2850 },
  { name: '山东', value: 2680 },
  { name: '河南', value: 2150 },
  { name: '四川', value: 1980 },
  { name: '湖北', value: 1650 },
  { name: '湖南', value: 1520 },
  { name: '安徽', value: 1380 },
  { name: '河北', value: 1250 },
]

const provinceEmploymentData: ProvinceProportion[] = [
  { name: '广东', value: 185.2 },
  { name: '江苏', value: 162.8 },
  { name: '山东', value: 148.5 },
  { name: '浙江', value: 135.2 },
  { name: '河南', value: 112.5 },
  { name: '四川', value: 98.5 },
  { name: '湖北', value: 82.3 },
  { name: '湖南', value: 78.5 },
  { name: '河北', value: 72.8 },
  { name: '安徽', value: 65.2 },
]

// 热力图数据 - 凯州新城/德阳/四川相关区域
const heatmapRegions: HeatmapRegion[] = [
  {
    id: 'kaizhou',
    name: '凯州新城',
    lng: 104.612,
    lat: 30.884,
    density: { 电子信息: 92, 高端装备: 85, 生物医药: 65, 新材料: 58, 新能源: 72 },
    totalDensity: 92,
    type: '新兴科技园区',
  },
  {
    id: 'jingyang',
    name: '旌阳区',
    lng: 104.395,
    lat: 31.128,
    density: { 电子信息: 78, 高端装备: 88, 生物医药: 52, 新材料: 62, 新能源: 45 },
    totalDensity: 78,
    type: '高密度工业区',
  },
  {
    id: 'luojiang',
    name: '罗江区',
    lng: 104.508,
    lat: 31.318,
    density: { 电子信息: 45, 高端装备: 72, 生物医药: 38, 新材料: 55, 新能源: 42 },
    totalDensity: 55,
    type: '传统产业区',
  },
  {
    id: 'guanghan',
    name: '广汉市',
    lng: 104.282,
    lat: 30.978,
    density: { 电子信息: 68, 高端装备: 78, 生物医药: 45, 新材料: 42, 新能源: 38 },
    totalDensity: 68,
    type: '高密度工业区',
  },
  {
    id: 'shifang',
    name: '什邡市',
    lng: 104.168,
    lat: 31.128,
    density: { 电子信息: 35, 高端装备: 55, 生物医药: 62, 新材料: 72, 新能源: 28 },
    totalDensity: 55,
    type: '传统产业区',
  },
  {
    id: 'mianzhu',
    name: '绵竹市',
    lng: 104.208,
    lat: 31.338,
    density: { 电子信息: 28, 高端装备: 48, 生物医药: 42, 新材料: 65, 新能源: 35 },
    totalDensity: 45,
    type: '传统产业区',
  },
  {
    id: 'zhongjiang',
    name: '中江县',
    lng: 104.678,
    lat: 31.048,
    density: { 电子信息: 52, 高端装备: 38, 生物医药: 35, 新材料: 28, 新能源: 58 },
    totalDensity: 48,
    type: '新兴科技园区',
  },
  {
    id: 'deyang_dev',
    name: '德阳经开区',
    lng: 104.418,
    lat: 31.058,
    density: { 电子信息: 82, 高端装备: 92, 生物医药: 48, 新材料: 45, 新能源: 52 },
    totalDensity: 85,
    type: '高密度工业区',
  },
  {
    id: 'tianfu',
    name: '天府新区',
    lng: 104.068,
    lat: 30.518,
    density: { 电子信息: 88, 高端装备: 72, 生物医药: 85, 新材料: 62, 新能源: 68 },
    totalDensity: 88,
    type: '新兴科技园区',
  },
  {
    id: 'chengdu_hi',
    name: '成都高新区',
    lng: 104.068,
    lat: 30.578,
    density: { 电子信息: 95, 高端装备: 68, 生物医药: 92, 新材料: 55, 新能源: 62 },
    totalDensity: 95,
    type: '新兴科技园区',
  },
  {
    id: 'mianyang',
    name: '绵阳高新区',
    lng: 104.738,
    lat: 31.468,
    density: { 电子信息: 75, 高端装备: 62, 生物医药: 42, 新材料: 48, 新能源: 38 },
    totalDensity: 62,
    type: '高密度工业区',
  },
  {
    id: 'yibin',
    name: '宜宾临港经开区',
    lng: 104.628,
    lat: 28.768,
    density: { 电子信息: 72, 高端装备: 35, 生物医药: 28, 新材料: 42, 新能源: 85 },
    totalDensity: 72,
    type: '新兴科技园区',
  },
]

const heatmapIndustryTypes = ['电子信息', '高端装备', '生物医药', '新材料', '新能源']

// 动态看板数据
const dashboardTrendMonths = ['1月', '2月', '3月', '4月', '5月', '6月']

const dashboardIndustryTrends = [
  { name: '电子信息', data: [17.5, 17.8, 18.0, 18.2, 18.3, 18.5] },
  { name: '高端装备', data: [14.2, 14.3, 14.4, 14.5, 14.5, 14.5] },
  { name: '生物医药', data: [10.5, 10.6, 10.7, 10.8, 10.8, 10.8] },
  { name: '新能源', data: [7.2, 7.5, 7.8, 7.9, 8.0, 8.2] },
]

const dashboardRegionCompares = [
  { name: '长三角', current: 28.5, lastYear: 27.8 },
  { name: '珠三角', current: 22.3, lastYear: 22.0 },
  { name: '京津冀', current: 16.8, lastYear: 17.2 },
  { name: '成渝', current: 12.5, lastYear: 12.0 },
  { name: '中部', current: 12.2, lastYear: 12.8 },
  { name: '东北', current: 7.7, lastYear: 8.2 },
]

const dashboardChangeRanking = [
  { name: '电子信息', value: 1.5 },
  { name: '新能源', value: 1.2 },
  { name: '生物医药', value: 0.8 },
  { name: '高端装备', value: 0.5 },
  { name: '新材料', value: -0.8 },
  { name: '现代服务', value: -1.2 },
]

// ===== 导出函数 =====

export function getMockGlobalProportion(): GlobalProportionData {
  return {
    kpiCards: { totalIndustry: 42, coverageRate: 86.5, advantageIndustry: 12, industryCluster: 28 },
    industries: [...globalProportionIndustries],
    provinceData: {
      output: [...provinceOutputData],
      tax: [...provinceTaxData],
      enterprise: [...provinceEnterpriseData],
      employment: [...provinceEmploymentData],
    },
  }
}

export function getMockHeatmapData(): HeatmapData {
  return {
    kpiCards: { maxDensity: 95, avgDensity: 68.5, hotspotCount: 8, coldspotCount: 4 },
    regions: [...heatmapRegions],
    industryTypes: [...heatmapIndustryTypes],
  }
}

export function getMockDashboardData(): DashboardData {
  return {
    kpiCards: { monitorCount: 42, risingCount: 18, fallingCount: 8, stableCount: 16 },
    industryTrends: [...dashboardIndustryTrends],
    trendMonths: [...dashboardTrendMonths],
    regionCompares: [...dashboardRegionCompares],
    growthTrend: {
      yearOnYear: [5.2, 5.8, 6.1, 6.5, 7.2, 8.5],
      monthOnMonth: [1.2, 0.8, 1.5, 1.0, 1.3, 0.9],
    },
    changeRanking: [...dashboardChangeRanking],
  }
}
