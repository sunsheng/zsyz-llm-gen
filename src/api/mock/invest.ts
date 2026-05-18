// 精准招商 Mock 数据工厂
import type {
  ChainStructureData,
  ChainSegment,
  KeyNodeData,
  CompetitivenessData,
  RecommendTarget,
  MapResourceData,
  SpaceAtlasEdge,
  AdvantageLink,
  ExtensionDirection,
  BenchmarkItem,
  GapDiagnosisData,
  FillTarget,
  RelationNode,
  RelationEdge,
  RelationGraphData,
  ChainOwnerRadiation,
  SecondaryRelation,
  DriveCapability,
  EcoNetworkNode,
  IncentivePolicy,
  RankingItem,
  RankingEnterprise,
  BrandLinkage,
  LeadingEnterprise,
  StrategyItem,
  EcoSynergyItem,
  QualifiedEnterprise,
  DemandProfile,
  ResourceMatch,
  FundItem,
  InvestProject,
  CapitalMatch,
  ResearchInstitution,
  TechTransferItem,
  TalentShareItem,
  ChainOwnerProfile,
  OwnerGapDiagnosis,
  AdaptiveMatch,
  ParkResource,
  ParkSmartMatch,
  ParkChainSynergy,
  InvestStatus,
  NodeType,
  RelationType,
  Priority,
  ChainPosition,
} from '@/api/types/invest'

// ===== 基础数据池 =====
const industries = [
  '高端装备制造',
  '前沿新材料',
  '数字经济',
  '新能源',
  '生物医药',
  '时尚产业',
  '现代服务业',
  '电子信息',
]

const regions = ['成都', '德阳', '绵阳', '凯州新城', '宜宾', '泸州', '南充', '达州', '内江', '乐山']

const companyNames = [
  '四川凯州精密机械有限公司',
  '德阳东方汽轮机有限公司',
  '绵阳九洲电器集团',
  '成都京东方光电科技',
  '宜宾五粮液集团',
  '泸州老窖股份有限公司',
  '南充三环电子有限公司',
  '达州瓮福化工',
  '内江白马电厂',
  '乐山福华化工',
  '四川宏华石油设备',
  '德阳国机重装',
  '绵阳长虹电子',
  '成都极米科技',
  '宜宾天原集团',
  '泸州北方化工',
  '南充燕京啤酒',
  '达州钢铁集团',
  '内江金鸿曲轴',
  '乐山永祥股份',
  '成都硅宝科技',
  '德阳明日宇航',
  '绵阳攀长钢',
  '宜宾丝丽雅集团',
  '泸州郎酒集团',
  '南充东风汽车',
  '达州华景机电',
  '内江百科科技',
  '乐山明星电缆',
  '四川航天拓鑫',
  '成都彩虹电器',
  '德阳思益科技',
  '绵阳富临精工',
  '宜宾中核建中',
  '泸州长江机械',
  '南充六合集团',
  '达州利森水泥',
  '内江方向绝缘',
  '乐山中芯半导体',
  '四川新锂想科技',
]

const chainSegments = [
  '原材料加工',
  '核心零部件',
  '整机制造',
  '系统集成',
  '运维服务',
  '芯片设计',
  '晶圆制造',
  '封装测试',
  '终端应用',
  '基础研究',
  '应用研发',
  '中试放大',
  '产业化',
]

const qualificationNames = [
  '国家高新技术企业',
  '专精特新"小巨人"',
  '国家级绿色工厂',
  'ISO9001认证',
  '碳足迹认证',
  '省级技术中心',
  '国家重点实验室',
]

const institutionNames = [
  '电子科技大学',
  '四川大学',
  '西南交通大学',
  '成都理工大学',
  '中国燃气涡轮研究院',
  '中国核动力研究设计院',
  '西南自动化研究所',
  '四川省新材料研究中心',
  '德阳高端装备创新中心',
  '绵阳空气动力研究中心',
]

const fundNames = [
  '凯州产业引导基金',
  '德阳高端装备基金',
  '绵阳科技城基金',
  '四川新材料产业基金',
  '成渝经济圈发展基金',
  '凯州新能源基金',
  '四川集成电路基金',
  '德阳军民融合基金',
]

const tagOptions = [
  '上市公司',
  '行业龙头',
  '专精特新',
  '高新技术企业',
  '外资企业',
  '独角兽',
  '瞪羚企业',
]

// 后续 Task 页面重写时使用
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statusLabels: Record<InvestStatus, string> = {
  targeting: '待接触',
  contacting: '已接触',
  negotiating: '洽谈中',
  signed: '已签约',
  lost: '已流失',
}

