// 地图 Mock 数据工厂
import type {
  MapMarker,
  GeoFeature,
  MapLayer,
  ClusterData,
  ScaleEnterprise,
  SupportResource,
  MapConfigData,
  MapOperationData,
} from '@/api/types/map'

const industries = [
  '高端装备制造',
  '新材料',
  '生物医药',
  '电子信息',
  '新能源',
  '节能环保',
  '数字创意',
  '现代服务业',
]
const enterpriseNames = [
  '华创新材料科技',
  '东方精密制造',
  '博远生物医药',
  '天域半导体',
  '绿能新能源',
  '中科智联信息',
  '鼎盛环保科技',
  '创想数字技术',
  '恒达装备制造',
  '瑞丰新材料',
  '恒宇光电科技',
  '昌盛药业集团',
  '芯源集成电路',
  '亿能动力电池',
  '安泰环保设备',
  '智汇信息技术',
  '云帆数据科技',
  '铭远精密仪器',
  '盛达新材料',
  '宏图半导体',
]

const spaceNames = [
  '凯州新城核心区',
  '辑庆片区',
  '兴隆片区',
  '成巴东片区',
  '凯州科技创新产业园',
  '凯州新城高端装备产业园',
]
const industryCategories = [
  '通用设备制造',
  '专用设备制造',
  '电气机械制造',
  '化学原料制造',
  '电子元件制造',
  '医药制造',
  '软件和信息技术',
  '商务服务',
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
      name:
        enterpriseNames[i % enterpriseNames.length] +
        (i >= enterpriseNames.length ? `(${Math.floor(i / enterpriseNames.length) + 1})` : ''),
      longitude,
      latitude,
      type: (['enterprise', 'park', 'institution'] as const)[i % 3],
      category: industries[i % industries.length],
      value: Math.floor(Math.random() * 50000 + 1000),
      extra: {
        revenue: Math.floor(Math.random() * 100000 + 5000),
        employees: Math.floor(Math.random() * 5000 + 50),
        established: `${2010 + Math.floor(Math.random() * 14)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}`,
        industryCategory: industryCategories[i % industryCategories.length],
        space: spaceNames[i % spaceNames.length],
        top100: Math.random() < 0.1,
      },
    }
  })
}

export function getMockGeoFeatures(region: string): GeoFeature[] {
  const regions: Record<string, { name: string; code: string; center: [number, number] }[]> = {
    kaizhou: [
      { name: '凯州新城核心区', code: '510623001', center: [104.612, 30.884] },
      { name: '辑庆片区', code: '510623002', center: [104.623, 30.92] },
      { name: '兴隆片区', code: '510623003', center: [104.612, 30.884] },
      { name: '成巴东片区', code: '510623004', center: [104.65, 30.86] },
      { name: '中江县', code: '510623100', center: [104.803, 30.885] },
      { name: '德阳市', code: '510600', center: [104.398, 31.127] },
      { name: '成都市', code: '510100', center: [104.066, 30.572] },
      { name: '广汉市', code: '510681', center: [104.282, 30.977] },
      { name: '什邡市', code: '510682', center: [104.168, 31.127] },
      { name: '绵竹市', code: '510683', center: [104.221, 31.338] },
      { name: '罗江区', code: '510626', center: [104.51, 31.318] },
    ],
  }

  const list = regions[region] || regions.kaizhou
  return list.map((r) => ({
    type: 'Feature' as const,
    properties: {
      name: r.name,
      code: r.code,
      level: 'city' as const,
      center: r.center,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [],
    },
  }))
}

export function getMockLayers(): MapLayer[] {
  return [
    { id: 'enterprise', name: '企业分布', type: 'marker', visible: true },
    { id: 'space', name: '产业空间', type: 'marker', visible: true },
    { id: 'scaleEnterprise', name: '规上企业', type: 'marker', visible: false },
    { id: 'heatmap', name: '产业集群热力图', type: 'heatmap', visible: false },
    { id: 'boundary', name: '行政边界', type: 'boundary', visible: true },
  ]
}

