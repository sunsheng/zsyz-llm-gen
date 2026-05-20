// 招商情报 Mock 数据工厂

export interface IntelligenceNews {
  id: string
  title: string
  source: string
  category: string
  publishDate: string
  summary: string
  importance: 'high' | 'medium' | 'low'
}

export interface IntelligenceProject {
  id: string
  name: string
  industry: string
  investmentAmount: number
  stage: '意向' | '对接' | '谈判' | '签约' | '落地'
  source: string
  contactPerson: string
  createDate: string
  description: string
}

export interface IntelligenceTechTransfer {
  id: string
  name: string
  field: string
  transferType: string
  patentNo: string
  price: number
  institution: string
  status: 'available' | 'negotiating' | 'transferred'
}

export interface IntelligenceCapital {
  id: string
  enterprise: string
  type: '融资' | '并购' | '上市' | '投资'
  amount: number
  date: string
  investor: string
  industry: string
}

export interface IntelligenceTalent {
  id: string
  name: string
  title: string
  field: string
  fromCompany: string
  toCompany: string
  moveDate: string
  level: '高管' | '技术骨干' | '核心研发'
}

const newsTitles = [
  '成渝地区高端装备制造产业峰会即将召开',
  '新材料产业园区招商引资成果显著，签约金额突破50亿',
  '生物医药创新政策出台，加速产业集聚发展',
  '半导体产业国产替代加速，核心环节突破在即',
  '新能源汽车产业链延伸，充电基础设施建设提速',
  '数字经济赋能传统制造业转型升级',
  '专精特新企业培育计划启动，助力中小企业高质量发展',
  '绿色制造示范工厂评选结果公布',
]

const projectNames = [
  '年产5000吨高性能复合材料项目',
  '智能机器人研发中心建设项目',
  '生物医药创新平台项目',
  '第三代半导体芯片产业化项目',
  '氢燃料电池生产基地项目',
  '工业互联网平台建设项目',
  '精密医疗器械研发生产项目',
  '量子通信设备产业化项目',
]

const techNames = [
  '碳纤维复合材料制备技术',
  'mRNA疫苗生产技术',
  '人工智能芯片设计技术',
  '固态电池制备工艺',
  '量子加密通信技术',
  '工业视觉检测技术',
  '基因编辑靶向治疗技术',
  '第三代半导体外延技术',
  '超导材料制备工艺',
  '脑机接口通信技术',
]

const techInstitutions = [
  '四川大学',
  '中科院成都分院',
  '电子科技大学',
  '西南交大',
  '西南石油大学',
  '成都理工大学',
  '重庆大学',
  '西华大学',
  '四川农业大学',
  '成都信息工程大学',
]

const capitalEnterprises = [
  '华创新材',
  '天域半导体',
  '绿能新源',
  '芯源集成',
  '博远生物',
  '鼎盛环保',
  '恒宇光电',
  '云帆数据',
  '智联科技',
  '瑞昇新材',
]

const capitalInvestors = [
  '红杉资本',
  '高瓴资本',
  '深创投',
  '达晨财智',
  'IDG资本',
  '经纬中国',
  '启明创投',
  '真格基金',
  '光速中国',
  '源码资本',
]

const trackTargets = [
  '中芯国际',
  '宁德时代',
  '隆基绿能',
  '比亚迪半导体',
  '药明康德',
  '迈瑞医疗',
  '京东方科技',
  '通威股份',
  '天合光能',
  '长电科技',
  '三一重工',
  '大疆创新',
  '蔚来汽车',
  '小鹏汽车',
  '理想汽车',
  '科大讯飞',
  '商汤科技',
  '地平线机器人',
  '寒武纪',
  '海光信息',
]

const industries = [
  '高端装备制造',
  '新材料',
  '生物医药',
  '电子信息',
  '新能源',
  '节能环保',
  '数字创意',
  '现代服务业',
]

const newsSummaries = [
  '围绕产业发展核心议题，聚焦技术创新与产业升级，推动区域经济高质量发展。',
  '多个重点项目集中签约落地，招商引资工作取得新突破，为地方经济注入新动能。',
  '产业链上下游协同创新加速，关键核心技术攻关取得重要进展。',
  '政策红利持续释放，营商环境优化成效显著，企业投资信心增强。',
  '绿色低碳转型步伐加快，新能源产业蓬勃发展，产业结构持续优化。',
  '数字化转型深入推进，智能制造水平显著提升，新业态新模式涌现。',
  '人才引进培育力度加大，创新平台建设成效显现，科技成果加速转化。',
  '区域协同发展态势良好，产业转移承接有序推进，集群效应日益凸显。',
  '专精特新企业培育成效显著，中小企业创新活力持续迸发。',
  '开放合作水平不断提升，国际产能合作稳步推进，外贸结构持续优化。',
]

