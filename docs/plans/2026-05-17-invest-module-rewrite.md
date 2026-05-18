# 精准招商模块重写 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将精准招商模块36个页面从骨架/占位状态重写为完整功能页面，对接API+Mock数据，实现12种招商模式的全部业务逻辑与可视化

**Architecture:** 四层架构 — `types/invest.ts`(类型) → `mock/invest.ts`(数据工厂) → `modules/investApi.ts`(API桥接) → `views/invest/`(页面组件)。参照 benchmarking 模块模式：全部通过 API 异步获取，Promise 泛型标注，Mock 工厂函数支持筛选/分页参数。

**Tech Stack:** Vue 3 + TypeScript + Element Plus + ECharts (BaseChart) + Maptalks (地图页) + D3 ForceGraph (关系图谱页) + SCSS

---

## 现状分析

| 分类     | 页面                          | 数量 | 问题                                                                   |
| -------- | ----------------------------- | ---- | ---------------------------------------------------------------------- |
| 部分实现 | SmartRecommend, RelationGraph | 2    | SmartRecommend 直接调 mock 绕过 API 层；RelationGraph 有交互但数据单薄 |
| 骨架占位 | 其余34个页面                  | 34   | 仅有布局壳（PageHeader + 空StatCard + 简单BaseChart），无业务数据      |
| Mock层   | invest.ts                     | —    | 已有18个工厂函数但页面未消费；类型内联在mock文件中，缺独立types文件    |
| API层    | investApi.ts                  | —    | 12个fetch函数已存在，但大多数页面未调用                                |

## 重写模式（参照 benchmarking 模块）

- **类型层**: `src/api/types/invest.ts` — 独立文件，按 `// ===== 子模块名 =====` 分块
- **Mock层**: `src/api/mock/invest.ts` — 工厂函数 `getMock*()`，`Array.from + i%length` 模式，真实中文业务数据
- **API层**: `src/api/modules/investApi.ts` — `fetch*()` 返回 `Promise<XxxType>`，200ms 模拟延迟
- **页面**: PageHeader → [StatCards] → [SearchFilterBar] → [Charts] → [Table] → [Pagination]
- **v-loading**: 放在 `<el-table>` 或 `<div class="page-container">` 上
- **事件**: handleSearch / handleFilter / handleReset / handlePageChange / handleRefresh
- **图表**: `const xxxOption = ref({})` → 数据加载后赋值完整 ECharts option
- **颜色**: `const chartColors = ['#1889E8','#36CBCB','#4ECB73','#FBD437','#F2637B','#975FE5']`
- **SCSS**: 全局变量已注入，直接用 `$bg-card` / `$radius-base` / `$shadow-card` 等

## 六种页面模板速查

| 类型          | 布局                                                                     | 精准招商适用子模块                                                                                          |
| ------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Type A 仪表盘 | PageHeader + StatCard×4 + ChartGrid(2列) + [Table]                       | 8.1竞争力评估, 8.3对标/缺口, 8.5激励政策, 8.7策略/协同, 8.9基金引导, 8.10全景/转化, 8.11缺口/匹配, 8.12全景 |
| Type B 地图   | PageHeader + MapLayout(左360px面板+右地图)                               | 8.2 全部4页                                                                                                 |
| Type C 图谱   | PageHeader + ForceGraph(全宽) + 右侧抽屉(400px)                          | 8.1结构/关键节点, 8.4全部3页                                                                                |
| Type D 画像   | PageHeader + 左面板(400px)+右滚动区                                      | 8.5带动画像, 8.7识别评估, 8.8需求画像, 8.10人才共享, 8.11链主画像                                           |
| Type E 列表   | PageHeader + SearchFilterBar + [ResultBar] + CardList/Table + Pagination | 8.1目标推荐, 8.3补链库, 8.5生态网络, 8.6全部4页, 8.8智能识别/匹配, 8.9项目库/对接, 8.11匹配, 8.12智能匹配   |
| Type F 对比   | PageHeader + ComparisonSelector + 对比矩阵+雷达图                        | 8.3对标管理, 8.7策略生成                                                                                    |

---

## 任务执行说明

**每个 Task 在独立新会话中执行。** 会话启动时先读取本文件了解全局，再按 Task 指令执行。各 Task 按顺序执行（Task 0 必须最先），后续 Task 依赖 Task 0 创建的类型和基础设施。

---

### Task 0: 总体规划 — 共享基础设施搭建

**目标:** 创建精准招商模块全部共享类型定义、基础数据池、Mock工厂骨架、API桥接骨架，验证路由与菜单配置

**Files:**

- Create: `src/api/types/invest.ts`
- Modify: `src/api/mock/invest.ts`
- Modify: `src/api/modules/investApi.ts`
- Verify: `src/router/routes.ts` (invest 部分)
- Verify: `src/router/menuConfig.ts` (invest 部分)

**Step 1: 创建类型定义文件 `src/api/types/invest.ts`**

按以下结构组织，用 `// ===== 8.N 子模块名 =====` 分块注释：

```typescript
import type { KpiCard } from './analysis'

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
  localRate: number // 本地配套率 0-100
  nodeType: NodeType
  importance: number // 0-100
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
  center: [number, number] // lng, lat
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
  isHidden: boolean // 隐性缺口
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
  technologyChain: string[] // 基础研究→应用研究→产品原型→市场化
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
```

**Step 2: 验证路由配置**

读取 `src/router/routes.ts` 第636-974行，对照以下路由表确认全部39条路由存在且路径正确：