const nodeTypeLabels: Record<NodeType, string> = {
  bottleneck: '卡脖子',
  'high-value': '高附加值',
  'policy-sensitive': '政策敏感',
  standard: '标准',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const priorityLabels: Record<Priority, string> = {
  urgent: '紧急',
  important: '重要',
  normal: '一般',
}

const relationTypeLabels: Record<RelationType, string> = {
  supply: '供应',
  investment: '投资',
  cooperation: '合作',
  competition: '竞争',
  talent: '人才',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chainPositionLabels: Record<ChainPosition, string> = {
  upstream: '上游',
  midstream: '中游',
  downstream: '下游',
}

function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// ===== 8.1 产业链招商 =====

export function getMockChainStructure(): ChainStructureData {
  const makeSegments = (start: number, count: number, nodeTypes: NodeType[]): ChainSegment[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `seg-${start + i}`,
      name: chainSegments[(start + i) % chainSegments.length],
      enterpriseCount: Math.floor(Math.random() * 8 + 1),
      localRate: Math.floor(Math.random() * 60 + 30),
      nodeType: nodeTypes[i % nodeTypes.length],
      importance: Math.floor(Math.random() * 40 + 60),
    }))

  return {
    chainName: '新能源装备产业链',
    upstream: makeSegments(0, 3, ['bottleneck', 'standard', 'policy-sensitive']),
    midstream: makeSegments(3, 4, ['high-value', 'standard', 'bottleneck', 'standard']),
    downstream: makeSegments(7, 3, ['policy-sensitive', 'high-value', 'standard']),
  }
}

export function getMockKeyNodes(count = 8): KeyNodeData[] {
  const nodeTypes: NodeType[] = ['bottleneck', 'high-value', 'policy-sensitive', 'standard']
  return Array.from({ length: count }, (_, i) => ({
    id: `kn-${i + 1}`,
    name: chainSegments[i % chainSegments.length],
    nodeType: nodeTypes[i % nodeTypes.length],
    importance: Math.floor(Math.random() * 40 + 60),
    localEnterprises: randomItems(companyNames.slice(0, 10), Math.floor(Math.random() * 3 + 1)),
    missingFlag: i % 3 === 0,
    description: `${chainSegments[i % chainSegments.length]}环节关键节点，${nodeTypeLabels[nodeTypes[i % nodeTypes.length]]}类型`,
  }))
}

export function getMockCompetitiveness(): CompetitivenessData {
  const dimensions = ['产业规模', '创新能力', '配套完善度', '人才密度', '政策支持', '市场潜力']
  return {
    dimensions,
    localScores: dimensions.map(() => Math.floor(Math.random() * 30 + 60)),
    nationalAvg: dimensions.map(() => Math.floor(Math.random() * 20 + 50)),
    regionAvg: dimensions.map(() => Math.floor(Math.random() * 20 + 55)),
  }
}

export function getMockRecommendTargets(count = 12): RecommendTarget[] {
  const statuses: InvestStatus[] = ['targeting', 'contacting', 'negotiating', 'signed', 'lost']
  const priorities: Priority[] = ['urgent', 'important', 'normal']
  const positions: ChainPosition[] = ['upstream', 'midstream', 'downstream']
  return Array.from({ length: count }, (_, i) => ({
    id: `rec-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    matchScore: Math.floor(Math.random() * 25 + 75),
    chainPosition: positions[i % positions.length],
    investmentAmount: `${Math.floor(Math.random() * 50 + 5)}亿元`,
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    tags: randomItems(tagOptions, Math.floor(Math.random() * 3 + 1)),
    reasons: randomItems(
      [
        '产业链上下游匹配度高',
        '该企业近年扩张意愿强烈',
        '与本地现有产业形成互补',
        '技术水平处于行业领先',
        '政策支持力度大',
      ],
      Math.floor(Math.random() * 3 + 1),
    ),
  }))
}

// ===== 8.2 产业地图招商 =====

export function getMockMapResources(count = 6): MapResourceData[] {
  return Array.from({ length: count }, (_, i) => ({
    industryName: industries[i % industries.length],
    enterpriseCount: Math.floor(Math.random() * 200 + 30),
    outputValue: Math.floor(Math.random() * 500000 + 50000),
    patentDensity: Math.floor(Math.random() * 50 + 10),
    center: [104.0 + i * 0.15, 30.5 + i * 0.1] as [number, number],
    radius: Math.random() * 20 + 10,
  }))
}

export function getMockSpaceAtlasEdges(count = 10): SpaceAtlasEdge[] {
  const types: SpaceAtlasEdge['type'][] = ['logistics', 'supply', 'service']
  return Array.from({ length: count }, (_, i) => ({
    from: [104.0 + Math.random() * 0.8, 30.5 + Math.random() * 0.6] as [number, number],
    to: [104.2 + Math.random() * 0.8, 30.6 + Math.random() * 0.6] as [number, number],
    type: types[i % types.length],
    volume: Math.floor(Math.random() * 100 + 20),
    bottleneck: i % 5 === 0,
  }))
}

export function getMockAdvantageLinks(count = 6): AdvantageLink[] {
  return Array.from({ length: count }, (_, i) => ({
    linkName: chainSegments[i % chainSegments.length],
    outputShare: Math.floor(Math.random() * 30 + 10),
    patentDensity: Math.floor(Math.random() * 50 + 20),
    marketShare: Math.floor(Math.random() * 25 + 5),
    compositeScore: Math.floor(Math.random() * 30 + 70),
  }))
}

export function getMockExtensionDirections(count = 5): ExtensionDirection[] {
  return Array.from({ length: count }, (_, i) => ({
    fromLink: chainSegments[i % chainSegments.length],
    toLink: chainSegments[(i + 1) % chainSegments.length],
    addedValue: Math.floor(Math.random() * 40 + 20),
    feasibility: Math.floor(Math.random() * 30 + 60),
    recommendedActions: randomItems(
      [
        '引入核心零部件供应商',
        '建设共享检测平台',
        '成立产业创新联盟',
        '设立专项引导基金',
        '搭建产学研合作平台',
      ],
      2,
    ),
  }))
}

// ===== 8.3 强延补链招商 =====

export function getMockBenchmarkItems(): BenchmarkItem[] {
  const dimensions = ['产业规模', '配套完善度', '创新能力', '人才密度', '政策支持', '市场潜力']
  return dimensions.map((dim, _i) => ({
    dimension: dim,
    localValue: Math.floor(Math.random() * 30 + 50),
    benchmarkValue: Math.floor(Math.random() * 20 + 70),
    gap: Math.floor(Math.random() * 30),
    catchUpPath: `加大${dim}领域投入，3年内缩小与标杆城市差距`,
  }))
}

export function getMockGapDiagnosis(count = 8): GapDiagnosisData[] {
  const priorities: Priority[] = ['urgent', 'important', 'normal']
  return Array.from({ length: count }, (_, i) => ({
    segmentName: chainSegments[i % chainSegments.length],
    localRate: Math.floor(Math.random() * 50 + 20),
    importRate: Math.floor(Math.random() * 60 + 30),
    gapLevel: priorities[i % priorities.length],
    isHidden: i % 3 === 0,
    techGapYears: Math.floor(Math.random() * 5 + 1),
  }))
}

export function getMockFillTargets(count = 12): FillTarget[] {
  const priorities: Priority[] = ['urgent', 'important', 'normal']
  return Array.from({ length: count }, (_, i) => ({
    id: `fill-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    matchScore: Math.floor(Math.random() * 25 + 75),
    priority: priorities[i % priorities.length],
    cultivationType: (i % 2 === 0 ? 'local' : 'external') as 'local' | 'external',
    techMatchRate: Math.floor(Math.random() * 30 + 60),
    recommendedPolicies: randomItems(
      ['税收减免三年', '用地优先保障', '人才公寓配租', '研发补贴最高500万', '产业基金跟投'],
      2,
    ),
  }))
}