export function getMockClusterData(): { name: string; count: number; lng: number; lat: number }[] {
  return industries.map((name) => {
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

// ---------- 产业集群分布 ----------

export function getMockClusterDistribution(): ClusterData[] {
  return [
    {
      id: 'c1',
      name: '凯州新城高端装备制造集群',
      industry: '高端装备制造',
      count: 186,
      lng: 104.612,
      lat: 30.884,
      enterprises: 112,
      parks: 18,
      institutions: 56,
      region: '凯州新城核心区',
    },
    {
      id: 'c2',
      name: '辑庆新材料产业集群',
      industry: '新材料',
      count: 142,
      lng: 104.623,
      lat: 30.92,
      enterprises: 89,
      parks: 24,
      institutions: 29,
      region: '辑庆片区',
    },
    {
      id: 'c3',
      name: '兴隆电子信息产业集群',
      industry: '电子信息',
      count: 128,
      lng: 104.595,
      lat: 30.871,
      enterprises: 78,
      parks: 20,
      institutions: 30,
      region: '兴隆片区',
    },
    {
      id: 'c4',
      name: '成巴东生物医药产业集群',
      industry: '生物医药',
      count: 96,
      lng: 104.65,
      lat: 30.86,
      enterprises: 62,
      parks: 14,
      institutions: 20,
      region: '成巴东片区',
    },
    {
      id: 'c5',
      name: '凯州新城新能源产业集群',
      industry: '新能源',
      count: 78,
      lng: 104.608,
      lat: 30.892,
      enterprises: 48,
      parks: 12,
      institutions: 18,
      region: '凯州新城核心区',
    },
    {
      id: 'c6',
      name: '辑庆节能环保产业集群',
      industry: '节能环保',
      count: 56,
      lng: 104.631,
      lat: 30.903,
      enterprises: 34,
      parks: 8,
      institutions: 14,
      region: '辑庆片区',
    },
    {
      id: 'c7',
      name: '中江数字创意产业集群',
      industry: '数字创意',
      count: 45,
      lng: 104.803,
      lat: 30.885,
      enterprises: 30,
      parks: 6,
      institutions: 9,
      region: '中江县',
    },
    {
      id: 'c8',
      name: '德阳现代服务业集群',
      industry: '现代服务业',
      count: 68,
      lng: 104.398,
      lat: 31.127,
      enterprises: 42,
      parks: 10,
      institutions: 16,
      region: '德阳市',
    },
    {
      id: 'c9',
      name: '兴隆高端装备配套集群',
      industry: '高端装备制造',
      count: 52,
      lng: 104.588,
      lat: 30.862,
      enterprises: 32,
      parks: 8,
      institutions: 12,
      region: '兴隆片区',
    },
    {
      id: 'c10',
      name: '成巴东新材料延伸集群',
      industry: '新材料',
      count: 38,
      lng: 104.658,
      lat: 30.855,
      enterprises: 24,
      parks: 6,
      institutions: 8,
      region: '成巴东片区',
    },
    {
      id: 'c11',
      name: '凯州新城电子信息配套集群',
      industry: '电子信息',
      count: 64,
      lng: 104.618,
      lat: 30.878,
      enterprises: 40,
      parks: 10,
      institutions: 14,
      region: '凯州新城核心区',
    },
    {
      id: 'c12',
      name: '德阳高端装备制造集群',
      industry: '高端装备制造',
      count: 210,
      lng: 104.405,
      lat: 31.118,
      enterprises: 135,
      parks: 28,
      institutions: 47,
      region: '德阳市',
    },
  ]
}

// ---------- 规上企业分布 ----------

const regionCenters: Record<string, [number, number]> = {
  辑庆片区: [104.623, 30.92],
  兴隆片区: [104.595, 30.871],
  成巴东片区: [104.65, 30.86],
  凯州新城核心区: [104.612, 30.884],
  中江县: [104.803, 30.885],
  德阳市: [104.398, 31.127],
}

const scaleEntNames = [
  '东方电机',
  '国机重装',
  '宏华石油',
  '华庆机械',
  '长虹佳华',
  '天域半导体',
  '芯源集成',
  '博远生物',
  '昌盛药业',
  '绿能科技',
  '华创新材',
  '瑞丰新材',
  '中科智联',
  '鼎盛环保',
  '创想数字',
  '恒达装备',
  '铭远精密',
  '亿能动力',
  '安泰环保',
  '智汇信息',
  '云帆数据',
  '盛达新材',
  '恒宇光电',
  '宏图半导体',
  '金辉科技',
]

export function getMockScaleEnterprises(): ScaleEnterprise[] {
  const regions = ['辑庆片区', '兴隆片区', '成巴东片区', '凯州新城核心区', '中江县', '德阳市']
  const entIndustries = [
    '高端装备制造',
    '新材料',
    '电子信息',
    '生物医药',
    '新能源',
    '节能环保',
    '数字创意',
  ]
  const addressPool = [
    '凯州新城智能制造产业园A栋',
    '辑庆镇工业集中区3号路',
    '兴隆镇科技创新园B区',
    '成巴东产业新城5号楼',
    '中江县工业发展区8号',
    '德阳经济技术开发区2号路',
  ]
  const businessPool = [
    '主要从事高端装备研发与制造，年产能超5000台套',
    '专注于新材料研发生产，产品覆盖西南地区',
    '电子信息产品制造，拥有自主知识产权30余项',
    '生物医药研发与生产，通过GMP认证',
    '新能源装备制造，年产值持续增长',
    '节能环保设备研发，服务于成渝地区',
    '数字创意产业服务，拥有专业团队200余人',
  ]

  const enterprises: ScaleEnterprise[] = []
  let idx = 0
  regions.forEach((region, ri) => {
    const count = 5 + ((ri * 3) % 6)
    const center = regionCenters[region]
    for (let i = 0; i < count; i++) {
      const industry = entIndustries[(ri + i) % entIndustries.length]
      enterprises.push({
        id: `ent-${ri}-${i}`,
        name: `${scaleEntNames[idx % scaleEntNames.length]}${region === '德阳市' ? '(德阳)' : '(凯州)'}`,
        region,
        industry,
        lng: +(center[0] + ((idx * 7 + i * 3) % 100) / 1000 - 0.03).toFixed(4),
        lat: +(center[1] + ((idx * 5 + i * 2) % 80) / 1000 - 0.02).toFixed(4),
        output: 5000 + ((idx * 13 + i * 37) % 80000),
        growth: +((((idx * 7 + i * 3) % 250) - 50) / 10).toFixed(1),
        website: `www.ent${ri}${i}.example.com`,
        contact: `0838-7${ri}8${i}8${i}8`,
        address: addressPool[ri] + `${i + 1}号`,
        image: `https://via.placeholder.com/400x200?text=${encodeURIComponent(industry)}`,
        businessInfo: businessPool[(ri + i) % businessPool.length],
      })
      idx++
    }
  })
  return enterprises
}

// ---------- 配套资源分布 ----------

const resourceNames: Record<string, string[]> = {
  education: [
    '凯州新城第一小学',
    '辑庆镇中心校',
    '兴隆镇中学',
    '中江职业技术学校',
    '凯州新城幼儿园',
    '成巴东小学',
  ],
  medical: [
    '凯州新城社区卫生中心',
    '辑庆镇卫生院',
    '中江县人民医院',
    '兴隆镇卫生室',
    '德阳市第五医院',
    '成巴东卫生站',
  ],
  bank: [
    '工商银行凯州新城支行',
    '农业银行辑庆分理处',
    '建设银行中江支行',
    '农商行兴隆支行',
    '中国银行德阳分行',
    '邮储银行成巴东支行',
  ],
  government: [
    '凯州新城管委会',
    '辑庆镇政府',
    '中江县政府',
    '兴隆镇便民中心',
    '德阳市政务中心',
    '成巴东社区服务站',
  ],
  transport: [
    '凯州新城公交站',
    '辑庆客运站',
    '中江高铁站',
    '兴隆公交枢纽',
    '德阳火车站',
    '成巴东巴士站',
  ],
  hotel: ['凯州大酒店', '辑庆商务宾馆', '中江假日酒店', '兴隆美食街', '德阳宾馆', '成巴东美食广场'],
}

export function getMockSupportResources(): SupportResource[] {
  const regions = ['辑庆片区', '兴隆片区', '成巴东片区', '凯州新城核心区', '中江县', '德阳市']
  const types: Array<'education' | 'medical' | 'bank' | 'government' | 'transport' | 'hotel'> = [
    'education',
    'medical',
    'bank',
    'government',
    'transport',
    'hotel',
  ]
  const resources: SupportResource[] = []
  regions.forEach((region, ri) => {
    types.forEach((type, ti) => {
      const count = 2 + ((ri + ti) % 3)
      const center = regionCenters[region]
      const names = resourceNames[type]
      for (let i = 0; i < count; i++) {
        resources.push({
          id: `res-${ri}-${ti}-${i}`,
          name: names[(ri + i) % names.length],
          type,
          region,
          lng: +(center[0] + ((ri * 7 + ti * 3 + i * 5) % 60) / 1000 - 0.03).toFixed(4),
          lat: +(center[1] + ((ri * 5 + ti * 2 + i * 4) % 40) / 1000 - 0.02).toFixed(4),
        })
      }
    })
  })
  return resources
}

// ---------- 地图配置 ----------

export function getMockMapConfig(): MapConfigData {
  return {
    basemap: {
      type: 'amap',
      apiKey: 'c8a3d5e7f9b1a2c4d6e8f0a1b2c3d4e5',
      centerLng: '104.612',
      centerLat: '30.88',
      defaultZoom: 14,
    },
    poiList: [
      {
        id: '1',
        name: '凯州科技创新产业园',
        type: '园区',
        lng: '104.612',
        lat: '30.884',
        category: '产业空间',
      },
      {
        id: '2',
        name: '凯州新城高端装备产业园',
        type: '园区',
        lng: '104.623',
        lat: '30.892',
        category: '产业空间',
      },
      {
        id: '3',
        name: '东方电机有限公司',
        type: '企业',
        lng: '104.398',
        lat: '31.127',
        category: '规上企业',
      },
      {
        id: '4',
        name: '中国二重集团',
        type: '企业',
        lng: '104.405',
        lat: '31.118',
        category: '规上企业',
      },
      {
        id: '5',
        name: '中江县人民医院',
        type: '配套',
        lng: '104.803',
        lat: '30.885',
        category: '配套资源',
      },
    ],
    layerList: [
      {
        id: '1',
        name: '企业分布图层',
        type: '矢量',
        dataSource: '工商数据',
        visible: true,
        updateTime: '2025-01-15',
      },
      {
        id: '2',
        name: '产业集群热力图',
        type: '热力',
        dataSource: '行业数据',
        visible: true,
        updateTime: '2025-01-14',
      },
      {
        id: '3',
        name: '产业空间图层',
        type: '矢量',
        dataSource: '园区数据',
        visible: true,
        updateTime: '2025-01-13',
      },
      {
        id: '4',
        name: '规上企业图层',
        type: '矢量',
        dataSource: '规上数据',
        visible: false,
        updateTime: '2025-01-12',
      },
      {
        id: '5',
        name: '行政边界图层',
        type: '栅格',
        dataSource: '自然资源局',
        visible: true,
        updateTime: '2025-01-10',
      },
    ],
  }
}

// ---------- 地图操作 ----------

export function getMockMapOperation(): MapOperationData {
  const enterpriseMarkers: { lng: number; lat: number }[] = []
  for (let i = 0; i < 20; i++) {
    enterpriseMarkers.push({
      lng: +(104.45 + ((i * 17 + 3) % 50) / 100).toFixed(4),
      lat: +(30.82 + ((i * 11 + 7) % 20) / 100).toFixed(4),
    })
  }

  const parkMarkers: { lng: number; lat: number }[] = []
  for (let i = 0; i < 8; i++) {
    parkMarkers.push({
      lng: +(104.48 + ((i * 19 + 5) % 30) / 100).toFixed(4),
      lat: +(30.85 + ((i * 13 + 3) % 15) / 100).toFixed(4),
    })
  }

  return {
    searchResults: [
      {
        id: 's1',
        name: '凯州新城管委会',
        address: '中江县辑庆镇凯州新城',
        lng: 104.612,
        lat: 30.884,
      },
      { id: 's2', name: '凯州科技创新产业园', address: '中江县辑庆镇', lng: 104.623, lat: 30.892 },
      {
        id: 's3',
        name: '凯州新城高端装备产业园',
        address: '中江县兴隆镇',
        lng: 104.605,
        lat: 30.871,
      },
      { id: 's4', name: '辑庆工业园', address: '中江县辑庆镇', lng: 104.631, lat: 30.903 },
      { id: 's5', name: '兴隆工业园', address: '中江县兴隆镇', lng: 104.598, lat: 30.862 },
    ],
    enterpriseMarkers,
    parkMarkers,
    boundaryLabels: [
      { name: '凯州新城核心区', lng: 104.612, lat: 30.884 },
      { name: '辑庆片区', lng: 104.623, lat: 30.92 },
      { name: '兴隆片区', lng: 104.595, lat: 30.871 },
      { name: '成巴东片区', lng: 104.65, lat: 30.86 },
      { name: '中江县', lng: 104.803, lat: 30.885 },
      { name: '德阳市', lng: 104.398, lat: 31.127 },
    ],
  }
}