```
/invest/chain/structure          → ChainStructure.vue
/invest/chain/key-node           → KeyNode.vue
/invest/chain/competitiveness    → CompetitivenessAssess.vue
/invest/chain/smart-recommend   → SmartRecommend.vue
/invest/map-invest/resource-distribution → ResourceDistribution.vue
/invest/map-invest/space-atlas   → SpaceAtlas.vue
/invest/map-invest/advantage-identify → AdvantageIdentify.vue
/invest/map-invest/extension-recommend → ExtensionRecommend.vue
/invest/strengthen/benchmark     → BenchmarkTool.vue
/invest/strengthen/gap-diagnosis → GapDiagnosis.vue
/invest/strengthen/fill-target   → FillTargetLib.vue
/invest/relation/graph           → RelationGraph.vue
/invest/relation/radiation       → ChainOwnerRadiation.vue
/invest/relation/secondary       → SecondaryInvest.vue
/invest/merchant/driving-portrait → DrivingPortrait.vue
/invest/merchant/eco-network     → EcoNetworkMining.vue
/invest/merchant/incentive-policy → IncentivePolicy.vue
/invest/ranking/vertical         → VerticalRanking.vue
/invest/ranking/featured         → FeaturedRanking.vue
/invest/ranking/empower-tool     → EmpowerTool.vue
/invest/ranking/brand-linkage    → BrandLinkage.vue
/invest/leading/identify         → LeadingIdentify.vue
/invest/leading/strategy         → StrategyGenerate.vue
/invest/leading/eco-build        → EcoBuildCollaborate.vue
/invest/qualified/smart-identify → SmartIdentify.vue
/invest/qualified/demand-portrait → DemandPortrait.vue
/invest/qualified/resource-match → ResourceMatch.vue
/invest/fund/guide               → FundGuide.vue
/invest/fund/project-lib         → ProjectLib.vue
/invest/fund/capital-docking     → CapitalDocking.vue
/invest/research/panorama         → ResourcePanorama.vue
/invest/research/tech-transfer    → TechTransferAssess.vue
/invest/research/talent-mechanism → TalentMechanism.vue
/invest/chain-owner/portrait     → OwnerPortrait.vue
/invest/chain-owner/gap-diagnosis → ChainGapDiagnosis.vue
/invest/chain-owner/smart-match  → AdaptiveMatch.vue
/invest/park/panorama             → ParkPanorama.vue
/invest/park/smart-match          → SmartMatchEngine.vue
/invest/park/chain-collaborate   → ChainCollaborate.vue
```

如有缺失或路径不一致，修复之。同时检查 `src/router/menuConfig.ts` 第241-357行的菜单配置是否与路由一致。

**Step 3: 扩展 Mock 数据基础池**

修改 `src/api/mock/invest.ts`，在文件顶部扩展以下基础数据池：

```typescript
// 扩展行业分类
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

// 扩展区域
const regions = ['成都', '德阳', '绵阳', '凯州新城', '宜宾', '泸州', '南充', '达州', '内江', '乐山']

// 扩展企业名称池（20→40个）
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

// 产业链环节名池
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

// 资质类型
const qualificationNames = [
  '国家高新技术企业',
  '专精特新"小巨人"',
  '国家级绿色工厂',
  'ISO9001认证',
  '碳足迹认证',
  '省级技术中心',
  '国家重点实验室',
]

// 科研机构名池
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

// 基金名池
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
```

**Step 4: 在 mock/invest.ts 中新增以下工厂函数（骨架+数据池，后续各Task细化）**

为每个子模块添加 1-3 个 getMock 函数。此处仅列出函数签名和关键实现模式，具体数据内容在各 Task 中由执行者根据 PRD 填充。

```typescript
// 8.1 产业链招商
export function getMockChainStructure(): ChainStructureData { ... }
export function getMockKeyNodes(count = 8): KeyNodeData[] { ... }
export function getMockCompetitiveness(): CompetitivenessData { ... }
// getMockRecommendResults 已存在，需扩展字段以匹配 RecommendTarget 类型

// 8.2 产业地图招商
export function getMockMapResources(count = 6): MapResourceData[] { ... }
export function getMockSpaceAtlasEdges(count = 10): SpaceAtlasEdge[] { ... }
export function getMockAdvantageLinks(count = 6): AdvantageLink[] { ... }
export function getMockExtensionDirections(count = 5): ExtensionDirection[] { ... }

// 8.3 强延补链招商
export function getMockBenchmarkItems(): BenchmarkItem[] { ... }
export function getMockGapDiagnosis(count = 8): GapDiagnosisData[] { ... }
export function getMockFillTargets(count = 12): FillTarget[] { ... }

// 8.4 关系链招商
// getMockRelationGraph 已存在，需扩展字段以匹配 RelationGraphData 类型
export function getMockChainOwnerRadiations(count = 6): ChainOwnerRadiation[] { ... }
export function getMockSecondaryRelations(count = 10): SecondaryRelation[] { ... }

// 8.5 以商招商
export function getMockDriveCapabilities(count = 8): DriveCapability[] { ... }
export function getMockEcoNetworkNodes(count = 12): EcoNetworkNode[] { ... }
export function getMockIncentivePolicies(count = 8): IncentivePolicy[] { ... }

// 8.6 名企榜单招商
export function getMockRankingItems(count = 8): RankingItem[] { ... }
export function getMockRankingEnterprises(rankingId: string, count = 20): RankingEnterprise[] { ... }
export function getMockBrandLinkages(count = 6): BrandLinkage[] { ... }

// 8.7 龙头骨干招商
export function getMockLeadingEnterprisesDetailed(count = 8): LeadingEnterprise[] { ... }
export function getMockStrategyItems(count = 6): StrategyItem[] { ... }
export function getMockEcoSynergyItems(count = 6): EcoSynergyItem[] { ... }

// 8.8 资质企业招商
export function getMockQualifiedEnterprisesList(count = 15): QualifiedEnterprise[] { ... }
export function getMockDemandProfiles(count = 8): DemandProfile[] { ... }
export function getMockResourceMatches(count = 10): ResourceMatch[] { ... }

// 8.9 投行基金招商
export function getMockFundItems(count = 6): FundItem[] { ... }
// getMockInvestProjects 已存在，需扩展字段以匹配 InvestProject 类型
export function getMockCapitalMatches(count = 8): CapitalMatch[] { ... }

// 8.10 科研机构招商
export function getMockResearchInstitutionsDetailed(count = 8): ResearchInstitution[] { ... }
export function getMockTechTransferItems(count = 6): TechTransferItem[] { ... }
export function getMockTalentShareItems(count = 8): TalentShareItem[] { ... }

// 8.11 链主适配招商
export function getMockChainOwnerProfiles(count = 5): ChainOwnerProfile[] { ... }
export function getMockOwnerGapDiagnoses(count = 6): OwnerGapDiagnosis[] { ... }
export function getMockAdaptiveMatches(count = 10): AdaptiveMatch[] { ... }

// 8.12 园区招商
export function getMockParkResources(count = 6): ParkResource[] { ... }
export function getMockParkSmartMatches(count = 10): ParkSmartMatch[] { ... }
export function getMockParkChainSynergies(count = 6): ParkChainSynergy[] { ... }
```