// ===== 8.4 关系链招商 =====

export function getMockRelationGraphData(): RelationGraphData {
  const types: RelationType[] = ['supply', 'investment', 'cooperation', 'competition', 'talent']
  const nodeTypes: RelationNode['type'][] = ['enterprise', 'institution']
  const nodes: RelationNode[] = companyNames.slice(0, 12).map((name, i) => ({
    id: `node-${i}`,
    name,
    type: nodeTypes[i % nodeTypes.length],
    industry: industries[i % industries.length],
    relationCount: Math.floor(Math.random() * 10 + 1),
    influenceScore: Math.floor(Math.random() * 30 + 70),
  }))
  const edges: RelationEdge[] = []
  for (let i = 0; i < nodes.length; i++) {
    const targetIdx = (i + 1 + Math.floor(Math.random() * 3)) % nodes.length
    const rType = types[i % types.length]
    edges.push({
      source: nodes[i].id,
      target: nodes[targetIdx].id,
      type: rType,
      weight: Math.random() * 0.5 + 0.5,
      label: relationTypeLabels[rType],
    })
  }
  return { nodes, edges }
}

export function getMockChainOwnerRadiations(count = 6): ChainOwnerRadiation[] {
  const trends: ChainOwnerRadiation['expansionTrend'][] = ['expanding', 'stable', 'shrinking']
  return Array.from({ length: count }, (_, i) => ({
    enterpriseName: companyNames[i % companyNames.length],
    orderShare: Math.floor(Math.random() * 30 + 10),
    upstreamCount: Math.floor(Math.random() * 20 + 5),
    downstreamCount: Math.floor(Math.random() * 30 + 10),
    expansionTrend: trends[i % trends.length],
    relocationRisk: Math.floor(Math.random() * 40),
    influenceRadius: Math.floor(Math.random() * 50 + 30),
  }))
}

export function getMockSecondaryRelations(count = 10): SecondaryRelation[] {
  const statuses: InvestStatus[] = ['targeting', 'contacting', 'negotiating', 'signed', 'lost']
  return Array.from({ length: count }, (_, i) => ({
    id: `sec-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    relationPath: `${companyNames[i % companyNames.length]} → ${companyNames[(i + 1) % companyNames.length]}`,
    relationType:
      relationTypeLabels[
        ['supply', 'investment', 'cooperation', 'competition', 'talent'][i % 5] as RelationType
      ],
    matchScore: Math.floor(Math.random() * 25 + 70),
    contactStatus: statuses[i % statuses.length],
  }))
}

// ===== 8.5 以商招商 =====

export function getMockDriveCapabilities(count = 8): DriveCapability[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `drive-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    supplyChainInfluence: Math.floor(Math.random() * 30 + 70),
    investmentActivity: Math.floor(Math.random() * 40 + 50),
    industryInfluence: Math.floor(Math.random() * 30 + 60),
    historicalReferrals: Math.floor(Math.random() * 15 + 1),
    enthusiasmScore: Math.floor(Math.random() * 30 + 60),
  }))
}

