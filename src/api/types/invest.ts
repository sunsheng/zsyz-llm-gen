// 精准招商模块类型定义

// ===== 通用枚举 =====
export type InvestStatus = 'targeting' | 'contacting' | 'negotiating' | 'signed' | 'lost'
export type ChainPosition = 'upstream' | 'midstream' | 'downstream'
export type Priority = 'urgent' | 'important' | 'normal'
export type NodeType = 'bottleneck' | 'high-value' | 'policy-sensitive' | 'standard'
export type RelationType = 'supply' | 'investment' | 'cooperation' | 'competition' | 'talent'
export type MatchDimension = 'technology' | 'market' | 'resource' | 'policy'

// ===== 8.1 产业链招商 =====
export interface ChainStructureData {
  chainName: string
  upstream: ChainSegment[]
  midstream: ChainSegment[]
  downstream: ChainSegment[]
}
export interface ChainSegment {
  id: string
  name: string
  enterpriseCount: number
  localRate: number
  nodeType: NodeType
  importance: number
}
export interface KeyNodeData {
  id: string
  name: string
  nodeType: NodeType
  importance: number
  localEnterprises: string[]
  missingFlag: boolean
  description: string
}
export interface CompetitivenessData {
  dimensions: string[]
  localScores: number[]
  nationalAvg: number[]
  regionAvg: number[]
}
export interface RecommendTarget {
  id: string
  name: string
  industry: string
  region: string
  matchScore: number
  chainPosition: ChainPosition
  investmentAmount: string
  status: InvestStatus
  priority: Priority
  tags: string[]
  reasons: string[]
}

// ===== 8.2 产业地图招商 =====
export interface MapResourceData {
  industryName: string
  enterpriseCount: number
  outputValue: number
  patentDensity: number
  center: [number, number]
  radius: number
}
export interface SpaceAtlasEdge {
  from: [number, number]
  to: [number, number]
  type: 'logistics' | 'supply' | 'service'
  volume: number
  bottleneck: boolean
}
export interface AdvantageLink {
  linkName: string
  outputShare: number
  patentDensity: number
  marketShare: number
  compositeScore: number
}
export interface ExtensionDirection {
  fromLink: string
  toLink: string
  addedValue: number
  feasibility: number
  recommendedActions: string[]
}

// ===== 8.3 强延补链招商 =====
export interface BenchmarkItem {
  dimension: string
  localValue: number
  benchmarkValue: number
  gap: number
  catchUpPath: string
}
export interface GapDiagnosisData {
  segmentName: string
  localRate: number
  importRate: number
  gapLevel: Priority
  isHidden: boolean
  techGapYears: number
}
export interface FillTarget {
  id: string
  name: string
  industry: string
  region: string
  matchScore: number
  priority: Priority
  cultivationType: 'local' | 'external'
  techMatchRate: number
  recommendedPolicies: string[]
}

// ===== 8.4 关系链招商 =====
export interface RelationNode {
  id: string
  name: string
  type: 'enterprise' | 'institution'
  industry: string
  relationCount: number
  influenceScore: number
}
export interface RelationEdge {
  source: string
  target: string
  type: RelationType
  weight: number
  label: string
}
export interface RelationGraphData {
  nodes: RelationNode[]
  edges: RelationEdge[]
}
export interface ChainOwnerRadiation {
  enterpriseName: string
  orderShare: number
  upstreamCount: number
  downstreamCount: number
  expansionTrend: 'expanding' | 'stable' | 'shrinking'
  relocationRisk: number
  influenceRadius: number
}
export interface SecondaryRelation {
  id: string
  name: string
  industry: string
  relationPath: string
  relationType: string
  matchScore: number
  contactStatus: InvestStatus
}

// ===== 8.5 以商招商 =====
export interface DriveCapability {
  id: string
  name: string
  industry: string
  supplyChainInfluence: number
  investmentActivity: number
  industryInfluence: number
  historicalReferrals: number
  enthusiasmScore: number
}
export interface EcoNetworkNode {
  id: string
  name: string
  type: 'supplier' | 'customer' | 'investee' | 'talent-related'
  relation: string
  investmentPotential: number
}
export interface IncentivePolicy {
  id: string
  name: string
  type: 'cash-reward' | 'resource-priority' | 'rent-free'
  rewardRate: string
  targetEnterprise: string
  conditions: string
  status: 'active' | 'expired' | 'draft'
}