**Step 5: 在 investApi.ts 中新增对应的 fetch 函数**

```typescript
import type {
  ChainStructureData,
  KeyNodeData,
  CompetitivenessData,
  RecommendTarget,
  MapResourceData,
  AdvantageLink,
  ExtensionDirection,
  BenchmarkItem,
  GapDiagnosisData,
  FillTarget,
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
  InvestListQuery,
  PaginatedData,
} from '@/api/types/invest'

// 每个 getMock* 对应一个 fetch* 函数
// 模式: export function fetchXxx(params?): Promise<Type> {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(getMockXxx(params)), 200)
//   })
// }
```

逐一添加，全部标注 `Promise<XxxType>` 返回类型。

**Step 6: 运行 check-all 验证**

```bash
npm run check-all
```

修复所有类型错误。确保新增的类型定义被 mock 和 API 层正确消费。

**Step 7: 提交**

```bash
git add -A && git commit -m "feat(invest): 添加精准招商模块类型定义与数据层骨架"
```

---

### Task 1: 8.1 产业链招商（4页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.1 产业链招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.1 的 getMock 函数数据内容
- Modify: `src/api/modules/investApi.ts` — 确认 8.1 的 fetch 函数已就位
- Rewrite: `src/views/invest/chain/ChainStructure.vue` — Type C 图谱页
- Rewrite: `src/views/invest/chain/KeyNode.vue` — Type A 仪表盘 + Type C 图谱
- Rewrite: `src/views/invest/chain/CompetitivenessAssess.vue` — Type A 仪表盘
- Rewrite: `src/views/invest/chain/SmartRecommend.vue` — Type E 列表页

**页面规格:**

#### ChainStructure.vue — 产业链结构 (Type C 图谱页)

- 布局: PageHeader + IndustryChainSelect下拉 + 全宽 ForceGraph + 右侧抽屉(400px)
- 数据: 调用 `fetchChainStructure()` 获取上游/中游/下游链式数据
- ForceGraph: 节点 = 产业链环节，边 = 上下游供应关系，节点大小 = importance，颜色 = nodeType
- 右侧抽屉: 点击节点显示 — 环节名称、类型标签、本地企业数、配套率进度条、企业列表
- 交互: 点击节点打开抽屉，hover 高亮邻居节点

#### KeyNode.vue — 关键节点 (Type A + C)

- 布局: PageHeader + StatCard×3(卡脖子数/高附加值数/政策敏感数) + 上下分割(上:节点表格,下:关键节点分布图)
- 数据: 调用 `fetchKeyNodes()`
- 表格: 列 = 节点名/类型/重要性/本地企业数/是否缺失/操作
- 图表: 横向柱状图按 importance 排序

#### CompetitivenessAssess.vue — 竞争力评估 (Type A 仪表盘)

- 布局: PageHeader + StatCard×4(综合得分/全国排名/区域排名/优势维度数) + ChartGrid(2列)
- 数据: 调用 `fetchCompetitiveness()`
- 图1: 雷达图 — 本地/全国/区域三维对比
- 图2: 横向柱状图 — 各维度得分对比

#### SmartRecommend.vue — 目标企业智能推荐 (Type E 列表页)

- 布局: PageHeader + StatCard×4 + SearchFilterBar + 卡片网格 + PaginationBar
- 数据: 调用 `fetchRecommendTargets()` (改造现有 fetchRecommendResults)
- SearchFilterBar: 行业/区域/优先级/匹配度范围
- 卡片: 企业名+行业+区域+ScoreRing匹配度+优先级Tag+推荐理由+操作按钮
- StatCard: 产业链数/已匹配/推荐企业/已签约
- 操作: "查看详情"按钮跳转画像页(预留)

**Mock 数据要点:**