export function getMockEcoNetworkNodes(count = 12): EcoNetworkNode[] {
  const types: EcoNetworkNode['type'][] = ['supplier', 'customer', 'investee', 'talent-related']
  const relationLabels: Record<EcoNetworkNode['type'], string> = {
    supplier: '供应商',
    customer: '客户',
    investee: '被投企业',
    'talent-related': '人才关联',
  }
  return Array.from({ length: count }, (_, i) => ({
    id: `eco-${i + 1}`,
    name: companyNames[i % companyNames.length],
    type: types[i % types.length],
    relation: relationLabels[types[i % types.length]],
    investmentPotential: Math.floor(Math.random() * 30 + 60),
  }))
}

export function getMockIncentivePolicies(count = 8): IncentivePolicy[] {
  const types: IncentivePolicy['type'][] = ['cash-reward', 'resource-priority', 'rent-free']
  const statuses: IncentivePolicy['status'][] = ['active', 'expired', 'draft']
  const typeLabels: Record<IncentivePolicy['type'], string> = {
    'cash-reward': '现金奖励',
    'resource-priority': '资源倾斜',
    'rent-free': '免租优惠',
  }
  return Array.from({ length: count }, (_, i) => ({
    id: `policy-${i + 1}`,
    name: `${typeLabels[types[i % types.length]]}政策${i + 1}`,
    type: types[i % types.length],
    rewardRate: `${Math.floor(Math.random() * 5 + 1)}%`,
    targetEnterprise: companyNames[i % companyNames.length],
    conditions: '年纳税额超过100万元且承诺经营5年以上',
    status: statuses[i % statuses.length],
  }))
}

// ===== 8.6 名企榜单招商 =====

export function getMockRankingItems(count = 8): RankingItem[] {
  const categories: RankingItem['category'][] = ['industry', 'regional', 'scale']
  const categoryLabels: Record<RankingItem['category'], string> = {
    industry: '行业类',
    regional: '区域类',
    scale: '规模类',
  }
  return Array.from({ length: count }, (_, i) => ({
    id: `rank-${i + 1}`,
    name: `${categoryLabels[categories[i % categories.length]]}榜单${i + 1}`,
    category: categories[i % categories.length],
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    publishOrg: i % 2 === 0 ? '中国企联' : '工信部',
    publishDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-01`,
    enterpriseCount: Math.floor(Math.random() * 300 + 50),
  }))
}

export function getMockRankingEnterprises(rankingId: string, count = 20): RankingEnterprise[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${rankingId}-ent-${i + 1}`,
    rankingId,
    rank: i + 1,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    revenue: Math.floor(Math.random() * 300000 + 10000),
    synergy: Math.floor(Math.random() * 30 + 70),
    tags: randomItems(tagOptions, 2),
  }))
}

export function getMockBrandLinkages(count = 6): BrandLinkage[] {
  const types: BrandLinkage['type'][] = ['rank-publish', 'city-tour', 'forum']
  const statuses: BrandLinkage['status'][] = ['planned', 'ongoing', 'completed']
  const typeLabels: Record<BrandLinkage['type'], string> = {
    'rank-publish': '榜单发布',
    'city-tour': '城市巡回',
    forum: '论坛峰会',
  }
  return Array.from({ length: count }, (_, i) => ({
    id: `bl-${i + 1}`,
    activityName: `${typeLabels[types[i % types.length]]}活动${i + 1}`,
    partnerOrg: i % 2 === 0 ? '中国企联' : '省政府',
    type: types[i % types.length],
    date: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    invitedCount: Math.floor(Math.random() * 100 + 20),
    signedCount: Math.floor(Math.random() * 20),
    status: statuses[i % statuses.length],
  }))
}

// ===== 8.7 龙头骨干招商 =====

