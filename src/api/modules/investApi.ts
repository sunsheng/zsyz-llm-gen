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
} from '@/api/mock/invest'
import { getMockEnterpriseList, getMockEnterpriseDetail } from '@/api/mock/enterprises'
import type { PaginatedData } from '@/api/types/common'
import type { EnterpriseListItem, EnterpriseDetail } from '@/api/types/enterprise'

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

export function fetchTargets(count = 12) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTargets(count)), 200)
  })
}

export function fetchRecommendResults(count = 8) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRecommendResults(count)), 250)
  })
}

export function fetchInvestProjects(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockInvestProjects(count)), 200)
  })
}

export function fetchRelationGraph() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRelationGraph()), 300)
  })
}

export function fetchAnchorEnterprises() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockAnchorEnterprises()), 200)
  })
}

export function fetchLeadingEnterprises() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockLeadingEnterprises()), 200)
  })
}

export function fetchRankings() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockRankings()), 200)
  })
}

export function fetchQualifiedEnterprises() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockQualifiedEnterprises()), 200)
  })
}

export function fetchFunds() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockFunds()), 200)
  })
}

export function fetchResearchInstitutions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockResearchInstitutions()), 200)
  })
}
