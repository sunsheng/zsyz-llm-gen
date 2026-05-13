// 精准招商 Mock 数据工厂

export interface InvestTarget {
  id: string
  name: string
  industry: string
  region: string
  matchScore: number
  chainPosition: string
  investmentAmount: number
  status: '待接触' | '已接触' | '洽谈中' | '已签约'
  tags: string[]
}

export interface InvestRecommendResult {
  id: string
  targetName: string
  chainName: string
  matchScore: number
  reasons: string[]
  estimatedInvestment: number
  priority: '高' | '中' | '低'
}

export interface InvestProject {
  id: string
  name: string
  industry: string
  type: string
  investmentAmount: number
  area: number
  jobs: number
  status: string
  progress: number
}

const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源', '节能环保', '数字创意', '现代服务业']
const regions = ['北京市', '上海市', '深圳市', '广州市', '苏州市', '成都市', '武汉市', '南京市']
const chainPositions = ['上游-原材料', '上游-核心部件', '中游-整机制造', '中游-系统集成', '下游-应用服务', '下游-运维保障']
const tagOptions = ['上市公司', '行业龙头', '专精特新', '高新技术企业', '外资企业', '独角兽', '瞪羚企业']
const companyNames = [
  '中芯国际', '宁德时代', '隆基绿能', '比亚迪半导体', '药明康德',
  '迈瑞医疗', '三一重工', '大疆创新', '海康威视', '科大讯飞',
  '紫光集团', '长电科技', '韦尔股份', '兆易创新', '汇顶科技',
  '北方华创', '中微公司', '沪硅产业', '华熙生物', '泰格医药'
]