export function getMockLeadingEnterprisesDetailed(count = 8): LeadingEnterprise[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `leading-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    revenue: Math.floor(Math.random() * 200000 + 50000),
    employeeCount: Math.floor(Math.random() * 10000 + 1000),
    influenceScore: Math.floor(Math.random() * 30 + 70),
    drivingScore: Math.floor(Math.random() * 30 + 60),
    tags: randomItems(tagOptions, 2),
    expansionIntent: i % 3 !== 0,
  }))
}

export function getMockStrategyItems(count = 6): StrategyItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `strategy-${i + 1}`,
    enterpriseName: companyNames[i % companyNames.length],
    strategyType: ['产业链延伸', '产能扩张', '技术引进', '合资合作'][i % 4],
    policyPackage: `专项扶持政策${i + 1}号`,
    matchScore: Math.floor(Math.random() * 25 + 75),
    estimatedInvestment: `${Math.floor(Math.random() * 50 + 5)}亿元`,
    timeline: `${2025 + Math.floor(i / 2)}年Q${(i % 4) + 1}`,
  }))
}

export function getMockEcoSynergyItems(count = 6): EcoSynergyItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `eco-syn-${i + 1}`,
    chainGap: chainSegments[i % chainSegments.length],
    recommendedEnterprises: randomItems(companyNames.slice(0, 10), 3),
    synergyScore: Math.floor(Math.random() * 30 + 70),
    clusterPotential: Math.floor(Math.random() * 30 + 60),
  }))
}

// ===== 8.8 资质企业招商 =====

export function getMockQualifiedEnterprisesList(count = 15): QualifiedEnterprise[] {
  const qualTypes: QualifiedEnterprise['qualificationType'][] = ['technology', 'green', 'quality']
  const qualLevels: QualifiedEnterprise['qualificationLevel'][] = ['national', 'provincial']
  return Array.from({ length: count }, (_, i) => ({
    id: `qe-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    qualificationType: qualTypes[i % qualTypes.length],
    qualificationLevel: qualLevels[i % qualLevels.length],
    qualificationName: qualificationNames[i % qualificationNames.length],
    tags: randomItems(tagOptions, 2),
  }))
}

export function getMockDemandProfiles(count = 8): DemandProfile[] {
  const demandTypes: DemandProfile['demandType'][] = ['research', 'production', 'market']
  return Array.from({ length: count }, (_, i) => ({
    id: `demand-${i + 1}`,
    name: companyNames[i % companyNames.length],
    demandType: demandTypes[i % demandTypes.length],
    coreDemand: `${chainSegments[i % chainSegments.length]}领域技术突破`,
    requiredResources: randomItems(['研发人才', '生产场地', '检测设备', '市场渠道', '政策支持'], 2),
    matchScore: Math.floor(Math.random() * 25 + 70),
  }))
}

export function getMockResourceMatches(count = 10): ResourceMatch[] {
  const qualTypes: ResourceMatch['qualificationType'][] = ['technology', 'green', 'quality']
  return Array.from({ length: count }, (_, i) => ({
    id: `rm-${i + 1}`,
    enterpriseName: companyNames[i % companyNames.length],
    qualificationType: qualTypes[i % qualTypes.length],
    matchResources: randomItems(['共享实验室', '产业基金', '人才公寓', '税收优惠', '用地保障'], 2),
    matchScore: Math.floor(Math.random() * 25 + 70),
    contactInfo: `028-${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
  }))
}

// ===== 8.9 投行基金招商 =====

export function getMockFundItems(count = 6): FundItem[] {
  const statuses: FundItem['status'][] = ['raising', 'investing', 'exiting']
  return Array.from({ length: count }, (_, i) => ({
    id: `fund-${i + 1}`,
    name: fundNames[i % fundNames.length],
    targetIndustry: industries[i % industries.length],
    scale: Math.floor(Math.random() * 500000 + 50000),
    investedAmount: Math.floor(Math.random() * 200000 + 10000),
    status: statuses[i % statuses.length],
    manager: `管理团队${i + 1}`,
  }))
}

export function getMockInvestProjectsDetailed(count = 10): InvestProject[] {
  const statuses: InvestProject['status'][] = [
    'screening',
    'due-diligence',
    'negotiating',
    'signed',
    'implementing',
  ]
  return Array.from({ length: count }, (_, i) => ({
    id: `proj-${i + 1}`,
    name: `${industries[i % industries.length]}产业基地项目`,
    industry: industries[i % industries.length],
    type: ['新建', '扩建', '改建'][i % 3],
    investmentAmount: Math.floor(Math.random() * 100000 + 5000),
    area: Math.floor(Math.random() * 500 + 20),
    jobs: Math.floor(Math.random() * 2000 + 100),
    status: statuses[i % statuses.length],
    progress: Math.floor(Math.random() * 100),
  }))
}

export function getMockCapitalMatches(count = 8): CapitalMatch[] {
  const statuses: CapitalMatch['status'][] = ['pending', 'contacting', 'negotiating', 'closed']
  return Array.from({ length: count }, (_, i) => ({
    id: `cap-${i + 1}`,
    enterpriseName: companyNames[i % companyNames.length],
    institutionName: institutionNames[i % institutionNames.length],
    matchScore: Math.floor(Math.random() * 25 + 75),
    financingStage: ['种子轮', 'A轮', 'B轮', 'Pre-IPO'][i % 4],
    amount: Math.floor(Math.random() * 50000 + 1000),
    status: statuses[i % statuses.length],
  }))
}

// ===== 8.10 科研机构招商 =====

export function getMockResearchInstitutionsDetailed(count = 8): ResearchInstitution[] {
  const types: ResearchInstitution['type'][] = ['university', 'key-lab', 'rd-institution']
  return Array.from({ length: count }, (_, i) => ({
    id: `inst-${i + 1}`,
    name: institutionNames[i % institutionNames.length],
    type: types[i % types.length],
    patentCount: Math.floor(Math.random() * 500 + 50),
    equipment: randomItems(
      ['超算中心', '风洞实验室', '材料检测平台', '集成电路测试线', '中试车间'],
      2,
    ),
    nationalProjects: Math.floor(Math.random() * 20 + 3),
    academicianCount: Math.floor(Math.random() * 5 + 1),
    industryCases: randomItems(industries.slice(0, 4), 2),
  }))
}

export function getMockTechTransferItems(count = 6): TechTransferItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `tech-${i + 1}`,
    institutionName: institutionNames[i % institutionNames.length],
    technologyName: `${industries[i % industries.length]}核心技术${i + 1}`,
    technologyChain: ['基础研究', '应用研发', '产品原型', '市场化'].slice(i % 4),
    industryFit: Math.floor(Math.random() * 30 + 70),
    commercializableStage: ['应用研发', '产品原型', '市场化'][i % 3],
    transferPath: '技术许可 → 联合开发 → 成果入股',
  }))
}

export function getMockTalentShareItems(count = 8): TalentShareItem[] {
  const availabilities: TalentShareItem['availability'][] = ['monthly', 'quarterly', 'annual']
  const compliances: TalentShareItem['complianceStatus'][] = ['approved', 'pending', 'restricted']
  return Array.from({ length: count }, (_, i) => ({
    id: `talent-${i + 1}`,
    expertName: `专家${i + 1}`,
    field: industries[i % industries.length],
    institution: institutionNames[i % institutionNames.length],
    availability: availabilities[i % availabilities.length],
    enterpriseMatch: randomItems(companyNames.slice(0, 6), 2),
    complianceStatus: compliances[i % compliances.length],
  }))
}

// ===== 8.11 链主适配招商 =====

export function getMockChainOwnerProfiles(count = 5): ChainOwnerProfile[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `owner-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    supplyChainControl: Math.floor(Math.random() * 30 + 70),
    techInfluence: Math.floor(Math.random() * 30 + 60),
    expansionDynamic: ['积极扩张', '稳健发展', '战略收缩'][i % 3],
    localProcurementRate: Math.floor(Math.random() * 40 + 30),
    keyDemands: randomItems(['土地扩容', '人才引进', '供应链本地化', '政策配套', '融资支持'], 2),
    tags: randomItems(tagOptions, 2),
  }))
}