export function getMockNewsList(count = 10): IntelligenceNews[] {
  const seen = new Set<string>()
  return Array.from({ length: count }, (_, i) => {
    let title = newsTitles[i % newsTitles.length]
    if (seen.has(title)) {
      title = `${title}（第${Math.floor(i / newsTitles.length) + 1}期）`
    }
    seen.add(title)
    return {
      id: `news-${i + 1}`,
      title,
      source: ['经济日报', '科技日报', '四川日报', '中国工业报', '新华网'][i % 5],
      category: industries[i % industries.length],
      publishDate: `2025-${String(Math.floor(Math.random() * 3 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
      summary: newsSummaries[i % newsSummaries.length],
      importance: (['high', 'medium', 'low'] as const)[i % 3],
    }
  })
}

export function getMockProjectList(count = 8): IntelligenceProject[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `proj-${i + 1}`,
    name: projectNames[i % projectNames.length],
    industry: industries[i % industries.length],
    investmentAmount: Math.floor(Math.random() * 50000 + 5000),
    stage: (['意向', '对接', '谈判', '签约', '落地'] as const)[i % 5],
    source: ['产业峰会', '企业自荐', '中介推荐', '政府招商', '园区引荐'][i % 5],
    contactPerson: ['张经理', '李总', '王总监', '刘副总', '陈部长'][i % 5],
    createDate: `2025-${String(Math.floor(Math.random() * 3 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    description: '本项目将建设完整的研发及生产体系，打造行业领先的技术创新中心。',
  }))
}

export function getMockTechTransfers(count = 6): IntelligenceTechTransfer[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `tech-${i + 1}`,
    name: techNames[i % techNames.length],
    field: industries[i % industries.length],
    transferType: ['独占许可', '普通许可', '技术转让', '合作开发'][i % 4],
    patentNo: `CN${String(Math.floor(Math.random() * 9000000 + 1000000))}`,
    price: Math.floor(Math.random() * 5000 + 500),
    institution: techInstitutions[i % techInstitutions.length],
    status: (['available', 'negotiating', 'transferred'] as const)[i % 3],
  }))
}

export function getMockCapitalList(count = 8): IntelligenceCapital[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `cap-${i + 1}`,
    enterprise: capitalEnterprises[i % capitalEnterprises.length],
    type: (['融资', '并购', '上市', '投资'] as const)[i % 4],
    amount: Math.floor(Math.random() * 100000 + 5000),
    date: `2025-${String(Math.floor(Math.random() * 3 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    investor: capitalInvestors[i % capitalInvestors.length],
    industry: industries[i % industries.length],
  }))
}

const talentNames = ['陈博士', '王教授', '李总工', '张首席', '刘总监', '赵研究员']
const talentTitles = ['CTO', '首席科学家', '研发总监', '技术VP', '工程总监', '高级研究员']
const talentFromCompanies = ['华为', '阿里巴巴', '腾讯', '百度', '字节跳动', '大疆']

export function getMockTalentList(count = 6): IntelligenceTalent[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `talent-${i + 1}`,
    name: talentNames[i % talentNames.length],
    title: talentTitles[i % talentTitles.length],
    field: industries[i % industries.length],
    fromCompany: talentFromCompanies[i % talentFromCompanies.length],
    toCompany: `本地企业${String.fromCharCode(65 + (i % 10))}`,
    moveDate: `2025-${String(Math.floor(Math.random() * 3 + 1)).padStart(2, '0')}`,
    level: (['高管', '技术骨干', '核心研发'] as const)[i % 3],
  }))
}

// 资质变动数据
export interface IntelligenceQualification {
  id: string
  enterprise: string
  qualType: string
  changeType: '新增' | '升级' | '到期' | '撤销'
  date: string
  industry: string
  detail: string
}

export function getMockQualificationChanges(count = 8): IntelligenceQualification[] {
  const qualTypes = ['高新技术企业', '专精特新', '科技型中小企业', '技术先进型服务企业']
  return Array.from({ length: count }, (_, i) => ({
    id: `qual-${i + 1}`,
    enterprise: capitalEnterprises[i % capitalEnterprises.length],
    qualType: qualTypes[i % qualTypes.length],
    changeType: (['新增', '升级', '到期', '撤销'] as const)[i % 4],
    date: `2025-${String(Math.floor(Math.random() * 3 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    industry: industries[i % industries.length],
    detail: `${qualTypes[i % qualTypes.length]}资质认定变更`,
  }))
}