```typescript
// getMockChainStructure
export function getMockChainStructure(): ChainStructureData {
  return {
    chainName: '新能源装备产业链',
    upstream: [
      { id: 'u1', name: '硅材料加工', enterpriseCount: 3, localRate: 45, nodeType: 'bottleneck', importance: 85 },
      { id: 'u2', name: '锂电原材料', enterpriseCount: 5, localRate: 72, nodeType: 'standard', importance: 60 },
      ...
    ],
    midstream: [
      { id: 'm1', name: '动力电池制造', enterpriseCount: 8, localRate: 88, nodeType: 'high-value', importance: 92 },
      { id: 'm2', name: '光伏组件生产', enterpriseCount: 6, localRate: 65, nodeType: 'standard', importance: 75 },
      ...
    ],
    downstream: [
      { id: 'd1', name: '新能源汽车整装', enterpriseCount: 2, localRate: 30, nodeType: 'policy-sensitive', importance: 90 },
      ...
    ]
  }
}
```

**check-all + commit:** `feat(invest): 重写8.1产业链招商4页`

---

### Task 2: 8.2 产业地图招商（4页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.2 产业地图招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.2 的 getMock 函数
- Modify: `src/api/modules/investApi.ts` — 确认 8.2 的 fetch 函数
- Rewrite: `src/views/invest/map-invest/ResourceDistribution.vue` — Type B 地图页
- Rewrite: `src/views/invest/map-invest/SpaceAtlas.vue` — Type B 地图页
- Rewrite: `src/views/invest/map-invest/AdvantageIdentify.vue` — Type B 地图页
- Rewrite: `src/views/invest/map-invest/ExtensionRecommend.vue` — Type B 地图页

**页面规格:**

#### ResourceDistribution.vue — 产业资源分布 (Type B 地图页)

- 布局: PageHeader + MapLayout(左MapControlPanel 360px + 右MaptalksMap flex-1)
- 左面板: 产业筛选(多选)+指标切换(产值/企业数/专利密度)+热力图开关+搜索框+结果列表
- 地图: 热力图层 + 标记图层(企业位置) + 聚合图层 + PopupOverlay
- 数据: `fetchMapResources()` → MapResourceData[]，映射到地图标记点
- 图例: 右下角 MapLegend 显示颜色-数值映射

#### SpaceAtlas.vue — 产业链空间图谱 (Type B 地图页)

- 布局: 同上 Type B
- 左面板: 产业链选择+物流路径开关+堵点标注开关
- 地图: 企业标记 + 物流路径线(弧线) + 堵点标记(红色图标)
- 数据: `fetchSpaceAtlasEdges()` → 空间路径数据

#### AdvantageIdentify.vue — 优势环节识别 (Type B 地图页)

- 布局: 同上 Type B
- 左面板: 指标权重调节(滑块)+优势阈值+筛选
- 地图: 各区域优势环节标注 + 对比柱状图(PopupOverlay中)
- 数据: `fetchAdvantageLinks()`

#### ExtensionRecommend.vue — 延伸方向推荐 (Type B 地图页)

- 布局: 同上 Type B
- 左面板: 当前环节选择+延伸方向类型(上游/下游)+可行性筛选
- 地图: 延伸方向箭头线 + 目标区域高亮
- 数据: `fetchExtensionDirections()`

**关键依赖:** 地图页需要 `src/components/map/` 下 7 个地图组件。已存在但需确认 MaptalksMap + MapControlPanel + MapLegend 等组件可用。

**注意:** 当前路由路径为 `/invest/map-invest/`（非 `/invest/map/`），menuConfig 中二级标题为"产业地图招商"。

**check-all + commit:** `feat(invest): 重写8.2产业地图招商4页`

---

### Task 3: 8.3 强延补链招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.3 强延补链招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.3 的 getMock 函数
- Modify: `src/api/modules/investApi.ts` — 确认 8.3 的 fetch 函数
- Rewrite: `src/views/invest/strengthen/BenchmarkTool.vue` — Type F 对比页
- Rewrite: `src/views/invest/strengthen/GapDiagnosis.vue` — Type A 仪表盘
- Rewrite: `src/views/invest/strengthen/FillTargetLib.vue` — Type E 列表页

**页面规格:**

#### BenchmarkTool.vue — 对标管理工具 (Type F 对比页)

- 布局: PageHeader + ComparisonSelector(选择标杆园区) + 对比矩阵 + 雷达图对比
- 数据: `fetchBenchmarkItems()` → BenchmarkItem[]
- 对比矩阵: 每行一个维度，ComparisonBar 横向对比条
- 雷达图: 本地 vs 标杆多维叠加
- 赶超路径: 选中维度展示 catchUpPath 文字说明

#### GapDiagnosis.vue — 缺口智能诊断 (Type A 仪表盘)

- 布局: PageHeader + StatCard×4(缺口总数/紧急缺口/隐性缺口/平均配套率) + ChartGrid(2列)
- 数据: `fetchGapDiagnosis()`
- 图1: 横向柱状图 — 各环节本地配套率 vs 行业平均
- 图2: 环形图 — 缺口等级分布(紧急/重要/一般)

#### FillTargetLib.vue — 补链目标库 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar + el-table + PaginationBar
- 数据: `fetchFillTargets()` → FillTarget[]
- SearchFilterBar: 优先级/培育类型/行业/匹配度范围
- 表格列: 企业名/行业/区域/匹配度/优先级Tag/培育类型/推荐政策/操作
- 操作: "查看详情"按钮(预留)

**check-all + commit:** `feat(invest): 重写8.3强延补链招商3页`

---

### Task 4: 8.4 关系链招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.4 关系链招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.4 的 getMock 函数，改造 getMockRelationGraph
- Modify: `src/api/modules/investApi.ts` — 确认 8.4 的 fetch 函数
- Rewrite: `src/views/invest/relation/RelationGraph.vue` — Type C 图谱页
- Rewrite: `src/views/invest/relation/ChainOwnerRadiation.vue` — Type D 画像页
- Rewrite: `src/views/invest/relation/SecondaryInvest.vue` — Type E 列表页