export function getMockOwnerGapDiagnoses(count = 6): OwnerGapDiagnosis[] {
  const healthLevels: OwnerGapDiagnosis['healthLevel'][] = ['healthy', 'warning', 'critical']
  return Array.from({ length: count }, (_, i) => ({
    segmentName: chainSegments[i % chainSegments.length],
    localRate: Math.floor(Math.random() * 50 + 20),
    importRate: Math.floor(Math.random() * 60 + 30),
    bottleneckFlag: i % 3 === 0,
    healthLevel: healthLevels[i % healthLevels.length],
  }))
}

export function getMockAdaptiveMatches(count = 10): AdaptiveMatch[] {
  const dimensions = ['technology', 'market', 'resource', 'policy'] as const
  return Array.from({ length: count }, (_, i) => ({
    id: `adapt-${i + 1}`,
    targetName: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    adaptScore: Math.floor(Math.random() * 25 + 75),
    matchDimensions: dimensions.map((d) => ({
      dimension: d,
      score: Math.floor(Math.random() * 30 + 60),
    })),
    recommendedActions: randomItems(
      ['产业链对接', '政策匹配', '人才引荐', '融资对接', '场地推荐'],
      2,
    ),
  }))
}

// ===== 8.12 园区招商 =====

export function getMockParkResources(count = 6): ParkResource[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `park-${i + 1}`,
    name: `${industries[i % industries.length]}产业园`,
    area: Math.floor(Math.random() * 5000 + 500),
    transportHubs: randomItems(['高铁站', '高速入口', '机场', '港口'], 2),
    leadingIndustry: industries[i % industries.length],
    industryShare: Math.floor(Math.random() * 30 + 40),
    leadingEnterprises: randomItems(companyNames.slice(0, 10), 3),
    policyTags: randomItems(['税收减免', '用地优惠', '人才政策', '创新补贴'], 2),
    availableArea: Math.floor(Math.random() * 500 + 50),
  }))
}

export function getMockParkSmartMatches(count = 10): ParkSmartMatch[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `psm-${i + 1}`,
    enterpriseName: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    areaNeed: Math.floor(Math.random() * 200 + 20),
    employeeCount: Math.floor(Math.random() * 500 + 50),
    matchedParks: Array.from({ length: 3 }, (_, j) => ({
      parkId: `park-${((i + j) % 6) + 1}`,
      parkName: `${industries[(i + j) % industries.length]}产业园`,
      score: Math.floor(Math.random() * 25 + 75),
    })),
    matchScore: Math.floor(Math.random() * 25 + 75),
  }))
}

export function getMockParkChainSynergies(count = 6): ParkChainSynergy[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `pcs-${i + 1}`,
    weakSegment: chainSegments[i % chainSegments.length],
    localRate: Math.floor(Math.random() * 40 + 10),
    recommendedEnterprises: randomItems(companyNames.slice(0, 10), 3),
    chainOwnerReward: `链主奖励方案${i + 1}`,
    synergyScore: Math.floor(Math.random() * 30 + 70),
  }))
}