function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getMockTargets(count = 12): InvestTarget[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `target-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    matchScore: Math.floor(Math.random() * 30 + 70),
    chainPosition: chainPositions[i % chainPositions.length],
    investmentAmount: Math.floor(Math.random() * 100000 + 5000),
    status: (['待接触', '已接触', '洽谈中', '已签约'] as const)[i % 4],
    tags: randomItems(tagOptions, Math.floor(Math.random() * 3 + 1))
  }))
}

export function getMockRecommendResults(count = 8): InvestRecommendResult[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `rec-${i + 1}`,
    targetName: companyNames[i % companyNames.length],
    chainName: industries[i % industries.length] + '产业链',
    matchScore: Math.floor(Math.random() * 25 + 75),
    reasons: [
      '产业链上下游匹配度高',
      '该企业近年扩张意愿强烈',
      '与本地现有产业形成互补',
      '技术水平处于行业领先'
    ].slice(0, Math.floor(Math.random() * 3 + 1)),
    estimatedInvestment: Math.floor(Math.random() * 80000 + 10000),
    priority: (['高', '中', '低'] as const)[i % 3]
  }))
}

export function getMockInvestProjects(count = 10): InvestProject[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `proj-${i + 1}`,
    name: `${industries[i % industries.length]}产业基地项目`,
    industry: industries[i % industries.length],
    type: ['新建', '扩建', '改建'][i % 3],
    investmentAmount: Math.floor(Math.random() * 100000 + 5000),
    area: Math.floor(Math.random() * 500 + 20),
    jobs: Math.floor(Math.random() * 2000 + 100),
    status: ['规划中', '建设中', '已投产'][i % 3],
    progress: Math.floor(Math.random() * 100)
  }))
}

// 关系链招商 - 关系图谱数据
export function getMockRelationGraph() {
  const nodes = companyNames.slice(0, 12).map((name, i) => ({
    id: `node-${i}`,
    name,
    category: industries[i % industries.length],
    value: Math.floor(Math.random() * 100 + 50)
  }))
  const edges: { source: string; target: string; weight: number; type: string }[] = []
  for (let i = 0; i < nodes.length; i++) {
    const targetIdx = (i + 1 + Math.floor(Math.random() * 3)) % nodes.length
    edges.push({
      source: nodes[i].id,
      target: nodes[targetIdx].id,
      weight: Math.random() * 0.5 + 0.5,
      type: (['投资', '供应', '合作', '竞争'] as const)[i % 4]
    })
  }
  return { nodes, edges }
}

// 以商招商 - 锚点企业数据
export function getMockAnchorEnterprises() {
  return companyNames.slice(0, 8).map((name, i) => ({
    id: `anchor-${i}`,
    name,
    industry: industries[i % industries.length],
    derivedCount: Math.floor(Math.random() * 15 + 3),
    investPotential: Math.floor(Math.random() * 50 + 50),
    relationshipType: (['供应商', '客户', '合作伙伴', '竞争对手'] as const)[i % 4]
  }))
}

// 龙头企业数据
export function getMockLeadingEnterprises() {
  return companyNames.slice(0, 6).map((name, i) => ({
    id: `leading-${i}`,
    name,
    industry: industries[i % industries.length],
    revenue: Math.floor(Math.random() * 200000 + 50000),
    marketShare: Math.floor(Math.random() * 30 + 5),
    innovationScore: Math.floor(Math.random() * 30 + 70),
    driveCapability: Math.floor(Math.random() * 30 + 60),
    employees: Math.floor(Math.random() * 10000 + 1000)
  }))
}

// 榜单数据
export function getMockRankings() {
  return [
    { id: 'rank-1', name: '中国企业500强', year: '2025', count: 500, topCompany: '国家电网' },
    { id: 'rank-2', name: '制造业单项冠军', year: '2025', count: 256, topCompany: '中芯国际' },
    { id: 'rank-3', name: '独角兽企业榜', year: '2025', count: 328, topCompany: '字节跳动' },
    { id: 'rank-4', name: '专精特新小巨人', year: '2025', count: 899, topCompany: '—' },
    { id: 'rank-5', name: '高新技术企业TOP100', year: '2025', count: 100, topCompany: '华为技术' }
  ]
}

// 资质企业数据
export function getMockQualifiedEnterprises() {
  const qualifications = ['高新技术企业', '专精特新', '科技型中小企业', '技术先进型服务企业']
  return qualifications.map((q, i) => ({
    id: `qual-${i}`,
    name: q,
    count: Math.floor(Math.random() * 300 + 50),
    newCount: Math.floor(Math.random() * 30 + 5),
    expireCount: Math.floor(Math.random() * 20 + 2),
    description: `${q}认定企业统计`
  }))
}

// 基金数据
export function getMockFunds() {
  return ['产业引导基金', '创业投资基金', '科技成果转化基金', '并购基金', '基础设施基金'].map((name, i) => ({
    id: `fund-${i}`,
    name,
    scale: Math.floor(Math.random() * 500000 + 50000),
    invested: Math.floor(Math.random() * 200000 + 10000),
    projects: Math.floor(Math.random() * 30 + 5),
    roi: (Math.random() * 15 + 5).toFixed(1),
    focus: industries[i % industries.length]
  }))
}

// 科研机构数据
export function getMockResearchInstitutions() {
  return ['浙江大学', '中科院宁波材料所', '西湖大学', '浙江工业大学', '杭州电子科技大学', '中国美术学院'].map((name, i) => ({
    id: `inst-${i}`,
    name,
    type: i < 3 ? '高校' : '科研院所',
    field: industries[i % industries.length],
    patents: Math.floor(Math.random() * 500 + 50),
    transfers: Math.floor(Math.random() * 50 + 5),
    cooperation: Math.floor(Math.random() * 100 + 20)
  }))
}

// 产业链招商 - 链式匹配数据
export function getMockChainMatchData() {
  const chainNodes = industries.slice(0, 5).map((name, i) => ({
    id: `chain-${i}`,
    name,
    category: chainPositions[i % chainPositions.length],
    value: Math.floor(Math.random() * 100 + 50)
  }))
  const chainEdges: { source: string; target: string; weight: number; type: string }[] = []
  for (let i = 0; i < chainNodes.length - 1; i++) {
    chainEdges.push({
      source: chainNodes[i].id,
      target: chainNodes[i + 1].id,
      weight: Math.random() * 0.5 + 0.5,
      type: '供应'
    })
  }
  return { nodes: chainNodes, edges: chainEdges }
}

// 产业链招商 - KPI数据
export function getMockChainKpiCards() {
  return [
    { key: 'totalChains', label: '产业链数量', value: 28, unit: '条', trend: 'up' as const, trendValue: '+12.5%', icon: 'Share', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
    { key: 'matchedTargets', label: '已匹配目标', value: 156, unit: '家', trend: 'up' as const, trendValue: '+18.3%', icon: 'Aim', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
    { key: 'recommendCount', label: '推荐企业', value: 89, unit: '家', trend: 'up' as const, trendValue: '+8.6%', icon: 'Promotion', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
    { key: 'signedCount', label: '已签约数', value: 34, unit: '个', trend: 'up' as const, trendValue: '+22.1%', icon: 'DocumentChecked', iconColor: '#FBD437', iconBgColor: '#FFF8E6' }
  ]
}

// 补链招商 - 缺链分析数据
export function getMockGapAnalysis() {
  const gaps = industries.slice(0, 5).map((name, i) => ({
    id: `gap-${i}`,
    chainName: name + '产业链',
    missingLinks: chainPositions.slice(i % 3, (i % 3) + 2),
    severity: (['高', '中', '低'] as const)[i % 3],
    targetCount: Math.floor(Math.random() * 10 + 2),
    fillRate: Math.floor(Math.random() * 40 + 10)
  }))
  return gaps
}

// 链主适配数据
export function getMockChainOwners() {
  return industries.slice(0, 5).map((name, i) => ({
    id: `owner-${i}`,
    chainName: name + '产业链',
    ownerName: companyNames[i],
    matchScore: Math.floor(Math.random() * 25 + 75),
    driveIndex: Math.floor(Math.random() * 30 + 70),
    influenceRange: Math.floor(Math.random() * 50 + 30),
    cooperationCount: Math.floor(Math.random() * 80 + 20),
    revenue: Math.floor(Math.random() * 200000 + 30000)
  }))
}

// 园区数据
export function getMockParks() {
  return ['高端装备产业园', '新材料创新园', '生物医药基地', '电子信息产业园', '新能源科技园', '现代服务集聚区'].map((name, i) => ({
    id: `park-${i}`,
    name,
    area: Math.floor(Math.random() * 5000 + 500),
    occupancy: Math.floor(Math.random() * 30 + 60),
    enterprises: Math.floor(Math.random() * 200 + 30),
    revenue: Math.floor(Math.random() * 300000 + 50000),
    vacantArea: Math.floor(Math.random() * 500 + 50),
    industry: industries[i % industries.length]
  }))
}

// 榜单招商 - 榜单企业明细
export function getMockRankingDetails(rankingId: string) {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${rankingId}-company-${i}`,
    name: companyNames[i % companyNames.length],
    rank: i + 1,
    industry: industries[i % industries.length],
    revenue: Math.floor(Math.random() * 300000 + 10000),
    region: regions[i % regions.length],
    tags: randomItems(tagOptions, 2)
  }))
}

// 地图招商 - 地图标记数据
export function getMockMapTargets() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `map-target-${i}`,
    name: companyNames[i % companyNames.length],
    lng: 118 + Math.random() * 4,
    lat: 28 + Math.random() * 4,
    industry: industries[i % industries.length],
    matchScore: Math.floor(Math.random() * 30 + 70),
    investmentAmount: Math.floor(Math.random() * 80000 + 5000),
    status: (['待接触', '已接触', '洽谈中'] as const)[i % 3]
  }))
}

// 资质企业列表
export function getMockQualifiedList(qualType: string) {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `q-${qualType}-${i}`,
    name: companyNames[i % companyNames.length],
    qualification: qualType,
    validDate: `2025-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    status: (['有效', '即将到期', '已过期'] as const)[i % 3]
  }))
}