**页面规格:**

#### RelationGraph.vue — 关系图谱 (Type C 图谱页) — **已有部分实现需增强**

- 布局: PageHeader + 关系类型筛选(多选) + 全宽 ForceGraph + 右侧抽屉(280px)
- 增强点:
  - 改用 `fetchRelationGraph()` (API层) 替代直接调 mock
  - 增加关系类型筛选(供应/投资/合作/竞争/人才)多选按钮组
  - 增加节点搜索输入框
  - ForceGraph 按 RelationType 着色边
  - 右侧抽屉增加: 关联企业列表、影响力评分条
- 数据: `fetchRelationGraph()` → RelationGraphData

#### ChainOwnerRadiation.vue — 链主企业辐射力分析 (Type D 画像页)

- 布局: PageHeader + 左面板(链主企业选择+信息卡) + 右侧(辐射力指标+影响范围图+关联企业列表)
- 左面板: el-select 选择链主企业 + 基本信息卡(名称/行业/订单占比)
- 右侧:
  - StatCard×4: 订单占比/上下游企业数/扩张趋势/外迁风险
  - 仪表盘图: 辐射力指数(GaugeChart)
  - 关联企业表格: 名称/关系/依赖度/操作
- 数据: `fetchChainOwnerRadiations()`

#### SecondaryInvest.vue — 二级关联招商 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar + el-table + PaginationBar
- 数据: `fetchSecondaryRelations()`
- SearchFilterBar: 关系类型/匹配度/联系状态
- 表格列: 企业名/行业/关系路径/关系类型/匹配度/联系状态/操作

**check-all + commit:** `feat(invest): 重写8.4关系链招商3页`

---

### Task 5: 8.5 以商招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.5 以商招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.5 的 getMock 函数
- Modify: `src/api/modules/investApi.ts` — 确认 8.5 的 fetch 函数
- Rewrite: `src/views/invest/merchant/DrivingPortrait.vue` — Type D 画像页
- Rewrite: `src/views/invest/merchant/EcoNetworkMining.vue` — Type C 图谱页
- Rewrite: `src/views/invest/merchant/IncentivePolicy.vue` — Type E 列表页

**页面规格:**

#### DrivingPortrait.vue — 带动能力画像 (Type D 画像页)

- 布局: PageHeader + 左面板(400px, 企业选择+信息卡+评分+标签) + 右侧(评分维度图+趋势+历史行为)
- 左面板: el-select选择企业 + 名称/行业 + 三维评分卡(供应链影响力/投资活跃度/行业号召力) + 预测标签(积极/一般/不积极)
- 右侧:
  - 雷达图: 三维评分可视化
  - 折线图: 历史推荐趋势
  - 表格: 历史引荐记录

#### EcoNetworkMining.vue — 生态网络挖掘 (Type C 图谱页)

- 布局: PageHeader + 链主选择下拉 + 全宽 ForceGraph + 右侧抽屉
- ForceGraph: 节点=供应链/投资/人才关联企业，边=关系类型，颜色=关系类型
- 右侧抽屉: 节点详情(企业名/类型/关系/投资潜力)
- 底部: 潜在招商目标清单(简单el-table)
- 数据: `fetchEcoNetworkNodes()`

#### IncentivePolicy.vue — 招商激励政策 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar + el-table + PaginationBar
- 数据: `fetchIncentivePolicies()`
- SearchFilterBar: 政策类型(现金奖励/资源倾斜/免租)/状态(生效/过期/草稿)
- 表格列: 政策名/类型/奖励比例/适用企业/条件/状态/操作

**check-all + commit:** `feat(invest): 重写8.5以商招商3页`

---

### Task 6: 8.6 名企榜单招商（4页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.6 名企榜单招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.6 的 getMock 函数
- Modify: `src/api/modules/investApi.ts` — 确认 8.6 的 fetch 函数
- Rewrite: `src/views/invest/ranking/VerticalRanking.vue` — Type E 列表页
- Rewrite: `src/views/invest/ranking/FeaturedRanking.vue` — Type E 列表页
- Rewrite: `src/views/invest/ranking/EmpowerTool.vue` — Type A 仪表盘+工具
- Rewrite: `src/views/invest/ranking/BrandLinkage.vue` — Type A 仪表盘

**页面规格:**

#### VerticalRanking.vue — 垂直榜单 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar + 卡片网格(榜单卡片) + PaginationBar
- 数据: `fetchRankingItems()`
- SearchFilterBar: 榜单类别(行业/区域/规模)/行业筛选/发布机构
- 榜单卡片: 榜单名+类别Tag+行业+企业数+发布日期+发布机构+"查看详情"
- 点击卡片 → 展开企业明细列表(el-table, 排名/企业名/行业/区域/营收/协同度/标签)

#### FeaturedRanking.vue — 特色榜单 (Type E 列表页)

- 布局: 同 VerticalRanking，但默认筛选 category 不同
- 特色: 增加地方产业定制标签（如"凯州高端装备配套30强"）

#### EmpowerTool.vue — 榜单赋能招商工具 (Type A 仪表盘+工具)

- 布局: PageHeader + 配置区(el-form: 产业定位输入+匹配维度选择+最低协同度滑块) + 结果区
- 配置区: 产业定位文本框 + 匹配维度多选(技术互补/投资匹配/资源协同/政策契合) + 最低协同度滑块
- 结果区: 匹配企业卡片网格(按协同度排序) + 行业分布饼图 + 匹配度分布柱状图
- 交互: 点击"生成推荐"按钮触发数据加载
- 数据: `fetchRankingEnterprises()`

