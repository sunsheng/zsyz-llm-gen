// 地图相关 API
import { getMockMarkers, getMockGeoFeatures } from '@/api/mock/map'
import type { MapMarker } from '@/api/types/map'

export function fetchMapMarkers(count = 50): Promise<MapMarker[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockMarkers(count)), 200)
  })
}

export function fetchGeoFeatures(region: string): Promise<unknown> {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockGeoFeatures(region)), 200)
  })
}
