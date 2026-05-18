// 地图相关 API
import {
  getMockMarkers,
  getMockGeoFeatures,
  getMockClusterDistribution,
  getMockScaleEnterprises,
  getMockSupportResources,
  getMockMapConfig,
  getMockMapOperation,
} from '@/api/mock/map'
import type {
  MapMarker,
  ClusterData,
  ScaleEnterprise,
  SupportResource,
  MapConfigData,
  MapOperationData,
} from '@/api/types/map'

export function fetchMapMarkers(count = 50): Promise<MapMarker[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockMarkers(count)), 200)
  })
}

export function fetchGeoFeatures(region: string): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockGeoFeatures(region)), 200)
  })
}

export function fetchClusterDistribution(): Promise<ClusterData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockClusterDistribution()), 200)
  })
}

export function fetchScaleEnterprises(): Promise<ScaleEnterprise[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockScaleEnterprises()), 200)
  })
}

export function fetchSupportResources(): Promise<SupportResource[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockSupportResources()), 200)
  })
}

export function fetchMapConfig(): Promise<MapConfigData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockMapConfig()), 200)
  })
}

export function fetchMapOperation(): Promise<MapOperationData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockMapOperation()), 200)
  })
}
