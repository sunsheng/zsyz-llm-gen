// 地图 Mock 数据工厂
import type { MapMarker, GeoFeature, MapLayer } from '@/api/types/map'

const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源', '节能环保', '数字创意', '现代服务业']
const enterpriseNames = [
  '华创新材料科技', '东方精密制造', '博远生物医药', '天域半导体', '绿能新能源',
  '中科智联信息', '鼎盛环保科技', '创想数字技术', '恒达装备制造', '瑞丰新材料',
  '恒宇光电科技', '昌盛药业集团', '芯源集成电路', '亿能动力电池', '安泰环保设备',
  '智汇信息技术', '云帆数据科技', '铭远精密仪器', '盛达新材料', '宏图半导体'
]

function randomCoords(): [number, number] {
  // 浙江省范围附近
  return [118 + Math.random() * 4, 28 + Math.random() * 4]
}

export function getMockMarkers(count = 50): MapMarker[] {
  return Array.from({ length: count }, (_, i) => {
    const [longitude, latitude] = randomCoords()
    return {
      id: `marker-${i + 1}`,
      name: enterpriseNames[i % enterpriseNames.length] + (i >= enterpriseNames.length ? `(${Math.floor(i / enterpriseNames.length) + 1})` : ''),
      longitude,
      latitude,
      type: (['enterprise', 'park', 'institution'] as const)[i % 3],
      category: industries[i % industries.length],
      value: Math.floor(Math.random() * 50000 + 1000),
      extra: {
        revenue: Math.floor(Math.random() * 100000 + 5000),
        employees: Math.floor(Math.random() * 5000 + 50),
        established: `${2010 + Math.floor(Math.random() * 14)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}`
      }
    }
  })
}

export function getMockGeoFeatures(region: string): GeoFeature[] {
  const regions: Record<string, { name: string; code: string; center: [number, number] }[]> = {
    zhejiang: [
      { name: '杭州市', code: '330100', center: [120.15, 30.28] },
      { name: '宁波市', code: '330200', center: [121.55, 29.87] },
      { name: '温州市', code: '330300', center: [120.70, 28.00] },
      { name: '嘉兴市', code: '330400', center: [120.76, 30.77] },
      { name: '湖州市', code: '330500', center: [120.09, 30.87] },
      { name: '绍兴市', code: '330600', center: [120.58, 30.00] },
      { name: '金华市', code: '330700', center: [119.65, 29.08] },
      { name: '衢州市', code: '330800', center: [118.87, 28.94] },
      { name: '舟山市', code: '330900', center: [122.11, 30.01] },
      { name: '台州市', code: '331000', center: [121.42, 28.66] },
      { name: '丽水市', code: '331100', center: [119.92, 28.45] }
    ]
  }

  const list = regions[region] || regions.zhejiang
  return list.map(r => ({
    type: 'Feature' as const,
    properties: {
      name: r.name,
      code: r.code,
      level: 'city' as const,
      center: r.center
    },
    geometry: {
      type: 'Polygon',
      coordinates: []
    }
  }))
}

export function getMockLayers(): MapLayer[] {
  return [
    { id: 'enterprise', name: '企业分布', type: 'marker', visible: true },
    { id: 'park', name: '园区分布', type: 'marker', visible: true },
    { id: 'heatmap', name: '热力图', type: 'heatmap', visible: false },
    { id: 'boundary', name: '行政边界', type: 'boundary', visible: true },
    { id: 'cluster', name: '聚合标记', type: 'cluster', visible: false }
  ]
}

export function getMockClusterData(): { name: string; count: number; lng: number; lat: number }[] {
  return industries.map((name, i) => {
    const [lng, lat] = randomCoords()
    return { name, count: Math.floor(Math.random() * 200 + 20), lng, lat }
  })
}

export function getMockHeatmapData(): { lng: number; lat: number; value: number }[] {
  return Array.from({ length: 100 }, () => {
    const [lng, lat] = randomCoords()
    return { lng, lat, value: Math.random() * 100 }
  })
}