// ===== 兼容旧接口（保留给已有页面使用，后续 Task 重写页面时移除） =====

/** @deprecated 使用 getMockRecommendTargets 替代 */
export function getMockRecommendResults(count = 8) {
  return getMockRecommendTargets(count).map((t) => ({
    id: t.id,
    targetName: t.name,
    chainName: t.industry + '产业链',
    matchScore: t.matchScore,
    reasons: t.reasons,
    estimatedInvestment: parseInt(t.investmentAmount) * 10000,
    priority: (['高', '中', '低'] as const)[
      (['urgent', 'important', 'normal'] as const).indexOf(t.priority) % 3
    ],
  }))
}

/** @deprecated 使用 getMockInvestProjectsDetailed 替代 */
export function getMockInvestProjects(count = 10) {
  return getMockInvestProjectsDetailed(count).map((p) => ({
    id: p.id,
    name: p.name,
    industry: p.industry,
    type: p.type,
    investmentAmount: p.investmentAmount,
    area: p.area,
    jobs: p.jobs,
    status: ['规划中', '建设中', '已投产'][Math.floor(Math.random() * 3)],
    progress: p.progress,
  }))
}

/** @deprecated 使用 getMockRelationGraphData 替代 */
export function getMockRelationGraph() {
  const data = getMockRelationGraphData()
  return {
    nodes: data.nodes.map((n) => ({
      id: n.id,
      name: n.name,
      category: n.industry,
      value: n.influenceScore,
    })),
    edges: data.edges.map((e) => ({
      source: e.source,
      target: e.target,
      weight: e.weight,
      type: e.label,
    })),
  }
}

/** @deprecated 使用 getMockDriveCapabilities 替代 */
export function getMockAnchorEnterprises() {
  return getMockDriveCapabilities(8).map((d) => ({
    id: d.id,
    name: d.name,
    industry: d.industry,
    derivedCount: d.historicalReferrals,
    investPotential: d.enthusiasmScore,
    relationshipType: (['供应商', '客户', '合作伙伴', '竞争对手'] as const)[
      Math.floor(Math.random() * 4)
    ],
  }))
}

/** @deprecated 使用 getMockLeadingEnterprisesDetailed 替代 */
export function getMockLeadingEnterprises() {
  return getMockLeadingEnterprisesDetailed(6).map((e) => ({
    id: e.id,
    name: e.name,
    industry: e.industry,
    revenue: e.revenue,
    marketShare: Math.floor(Math.random() * 30 + 5),
    innovationScore: Math.floor(Math.random() * 30 + 70),
    driveCapability: e.drivingScore,
    employees: e.employeeCount,
  }))
}

/** @deprecated 使用 getMockRankingItems 替代 */
export function getMockRankings() {
  return [
    { id: 'rank-1', name: '中国企业500强', year: '2025', count: 500, topCompany: '国家电网' },
    { id: 'rank-2', name: '制造业单项冠军', year: '2025', count: 256, topCompany: '中芯国际' },
    { id: 'rank-3', name: '独角兽企业榜', year: '2025', count: 328, topCompany: '字节跳动' },
    { id: 'rank-4', name: '专精特新小巨人', year: '2025', count: 899, topCompany: '—' },
    { id: 'rank-5', name: '高新技术企业TOP100', year: '2025', count: 100, topCompany: '华为技术' },
  ]
}

/** @deprecated 使用 getMockQualifiedEnterprisesList 替代 */
export function getMockQualifiedEnterprises() {
  const qualifications = ['高新技术企业', '专精特新', '科技型中小企业', '技术先进型服务企业']
  return qualifications.map((q, i) => ({
    id: `qual-${i}`,
    name: q,
    count: Math.floor(Math.random() * 300 + 50),
    newCount: Math.floor(Math.random() * 30 + 5),
    expireCount: Math.floor(Math.random() * 20 + 2),
    description: `${q}认定企业统计`,
  }))
}

/** @deprecated 使用 getMockFundItems 替代 */
export function getMockFunds() {
  return getMockFundItems(5).map((f) => ({
    id: f.id,
    name: f.name,
    scale: f.scale,
    invested: f.investedAmount,
    projects: Math.floor(Math.random() * 30 + 5),
    roi: (Math.random() * 15 + 5).toFixed(1),
    focus: f.targetIndustry,
  }))
}

/** @deprecated 使用 getMockResearchInstitutionsDetailed 替代 */
export function getMockResearchInstitutions() {
  return getMockResearchInstitutionsDetailed(6).map((inst) => ({
    id: inst.id,
    name: inst.name,
    type: inst.type === 'university' ? '高校' : '科研院所',
    field: inst.industryCases[0] || industries[0],
    patents: inst.patentCount,
    transfers: Math.floor(Math.random() * 50 + 5),
    cooperation: Math.floor(Math.random() * 100 + 20),
  }))
}