// ===== 8.6 名企榜单招商 =====
export type RankingCategory = 'industry' | 'regional' | 'scale'
export interface RankingItem {
  id: string
  name: string
  category: RankingCategory
  industry: string
  region: string
  publishOrg: string
  publishDate: string
  enterpriseCount: number
}
export interface RankingEnterprise {
  id: string
  rankingId: string
  rank: number
  name: string
  industry: string
  region: string
  revenue: number
  synergy: number
  tags: string[]
}
export interface EmpowerToolConfig {
  industryFocus: string
  matchDimension: MatchDimension
  minSynergy: number
}
export interface BrandLinkage {
  id: string
  activityName: string
  partnerOrg: string
  type: 'rank-publish' | 'city-tour' | 'forum'
  date: string
  invitedCount: number
  signedCount: number
  status: 'planned' | 'ongoing' | 'completed'
}

// ===== 8.7 龙头骨干招商 =====
export interface LeadingEnterprise {
  id: string
  name: string
  industry: string
  revenue: number
  employeeCount: number
  influenceScore: number
  drivingScore: number
  tags: string[]
  expansionIntent: boolean
}
export interface StrategyItem {
  id: string
  enterpriseName: string
  strategyType: string
  policyPackage: string
  matchScore: number
  estimatedInvestment: string
  timeline: string
}
export interface EcoSynergyItem {
  id: string
  chainGap: string
  recommendedEnterprises: string[]
  synergyScore: number
  clusterPotential: number
}

// ===== 8.8 资质企业招商 =====
export type QualificationType = 'technology' | 'green' | 'quality'
export type QualificationLevel = 'national' | 'provincial'
export interface QualifiedEnterprise {
  id: string
  name: string
  industry: string
  region: string
  qualificationType: QualificationType
  qualificationLevel: QualificationLevel
  qualificationName: string
  tags: string[]
}
export interface DemandProfile {
  id: string
  name: string
  demandType: 'research' | 'production' | 'market'
  coreDemand: string
  requiredResources: string[]
  matchScore: number
}
export interface ResourceMatch {
  id: string
  enterpriseName: string
  qualificationType: QualificationType
  matchResources: string[]
  matchScore: number
  contactInfo: string
}

// ===== 8.9 投行基金招商 =====
export interface FundItem {
  id: string
  name: string
  targetIndustry: string
  scale: number
  investedAmount: number
  status: 'raising' | 'investing' | 'exiting'
  manager: string
}
export interface InvestProject {
  id: string
  name: string
  industry: string
  type: string
  investmentAmount: number
  area: number
  jobs: number
  status: 'screening' | 'due-diligence' | 'negotiating' | 'signed' | 'implementing'
  progress: number
}
export interface CapitalMatch {
  id: string
  enterpriseName: string
  institutionName: string
  matchScore: number
  financingStage: string
  amount: number
  status: 'pending' | 'contacting' | 'negotiating' | 'closed'
}

// ===== 8.10 科研机构招商 =====
export interface ResearchInstitution {
  id: string
  name: string
  type: 'university' | 'key-lab' | 'rd-institution'
  patentCount: number
  equipment: string[]
  nationalProjects: number
  academicianCount: number
  industryCases: string[]
}
export interface TechTransferItem {
  id: string
  institutionName: string
  technologyName: string
  technologyChain: string[]
  industryFit: number
  commercializableStage: string
  transferPath: string
}
export interface TalentShareItem {
  id: string
  expertName: string
  field: string
  institution: string
  availability: 'monthly' | 'quarterly' | 'annual'
  enterpriseMatch: string[]
  complianceStatus: 'approved' | 'pending' | 'restricted'
}

// ===== 8.11 链主适配招商 =====
export interface ChainOwnerProfile {
  id: string
  name: string
  industry: string
  supplyChainControl: number
  techInfluence: number
  expansionDynamic: string
  localProcurementRate: number
  keyDemands: string[]
  tags: string[]
}
export interface OwnerGapDiagnosis {
  segmentName: string
  localRate: number
  importRate: number
  bottleneckFlag: boolean
  healthLevel: 'healthy' | 'warning' | 'critical'
}
export interface AdaptiveMatch {
  id: string
  targetName: string
  industry: string
  adaptScore: number
  matchDimensions: { dimension: MatchDimension; score: number }[]
  recommendedActions: string[]
}

// ===== 8.12 园区招商 =====
export interface ParkResource {
  id: string
  name: string
  area: number
  transportHubs: string[]
  leadingIndustry: string
  industryShare: number
  leadingEnterprises: string[]
  policyTags: string[]
  availableArea: number
}
export interface ParkSmartMatch {
  id: string
  enterpriseName: string
  industry: string
  areaNeed: number
  employeeCount: number
  matchedParks: { parkId: string; parkName: string; score: number }[]
  matchScore: number
}
export interface ParkChainSynergy {
  id: string
  weakSegment: string
  localRate: number
  recommendedEnterprises: string[]
  chainOwnerReward: string
  synergyScore: number
}

// ===== 通用分页 =====
export interface InvestListQuery {
  keyword?: string
  industry?: string
  region?: string
  current: number
  pageSize: number
}
