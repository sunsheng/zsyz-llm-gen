// 精准招商 API
import {
  getMockTargets,
  getMockRecommendResults,
  getMockInvestProjects,
  getMockRelationGraph,
  getMockAnchorEnterprises,
  getMockLeadingEnterprises,
  getMockRankings,
  getMockQualifiedEnterprises,
  getMockFunds,
  getMockResearchInstitutions,
  getMockChainStructure,
  getMockKeyNodes,
  getMockCompetitiveness,
  getMockRecommendTargets,
  getMockMapResources,
  getMockSpaceAtlasEdges,
  getMockAdvantageLinks,
  getMockExtensionDirections,
  getMockBenchmarkItems,
  getMockGapDiagnosis,
  getMockFillTargets,
  getMockRelationGraphData,
  getMockChainOwnerRadiations,
  getMockSecondaryRelations,
  getMockDriveCapabilities,
  getMockEcoNetworkNodes,
  getMockIncentivePolicies,
  getMockRankingItems,
  getMockRankingEnterprises,
  getMockBrandLinkages,
  getMockLeadingEnterprisesDetailed,
  getMockStrategyItems,
  getMockEcoSynergyItems,
  getMockQualifiedEnterprisesList,
  getMockDemandProfiles,
  getMockResourceMatches,
  getMockFundItems,
  getMockInvestProjectsDetailed,
  getMockCapitalMatches,
  getMockResearchInstitutionsDetailed,
  getMockTechTransferItems,
  getMockTalentShareItems,
  getMockChainOwnerProfiles,
  getMockOwnerGapDiagnoses,
  getMockAdaptiveMatches,
  getMockParkResources,
  getMockParkSmartMatches,
  getMockParkChainSynergies,
} from '@/api/mock/invest'
import { getMockEnterpriseList, getMockEnterpriseDetail } from '@/api/mock/enterprises'
import type { PaginatedData } from '@/api/types/common'
import type { EnterpriseListItem, EnterpriseDetail } from '@/api/types/enterprise'
import type {
  ChainStructureData,
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
} from '@/api/types/invest'

// ===== 企业相关 =====

export function fetchEnterpriseList(params: {
  current?: number
  pageSize?: number
  keyword?: string
  industry?: string
  city?: string
}): Promise<PaginatedData<EnterpriseListItem>> {
  const { current = 1, pageSize = 20 } = params
  const list = getMockEnterpriseList(pageSize)
  return new Promise((resolve) => {
    setTimeout(() => resolve({ list, total: 1286, current, pageSize }), 300)
  })
}

export function fetchEnterpriseDetail(id: string): Promise<EnterpriseDetail | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEnterpriseDetail(id)), 200)
  })
}

// ===== 旧版兼容 API（保留给已有页面使用，后续 Task 重写页面时移除） =====

/** @deprecated 使用新版 API 替代 */
export function fetchTargets(count = 12) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTargets(count)), 200)
  })
}

/** @deprecated 使用 fetchRecommendTargets 替代 */
export function fetchRecommendResults(count = 8) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRecommendResults(count)), 250)
  })
}

/** @deprecated 使用 fetchInvestProjectsDetailed 替代 */
export function fetchInvestProjects(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockInvestProjects(count)), 200)
  })
}

/** @deprecated 使用 fetchRelationGraphData 替代 */
export function fetchRelationGraph() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRelationGraph()), 300)
  })
}

/** @deprecated 使用 fetchDriveCapabilities 替代 */
export function fetchAnchorEnterprises() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockAnchorEnterprises()), 200)
  })
}

/** @deprecated 使用 fetchLeadingEnterprisesDetailed 替代 */
export function fetchLeadingEnterprises() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockLeadingEnterprises()), 200)
  })
}

/** @deprecated 使用 fetchRankingItems 替代 */
export function fetchRankings() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRankings()), 200)
  })
}

/** @deprecated 使用 fetchQualifiedEnterprisesList 替代 */
export function fetchQualifiedEnterprises() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockQualifiedEnterprises()), 200)
  })
}

/** @deprecated 使用 fetchFundItems 替代 */
export function fetchFunds() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockFunds()), 200)
  })
}

/** @deprecated 使用 fetchResearchInstitutionsDetailed 替代 */
export function fetchResearchInstitutions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockResearchInstitutions()), 200)
  })
}

// ===== 8.1 产业链招商 =====

export function fetchChainStructure(): Promise<ChainStructureData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChainStructure()), 200)
  })
}

export function fetchKeyNodes(count = 8): Promise<KeyNodeData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockKeyNodes(count)), 200)
  })
}

export function fetchCompetitiveness(): Promise<CompetitivenessData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockCompetitiveness()), 200)
  })
}

export function fetchRecommendTargets(count = 12): Promise<RecommendTarget[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRecommendTargets(count)), 200)
  })
}

// ===== 8.2 产业地图招商 =====

export function fetchMapResources(count = 6): Promise<MapResourceData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockMapResources(count)), 200)
  })
}

