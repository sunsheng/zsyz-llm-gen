/** 地图数据类型 */

export interface MapMarker {
  id: string
  name: string
  longitude: number
  latitude: number
  type: 'enterprise' | 'park' | 'institution'
  category: string
  value?: number
  extra?: Record<string, unknown>
}

export interface GeoFeature {
  type: 'Feature'
  properties: {
    name: string
    code: string
    level: 'province' | 'city' | 'district'
    center: [number, number]
  }
  geometry: Record<string, unknown>
}

export interface MapLayer {
  id: string
  name: string
  type: 'marker' | 'heatmap' | 'boundary' | 'cluster'
  visible: boolean
  data?: unknown
  color?: string
}