/** @deprecated 保留给旧页面使用 */
export function getMockTargets(count = 12) {
  return Array.from({ length: count }, (_, i) => ({
    id: `target-${i + 1}`,
    name: companyNames[i % companyNames.length],
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    matchScore: Math.floor(Math.random() * 30 + 70),
    chainPosition: chainSegments[i % chainSegments.length],
    investmentAmount: Math.floor(Math.random() * 100000 + 5000),
    status: (['待接触', '已接触', '洽谈中', '已签约'] as const)[i % 4],
    tags: randomItems(tagOptions, Math.floor(Math.random() * 3 + 1)),
  }))
}

/** @deprecated 保留给旧页面使用 */
export function getMockChainMatchData() {
  const chainNodes = industries.slice(0, 5).map((name, i) => ({
    id: `chain-${i}`,
    name,
    category: chainSegments[i % chainSegments.length],
    value: Math.floor(Math.random() * 100 + 50),
  }))
  const chainEdges: { source: string; target: string; weight: number; type: string }[] = []
  for (let i = 0; i < chainNodes.length - 1; i++) {
    chainEdges.push({
      source: chainNodes[i].id,
      target: chainNodes[i + 1].id,
      weight: Math.random() * 0.5 + 0.5,
      type: '供应',
    })
  }
  return { nodes: chainNodes, edges: chainEdges }
}

/** @deprecated 保留给旧页面使用 */
export function getMockChainKpiCards() {
  return [
    {
      key: 'totalChains',
      label: '产业链数量',
      value: 28,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+12.5%',
      icon: 'Share',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'matchedTargets',
      label: '已匹配目标',
      value: 156,
      unit: '家',
      trend: 'up' as const,
      trendValue: '+18.3%',
      icon: 'Aim',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'recommendCount',
      label: '推荐企业',
      value: 89,
      unit: '家',
      trend: 'up' as const,
      trendValue: '+8.6%',
      icon: 'Promotion',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'signedCount',
      label: '已签约数',
      value: 34,
      unit: '个',
      trend: 'up' as const,
      trendValue: '+22.1%',
      icon: 'DocumentChecked',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
  ]
}

/** @deprecated 保留给旧页面使用 */
export function getMockGapAnalysis() {
  return industries.slice(0, 5).map((name, i) => ({
    id: `gap-${i}`,
    chainName: name + '产业链',
    missingLinks: chainSegments.slice(i % 3, (i % 3) + 2),
    severity: (['高', '中', '低'] as const)[i % 3],
    targetCount: Math.floor(Math.random() * 10 + 2),
    fillRate: Math.floor(Math.random() * 40 + 10),
  }))
}

/** @deprecated 保留给旧页面使用 */
export function getMockChainOwners() {
  return industries.slice(0, 5).map((name, i) => ({
    id: `owner-${i}`,
    chainName: name + '产业链',
    ownerName: companyNames[i],
    matchScore: Math.floor(Math.random() * 25 + 75),
    driveIndex: Math.floor(Math.random() * 30 + 70),
    influenceRange: Math.floor(Math.random() * 50 + 30),
    cooperationCount: Math.floor(Math.random() * 80 + 20),
    revenue: Math.floor(Math.random() * 200000 + 30000),
  }))
}

/** @deprecated 保留给旧页面使用 */
export function getMockParks() {
  return getMockParkResources(6).map((p) => ({
    id: p.id,
    name: p.name,
    area: p.area,
    occupancy: Math.floor(Math.random() * 30 + 60),
    enterprises: Math.floor(Math.random() * 200 + 30),
    revenue: Math.floor(Math.random() * 300000 + 50000),
    vacantArea: p.availableArea,
    industry: p.leadingIndustry,
  }))
}

/** @deprecated 保留给旧页面使用 */
export function getMockRankingDetails(rankingId: string) {
  return getMockRankingEnterprises(rankingId, 10).map((e) => ({
    id: e.id,
    name: e.name,
    rank: e.rank,
    industry: e.industry,
    revenue: e.revenue,
    region: e.region,
    tags: e.tags,
  }))
}

/** @deprecated 保留给旧页面使用 */
export function getMockMapTargets() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `map-target-${i}`,
    name: companyNames[i % companyNames.length],
    lng: 104.5 + Math.random() * 1.2,
    lat: 30.5 + Math.random() * 1.2,
    industry: industries[i % industries.length],
    matchScore: Math.floor(Math.random() * 30 + 70),
    investmentAmount: Math.floor(Math.random() * 80000 + 5000),
    status: (['待接触', '已接触', '洽谈中'] as const)[i % 3],
  }))
}

/** @deprecated 保留给旧页面使用 */
export function getMockQualifiedList(qualType: string) {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `q-${qualType}-${i}`,
    name: companyNames[i % companyNames.length],
    qualification: qualType,
    validDate: `2025-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    status: (['有效', '即将到期', '已过期'] as const)[i % 3],
  }))
}

/** @deprecated 保留给旧页面使用 */
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

/** @deprecated 保留给旧页面使用 */
export interface InvestRecommendResult {
  id: string
  targetName: string
  chainName: string
  matchScore: number
  reasons: string[]
  estimatedInvestment: number
  priority: '高' | '中' | '低'
}

/** @deprecated 保留给旧页面使用 */
export interface LegacyInvestProject {
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