#### BrandLinkage.vue — 品牌联动与传播 (Type A 仪表盘)

- 布局: PageHeader + StatCard×4(活动数/联合发布数/邀请企业数/签约数) + ChartGrid(2列) + 活动时间线
- 数据: `fetchBrandLinkages()`
- 图1: 柱状图 — 活动类型分布
- 图2: 折线图 — 活动趋势(月度)
- 时间线: el-timeline 展示活动列表

**check-all + commit:** `feat(invest): 重写8.6名企榜单招商4页`

---

### Task 7: 8.7 龙头骨干招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.7 龙头骨干招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.7 的 getMock 函数
- Modify: `src/api/modules/investApi.ts` — 确认 8.7 的 fetch 函数
- Rewrite: `src/views/invest/leading/LeadingIdentify.vue` — Type D 画像页
- Rewrite: `src/views/invest/leading/StrategyGenerate.vue` — Type A 仪表盘
- Rewrite: `src/views/invest/leading/EcoBuildCollaborate.vue` — Type A 仪表盘

**页面规格:**

#### LeadingIdentify.vue — 龙头骨干企业识别与评估 (Type D 画像页)

- 布局: PageHeader + 左面板(400px, 企业列表+信息卡+评分) + 右侧(多维评分图+企业分布)
- 左面板: el-select 选择企业 + 名称/行业/营收/人数 + 影响力评分卡(ScoreRing) + 带动力评分卡 + 标签云
- 右侧:
  - 雷达图: 影响力/带动力/创新力/扩张意愿/产业链覆盖
  - 柱状图: 与行业龙头对比
  - 评估结果Tag: 推荐招引/持续关注/暂不推荐

#### StrategyGenerate.vue — 精准招商策略生成 (Type A 仪表盘)

- 布局: PageHeader + 企业选择 + 策略卡片列表 + ChartGrid(2列)
- 数据: `fetchStrategyItems()`
- 策略卡片: 企业名+策略类型+政策包+匹配度+预计投资+时间线
- 图1: 饼图 — 策略类型分布
- 图2: 柱状图 — 各企业匹配度对比

#### EcoBuildCollaborate.vue — 生态构建与协同 (Type A 仪表盘)

- 布局: PageHeader + StatCard×3 + ChartGrid(2列)
- 数据: `fetchEcoSynergyItems()`
- StatCard: 缺口环节数/推荐企业数/集群潜力指数
- 图1: 柱状图 — 各环节集群潜力
- 图2: 饼图 — 协同度分布

**check-all + commit:** `feat(invest): 重写8.7龙头骨干招商3页`

---

### Task 8: 8.8 资质企业招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.8 资质企业招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.8 的 getMock 函数
- Modify: `src/api/modules/investApi.ts` — 确认 8.8 的 fetch 函数
- Rewrite: `src/views/invest/qualified/SmartIdentify.vue` — Type E 列表页
- Rewrite: `src/views/invest/qualified/DemandPortrait.vue` — Type D 画像页
- Rewrite: `src/views/invest/qualified/ResourceMatch.vue` — Type E 列表页

**页面规格:**

#### SmartIdentify.vue — 资质企业智能识别 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar + 卡片网格/表格(视图切换) + PaginationBar
- 数据: `fetchQualifiedEnterprisesList()`
- SearchFilterBar: 资质类型(技术/绿色/质量)/资质等级(国家级/省级)/行业/关键词
- 卡片视图: EnterpriseCard — 企业名+行业+资质标签组+等级Tag
- 表格视图: 企业名/行业/资质类型/资质名/等级/标签/操作
- 结果操作栏: 计数+排序+视图切换+导出

#### DemandPortrait.vue — 资质企业需求画像 (Type D 画像页)

- 布局: PageHeader + 左面板(企业选择+基本信息+需求类型标签) + 右侧(需求详情+匹配资源)
- 左面板: el-select + 企业名/行业 + 需求类型Tag(研发型/生产型/市场型) + 核心诉求
- 右侧:
  - 需求详情卡: 核心诉求+所需资源列表
  - 匹配资源列表: 资源名+匹配度+说明

#### ResourceMatch.vue — 资源智能匹配 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar(资质类型筛选) + el-table + PaginationBar
- 数据: `fetchResourceMatches()`
- 表格列: 企业名/资质类型/匹配资源/匹配度/联系方式/操作

**check-all + commit:** `feat(invest): 重写8.8资质企业招商3页`

---

### Task 9: 8.9 投行基金招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.9 投行基金招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.9 的 getMock 函数，改造 getMockInvestProjects / getMockFunds
- Modify: `src/api/modules/investApi.ts` — 确认 8.9 的 fetch 函数
- Rewrite: `src/views/invest/fund/FundGuide.vue` — Type A 仪表盘
- Rewrite: `src/views/invest/fund/ProjectLib.vue` — Type E 列表页
- Rewrite: `src/views/invest/fund/CapitalDocking.vue` — Type A 仪表盘

**页面规格:**

#### FundGuide.vue — 产业基金引导 (Type A 仪表盘)

- 布局: PageHeader + StatCard×4(基金总数/总规模/已投资额/投向产业数) + ChartGrid(2列)
- 数据: `fetchFundItems()`
- 图1: 柱状图 — 各基金规模对比(已投/未投堆叠)
- 图2: 饼图 — 投向产业分布

#### ProjectLib.vue — 项目库管理 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar + el-table + PaginationBar
- 数据: `fetchInvestProjects()`
- SearchFilterBar: 行业/状态(筛选/尽调/谈判/签约/实施)/投资额范围
- 表格列: 项目名/行业/类型/投资额/面积/就业人数/状态/进度条/操作

