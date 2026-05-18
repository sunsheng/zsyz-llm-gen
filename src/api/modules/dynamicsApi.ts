// 产业动态 API
import {
  getMockNewsList,
  getMockPolicySummaries,
  getMockHotspotEvents,
  getMockPolicyList,
  getMockPolicyMonitorList,
  getMockNewsCollection,
  getMockPolicyCompilation,
} from '@/api/mock/dynamics'

export function fetchNewsList(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockNewsList(count)), 200)
  })
}

export function fetchPolicySummaries() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockPolicySummaries()), 200)
  })
}

export function fetchHotspotEvents() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockHotspotEvents()), 200)
  })
}

export function fetchPolicyList(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockPolicyList(count)), 200)
  })
}

export function fetchPolicyMonitorList() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockPolicyMonitorList()), 200)
  })
}

export function fetchNewsCollection(): Promise<import('@/api/types/dynamics').NewsCollectionData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockNewsCollection()), 200)
  })
}

export function fetchPolicyCompilation(): Promise<
  import('@/api/types/dynamics').PolicyCompilationData
> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockPolicyCompilation()), 200)
  })
}