// 投资事件数据
export interface IntelligenceInvestEvent {
  id: string
  title: string
  type: '融资' | '并购' | '上市' | '投资'
  amount: number
  date: string
  enterprise: string
  industry: string
  description: string
}

export function getMockInvestEvents(count = 8): IntelligenceInvestEvent[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i + 1}`,
    title: `${capitalEnterprises[i % capitalEnterprises.length]}完成${['A轮', 'B轮', 'C轮', '战略融资', 'Pre-IPO'][i % 5]}融资`,
    type: (['融资', '并购', '上市', '投资'] as const)[i % 4],
    amount: Math.floor(Math.random() * 100000 + 5000),
    date: `2025-${String(Math.floor(Math.random() * 3 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    enterprise: capitalEnterprises[i % capitalEnterprises.length],
    industry: industries[i % industries.length],
    description: '本次融资将用于扩大产能和技术研发，加速产业布局。',
  }))
}

// 情报追踪数据
export interface IntelligenceTrackItem {
  id: string
  targetName: string
  trackType: '企业动态' | '投资意向' | '政策变化' | '竞争情报'
  updateTime: string
  status: '进行中' | '已完成' | '已搁置'
  progress: number
  keyEvents: string[]
  regionFeature?: string
  riskWarning?: string
}

const regionFeatures = [
  '高端装备制造产业集群，毗邻成渝经济圈',
  '新材料产业园区，配套设施完善',
  '电子信息产业基地，人才资源丰富',
  '新能源产业集聚区，政策扶持力度大',
  '生物医药创新示范区，研发平台齐全',
  '数字经济核心区，营商环境优越',
]

const riskWarnings = [
  '行业周期下行，市场波动风险较高',
  '政策补贴退坡，企业投资意愿降低',
  '企业经营异常，信用评级下调',
  '投资进度延迟，配套承诺未兑现',
  '技术替代威胁加剧，竞争力下降',
  '',
  '',
  '',
]

export function getMockTrackList(count = 6): IntelligenceTrackItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `track-${i + 1}`,
    targetName: trackTargets[i % trackTargets.length],
    trackType: (['企业动态', '投资意向', '政策变化', '竞争情报'] as const)[i % 4],
    updateTime: `2025-${String(Math.floor(Math.random() * 3 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    status: (['进行中', '已完成', '已搁置'] as const)[i % 3],
    progress: Math.floor(Math.random() * 80 + 10),
    keyEvents: ['初次接触', '需求确认', '方案沟通', '商务谈判'].slice(
      0,
      Math.floor(Math.random() * 3 + 1),
    ),
    regionFeature: regionFeatures[i % regionFeatures.length],
    riskWarning: riskWarnings[i % riskWarnings.length],
  }))
}

// 情报报告数据
export interface IntelligenceReportItem {
  id: string
  title: string
  type: '行业分析' | '区域报告' | '政策解读' | '投资建议'
  author: string
  createDate: string
  summary: string
  downloadCount: number
}

export function getMockReportList(count = 6): IntelligenceReportItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `report-${i + 1}`,
    title: [
      '2025年高端装备制造产业投资分析报告',
      '新材料产业区域竞争力分析',
      '生物医药产业政策解读与投资建议',
      '半导体产业链投资机会分析',
      '新能源产业发展趋势报告',
      '数字经济产业招商策略研究',
    ][i],
    type: (['行业分析', '区域报告', '政策解读', '投资建议'] as const)[i % 4],
    author: ['产业研究院', '招商中心', '政策研究室', '投资分析部', '行业研究所', '战略规划部'][i],
    createDate: `2025-${String(Math.floor(Math.random() * 3 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    summary: '本报告围绕当前产业发展趋势，深度分析投资机会与风险，提供专业投资建议。',
    downloadCount: Math.floor(Math.random() * 500 + 50),
  }))
}