#### CapitalDocking.vue — 资本对接 (Type A 仪表盘)

- 布局: PageHeader + StatCard×4 + 对接匹配卡片网格
- 数据: `fetchCapitalMatches()`
- StatCard: 待对接/对接中/谈判中/已签约
- 卡片网格: 企业名+机构名+匹配度+融资阶段+金额+状态Tag
- 图: 柱状图 — 融资阶段分布

**check-all + commit:** `feat(invest): 重写8.9投行基金招商3页`

---

### Task 10: 8.10 科研机构招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.10 科研机构招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.10 的 getMock 函数，改造 getMockResearchInstitutions
- Modify: `src/api/modules/investApi.ts` — 确认 8.10 的 fetch 函数
- Rewrite: `src/views/invest/research/ResourcePanorama.vue` — Type A 仪表盘
- Rewrite: `src/views/invest/research/TechTransferAssess.vue` — Type A 仪表盘
- Rewrite: `src/views/invest/research/TalentMechanism.vue` — Type D 画像页

**页面规格:**

#### ResourcePanorama.vue — 科研资源全景库 (Type A 仪表盘)

- 布局: PageHeader + StatCard×4(机构数/专利总数/国家级项目/院士团队数) + ChartGrid(2列) + 机构列表表格
- 数据: `fetchResearchInstitutionsDetailed()`
- 图1: 柱状图 — 各机构专利数对比
- 图2: 饼图 — 机构类型分布(高校/重点实验室/研发机构)
- 表格: 机构名/类型/专利数/国家级项目/院士数/操作

#### TechTransferAssess.vue — 技术转化潜力评估 (Type A 仪表盘)

- 布局: PageHeader + StatCard×4 + ChartGrid(2列) + 转化项目卡片列表
- 数据: `fetchTechTransferItems()`
- StatCard: 可转化技术数/高适配项目/转化路径数/产业嫁接方案数
- 图1: 横向柱状图 — 各技术产业适配度
- 图2: 桑基图或瀑布图 — 技术转化路径(基础研究→应用→原型→市场化)

#### TalentMechanism.vue — 人才流动与共享机制 (Type D 画像页)

- 布局: PageHeader + 左面板(专家选择+信息卡) + 右侧(可服务时段+企业匹配)
- 左面板: el-select 选择专家 + 姓名/领域/机构 + 合规状态Tag
- 右侧:
  - 可服务时段卡: 月度/季度/年度
  - 企业匹配列表: 企业名+领域+匹配说明

**check-all + commit:** `feat(invest): 重写8.10科研机构招商3页`

---

### Task 11: 8.11 链主适配招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.11 链主适配招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.11 的 getMock 函数
- Modify: `src/api/modules/investApi.ts` — 确认 8.11 的 fetch 函数
- Rewrite: `src/views/invest/chain-owner/OwnerPortrait.vue` — Type D 画像页
- Rewrite: `src/views/invest/chain-owner/ChainGapDiagnosis.vue` — Type A 仪表盘
- Rewrite: `src/views/invest/chain-owner/AdaptiveMatch.vue` — Type E 列表页

**页面规格:**

#### OwnerPortrait.vue — 链主画像与需求解析 (Type D 画像页)

- 布局: PageHeader + 左面板(400px, 链主选择+多维标签+需求) + 右侧(供应链分析+扩张动态)
- 左面板:
  - el-select 选择链主企业
  - 多维标签: 供应链控制力/技术话语权/扩张动态 (数值+进度条)
  - 关键需求列表: 从公告/招标提取的需求关键词Tag
- 右侧:
  - 雷达图: 供应链控制力/技术话语权/扩张动态/本地采购率/行业标准参与度
  - 柱状图: 上游集中度/下游分布
  - 需求提取文本区

#### ChainGapDiagnosis.vue — 产业链缺口诊断 (Type A 仪表盘)

- 布局: PageHeader + StatCard×3(健康环节数/预警环节数/危急环节数) + ChartGrid(2列) + 环节健康度表格
- 数据: `fetchOwnerGapDiagnoses()`
- 图1: 横向柱状图 — 各环节本地配套率(颜色按健康度: 绿/黄/红)
- 图2: 环形图 — 健康度分布
- 表格: 环节名/本地率/进口率/是否卡脖子/健康度Tag/操作

#### AdaptiveMatch.vue — 适配企业智能匹配 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar + 卡片网格 + PaginationBar
- 数据: `fetchAdaptiveMatches()`
- SearchFilterBar: 行业/匹配维度/最低适配度
- 卡片: 企业名+行业+适配度(ScoreRing)+多维度评分条+推荐行动Tag

**check-all + commit:** `feat(invest): 重写8.11链主适配招商3页`

---

### Task 12: 8.12 园区招商（3页）

**PRD 参考:** `docs/prd/modules/08-invest.md` — 8.12 园区招商

**Files:**

- Modify: `src/api/mock/invest.ts` — 细化 8.12 的 getMock 函数，改造 getMockParks
- Modify: `src/api/modules/investApi.ts` — 确认 8.12 的 fetch 函数
- Rewrite: `src/views/invest/park/ParkPanorama.vue` — Type A 仪表盘
- Rewrite: `src/views/invest/park/SmartMatchEngine.vue` — Type E 列表页
- Rewrite: `src/views/invest/park/ChainCollaborate.vue` — Type A 仪表盘

**页面规格:**

#### ParkPanorama.vue — 园区资源全景展示 (Type A 仪表盘)

