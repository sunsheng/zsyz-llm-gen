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

const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源', '节能环保', '数字创意', '现代服务业']
const companyNames = [
  '华创新材料科技', '东方精密制造', '博远生物医药', '天域半导体', '绿能新能源',
  '中科智联信息', '鼎盛环保科技', '创想数字技术', '恒达装备制造', '瑞丰新材料',
  '恒宇光电科技', '昌盛药业集团', '芯源集成电路', '亿能动力电池', '安泰环保设备',
  '智汇信息技术', '云帆数据科技', '铭远精密仪器', '盛达新材料', '宏图半导体'
]
const cities = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '台州市']

export function getMockMonitorKpi(): MonitorKpi[] {
  return [
    { key: 'total', label: '监测企业', value: 1286, unit: '家', trend: 'up', trendValue: '+42', icon: 'Monitor', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
    { key: 'healthy', label: '健康企业', value: 1024, unit: '家', trend: 'up', trendValue: '+5.2%', icon: 'CircleCheck', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
    { key: 'warning', label: '预警企业', value: 186, unit: '家', trend: 'down', trendValue: '-3.8%', icon: 'Warning', iconColor: '#FBD437', iconBgColor: '#FFF8E6' },
    { key: 'risk', label: '风险企业', value: 76, unit: '家', trend: 'up', trendValue: '+2.1%', icon: 'CircleClose', iconColor: '#F2637B', iconBgColor: '#FEF0F0' }
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
    socialScore: Math.floor(Math.random() * 35 + 65)
  }))
}

export function getMockRevenueRanking(count = 20): RankingItem[] {
  return companyNames.slice(0, count).map((name, i) => ({
    rank: i + 1,
    id: `rank-${i + 1}`,
    name,
    industry: industries[i % industries.length],
    value: Math.floor(Math.random() * 200000 + 10000),
    growth: Math.floor(Math.random() * 40 - 5),
    city: cities[i % cities.length]
  })).sort((a, b) => b.value - a.value).map((item, i) => ({ ...item, rank: i + 1 }))
}

export function getMockGrowthRanking(count = 20): RankingItem[] {
  return companyNames.slice(0, count).map((name, i) => ({
    rank: i + 1,
    id: `growth-${i + 1}`,
    name,
    industry: industries[i % industries.length],
    value: Math.floor(Math.random() * 200 + 5),
    growth: Math.floor(Math.random() * 80 + 10),
    city: cities[i % cities.length]
  })).sort((a, b) => b.growth - a.growth).map((item, i) => ({ ...item, rank: i + 1 }))
}

export function getMockEnterpriseDistribution() {
  return industries.map((name, i) => ({
    name,
    value: Math.floor(Math.random() * 300 + 50)
  }))
}

export function getMockEvaluationData() {
  return {
    dimensions: ['盈利能力', '成长潜力', '创新能力', '市场竞争力', '风险控制'],
    enterprises: companyNames.slice(0, 5).map((name, i) => ({
      name,
      scores: Array.from({ length: 5 }, () => Math.floor(Math.random() * 30 + 70))
    }))
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
    riskScore: Math.floor(Math.random() * 30 + 10)
  }
}