export function fetchSpaceAtlasEdges(count = 10): Promise<SpaceAtlasEdge[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockSpaceAtlasEdges(count)), 200)
  })
}

export function fetchAdvantageLinks(count = 6): Promise<AdvantageLink[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockAdvantageLinks(count)), 200)
  })
}

export function fetchExtensionDirections(count = 5): Promise<ExtensionDirection[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockExtensionDirections(count)), 200)
  })
}

// ===== 8.3 强延补链招商 =====

export function fetchBenchmarkItems(): Promise<BenchmarkItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockBenchmarkItems()), 200)
  })
}

export function fetchGapDiagnosis(count = 8): Promise<GapDiagnosisData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockGapDiagnosis(count)), 200)
  })
}

export function fetchFillTargets(count = 12): Promise<FillTarget[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockFillTargets(count)), 200)
  })
}

// ===== 8.4 关系链招商 =====

export function fetchRelationGraphData(): Promise<RelationGraphData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRelationGraphData()), 300)
  })
}

export function fetchChainOwnerRadiations(count = 6): Promise<ChainOwnerRadiation[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChainOwnerRadiations(count)), 200)
  })
}

export function fetchSecondaryRelations(count = 10): Promise<SecondaryRelation[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockSecondaryRelations(count)), 200)
  })
}

// ===== 8.5 以商招商 =====

export function fetchDriveCapabilities(count = 8): Promise<DriveCapability[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockDriveCapabilities(count)), 200)
  })
}

export function fetchEcoNetworkNodes(count = 12): Promise<EcoNetworkNode[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEcoNetworkNodes(count)), 200)
  })
}

export function fetchIncentivePolicies(count = 8): Promise<IncentivePolicy[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockIncentivePolicies(count)), 200)
  })
}

// ===== 8.6 名企榜单招商 =====

export function fetchRankingItems(count = 8): Promise<RankingItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRankingItems(count)), 200)
  })
}

export function fetchRankingEnterprises(
  rankingId: string,
  count = 20,
): Promise<RankingEnterprise[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRankingEnterprises(rankingId, count)), 200)
  })
}

export function fetchBrandLinkages(count = 6): Promise<BrandLinkage[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockBrandLinkages(count)), 200)
  })
}

// ===== 8.7 龙头骨干招商 =====

export function fetchLeadingEnterprisesDetailed(count = 8): Promise<LeadingEnterprise[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockLeadingEnterprisesDetailed(count)), 200)
  })
}

export function fetchStrategyItems(count = 6): Promise<StrategyItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockStrategyItems(count)), 200)
  })
}

export function fetchEcoSynergyItems(count = 6): Promise<EcoSynergyItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockEcoSynergyItems(count)), 200)
  })
}

// ===== 8.8 资质企业招商 =====

export function fetchQualifiedEnterprisesList(count = 15): Promise<QualifiedEnterprise[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockQualifiedEnterprisesList(count)), 200)
  })
}

export function fetchDemandProfiles(count = 8): Promise<DemandProfile[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockDemandProfiles(count)), 200)
  })
}

export function fetchResourceMatches(count = 10): Promise<ResourceMatch[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockResourceMatches(count)), 200)
  })
}

// ===== 8.9 投行基金招商 =====

export function fetchFundItems(count = 6): Promise<FundItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockFundItems(count)), 200)
  })
}

export function fetchInvestProjectsDetailed(count = 10): Promise<InvestProject[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockInvestProjectsDetailed(count)), 200)
  })
}

export function fetchCapitalMatches(count = 8): Promise<CapitalMatch[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockCapitalMatches(count)), 200)
  })
}

// ===== 8.10 科研机构招商 =====

export function fetchResearchInstitutionsDetailed(count = 8): Promise<ResearchInstitution[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockResearchInstitutionsDetailed(count)), 200)
  })
}

export function fetchTechTransferItems(count = 6): Promise<TechTransferItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTechTransferItems(count)), 200)
  })
}

export function fetchTalentShareItems(count = 8): Promise<TalentShareItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTalentShareItems(count)), 200)
  })
}

// ===== 8.11 链主适配招商 =====

export function fetchChainOwnerProfiles(count = 5): Promise<ChainOwnerProfile[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChainOwnerProfiles(count)), 200)
  })
}

export function fetchOwnerGapDiagnoses(count = 6): Promise<OwnerGapDiagnosis[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockOwnerGapDiagnoses(count)), 200)
  })
}

export function fetchAdaptiveMatches(count = 10): Promise<AdaptiveMatch[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockAdaptiveMatches(count)), 200)
  })
}

// ===== 8.12 园区招商 =====

export function fetchParkResources(count = 6): Promise<ParkResource[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockParkResources(count)), 200)
  })
}

export function fetchParkSmartMatches(count = 10): Promise<ParkSmartMatch[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockParkSmartMatches(count)), 200)
  })
}

export function fetchParkChainSynergies(count = 6): Promise<ParkChainSynergy[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockParkChainSynergies(count)), 200)
  })
}
