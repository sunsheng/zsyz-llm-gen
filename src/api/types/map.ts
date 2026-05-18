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

/** 产业集群分布 */
export interface ClusterData {
  id: string
  name: string
  industry: string
  count: number
  lng: number
  lat: number
  enterprises: number
  parks: number
  institutions: number
  region: string
}

/** 规上企业分布 */
export interface ScaleEnterprise {
  id: string
  name: string
  region: string
  industry: string
  lng: number
  lat: number
  output: number
  growth: number
  website: string
  contact: string
  address: string
  image: string
  businessInfo: string
}

/** 配套资源 */
export type ResourceType = 'education' | 'medical' | 'bank' | 'government' | 'transport' | 'hotel'

export interface SupportResource {
  id: string
  name: string
  type: ResourceType
  region: string
  lng: number
  lat: number
}

/** 地图配置 - POI */
export interface MapPOI {
  id: string
  name: string
  type: string
  lng: string
  lat: string
  category: string
}

/** 地图配置 - 图层 */
export interface MapConfigLayer {
  id: string
  name: string
  type: string
  dataSource: string
  visible: boolean
  updateTime: string
}

/** 地图配置数据 */
export interface MapConfigData {
  basemap: {
    type: string
    apiKey: string
    centerLng: string
    centerLat: string
    defaultZoom: number
  }
  poiList: MapPOI[]
  layerList: MapConfigLayer[]
}

/** 地图操作 - 搜索结果 */
export interface MapSearchResult {
  id: string
  name: string
  address: string
  lng: number
  lat: number
}

/** 地图操作数据 */
export interface MapOperationData {
  searchResults: MapSearchResult[]
  enterpriseMarkers: { lng: number; lat: number }[]
  parkMarkers: { lng: number; lat: number }[]
  boundaryLabels: { name: string; lng: number; lat: number }[]
}