- 布局: PageHeader + StatCard×4(园区数/总面积/可用面积/入驻企业数) + ChartGrid(2列) + 园区卡片网格
- 数据: `fetchParkResources()`
- 图1: 柱状图 — 各园区面积(可用/已用堆叠)
- 图2: 饼图 — 主导产业分布
- 园区卡片: 园区名+面积+交通枢纽Tag+主导产业+政策Tag+龙头企业列表+可用面积

#### SmartMatchEngine.vue — 智能企业匹配引擎 (Type E 列表页)

- 布局: PageHeader + SearchFilterBar(企业需求输入) + 匹配结果卡片 + PaginationBar
- 数据: `fetchParkSmartMatches()`
- SearchFilterBar: 行业类型/面积需求/员工规模/关键词
- 卡片: 企业名+行业+面积需求+匹配园区列表(园区名+评分)+综合匹配度

#### ChainCollaborate.vue — 产业链协同招商 (Type A 仪表盘)

- 布局: PageHeader + StatCard×3(薄弱环节数/推荐企业数/协同度) + ChartGrid(2列)
- 数据: `fetchParkChainSynergies()`
- StatCard: 薄弱环节数/推荐补链企业数/链主奖励包数
- 图1: 横向柱状图 — 各环节本地配套率(标注<40%为薄弱)
- 图2: 柱状图 — 协同度评分

**check-all + commit:** `feat(invest): 重写8.12园区招商3页`

---

### Task 13: 收尾核对

**目标:** 全模块一致性验证 + 代码质量检查

**Step 1: 运行 check-all**

```bash
npm run check-all
```

修复所有 lint/format/type 错误。

**Step 2: 运行 build**

```bash
npm run build
```

修复所有构建错误。

**Step 3: 跨模块一致性审查**

检查以下一致性：

1. **API 调用模式一致**: 所有页面通过 `fetch*` API 函数获取数据，无直接调 `getMock*` 的情况
2. **StatCard 使用一致**: 所有 Type A 页面有 3-4 个 StatCard，数据由 API 驱动
3. **SearchFilterBar 使用一致**: 所有 Type E 页面有搜索筛选，表格有分页
4. **图表颜色一致**: 全部使用 `chartColors = ['#1889E8','#36CBCB','#4ECB73','#FBD437','#F2637B','#975FE5']`
5. **SCSS 变量一致**: 无硬编码颜色值，全部使用 `$变量`
6. **v-loading 一致**: 数据加载有 loading 状态
7. **Promise 泛型一致**: 所有 fetch 函数标注了 `Promise<XxxType>` 返回类型
8. **Element Plus 用法**: radio/checkbox 用 `label` 不用 `value`，柱状图加 `barMaxWidth: 32`

**Step 4: 路由与菜单核对**

- 所有 39 条路由在 `routes.ts` 中存在且组件正确
- `menuConfig.ts` 与路由一一对应
- 每个页面标题与 PRD 一致

**Step 5: 给出总结**

列出所有变更文件清单、修复的问题、确认的一致性项。**不自动 commit**，等用户确认。

---

## 附录: 各 Task 需导入的公共组件速查

| 组件               | 导入路径                 | 适用页面类型    |
| ------------------ | ------------------------ | --------------- |
| PageHeader         | `@/components/common/`   | 全部            |
| StatCard           | `@/components/common/`   | Type A/D        |
| SearchFilterBar    | `@/components/common/`   | Type E          |
| PaginationBar      | `@/components/common/`   | Type E          |
| EmptyState         | `@/components/common/`   | 无数据时        |
| BaseChart          | `@/components/charts/`   | Type A/D        |
| ForceGraph         | `@/components/graph/`    | Type C          |
| ScoreRing          | `@/components/business/` | Type D/E 匹配度 |
| EnterpriseCard     | `@/components/business/` | Type E 卡片视图 |
| EnterpriseTag      | `@/components/business/` | Type D/E 标签   |
| ComparisonSelector | `@/components/business/` | Type F          |
| ComparisonBar      | `@/components/business/` | Type F          |
| MaptalksMap        | `@/components/map/`      | Type B          |
| MapControlPanel    | `@/components/map/`      | Type B          |
| MapLegend          | `@/components/map/`      | Type B          |

## 附录: SCSS 全局变量速查

```scss
$color-primary: #1889e8;
$color-primary-dark: #0970f0;
$bg-page: #f6f7fb;
$bg-card: #fff;
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$border-color: #dcdfe6;
$shadow-card: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
$radius-base: 4px;
$font-weight-semibold: 600;
$chart-colors: ('#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5');
```

## 附录: 关键文件路径

```
src/api/types/invest.ts              ← 类型定义(Task 0 创建)
src/api/mock/invest.ts               ← Mock 数据工厂
src/api/modules/investApi.ts         ← API 桥接层
src/router/routes.ts                 ← 路由(636-974行 invest部分)
src/router/menuConfig.ts             ← 菜单(241-357行 invest部分)
src/views/invest/chain/              ← 8.1 产业链招商(4页)
src/views/invest/map-invest/         ← 8.2 产业地图招商(4页)
src/views/invest/strengthen/         ← 8.3 强延补链招商(3页)
src/views/invest/relation/           ← 8.4 关系链招商(3页)
src/views/invest/merchant/           ← 8.5 以商招商(3页)
src/views/invest/ranking/            ← 8.6 名企榜单招商(4页)
src/views/invest/leading/            ← 8.7 龙头骨干招商(3页)
src/views/invest/qualified/          ← 8.8 资质企业招商(3页)
src/views/invest/fund/               ← 8.9 投行基金招商(3页)
src/views/invest/research/           ← 8.10 科研机构招商(3页)
src/views/invest/chain-owner/        ← 8.11 链主适配招商(3页)
src/views/invest/park/               ← 8.12 园区招商(3页)
```
