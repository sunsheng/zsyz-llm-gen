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
  // 凯州新城智能制造产业园范围附近（兴隆镇周边）
  return [104.55 + Math.random() * 0.12, 30.85 + Math.random() * 0.08]
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
    kaizhou: [
      { name: '凯州新城核心区', code: '510623001', center: [104.612, 30.884] },
      { name: '辑庆片区', code: '510623002', center: [104.623, 30.920] },
      { name: '兴隆片区', code: '510623003', center: [104.612, 30.884] },
      { name: '成巴东片区', code: '510623004', center: [104.650, 30.860] },
      { name: '中江县', code: '510623100', center: [104.803, 30.885] },
      { name: '德阳市', code: '510600', center: [104.398, 31.127] },
      { name: '成都市', code: '510100', center: [104.066, 30.572] },
      { name: '广汉市', code: '510681', center: [104.282, 30.977] },
      { name: '什邡市', code: '510682', center: [104.168, 31.127] },
      { name: '绵竹市', code: '510683', center: [104.221, 31.338] },
      { name: '罗江区', code: '510626', center: [104.510, 31.318] }
    ]
  }

  const list = regions[region] || regions.kaizhou
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
