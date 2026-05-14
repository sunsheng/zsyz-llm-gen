export interface MenuItem {
  title: string
  icon?: string
  path: string
  children?: MenuItem[]
}

export const menuConfig: MenuItem[] = [
  {
    title: '产业地图',
    icon: 'Location',
    path: '/map',
    children: [
      {
        title: '产业链地图',
        path: '/map/chain',
        children: [
          { title: '产业资源搜索', path: '/map/chain/search' },
          { title: '产业资源筛选', path: '/map/chain/filter' },
          { title: '产业图层切换', path: '/map/chain/layers' },
          { title: '产业空间分布', path: '/map/chain/space' },
          { title: '产业集群分布', path: '/map/chain/clusters' },
        ],
      },
      {
        title: '供应链地图',
        path: '/map/supply',
        children: [
          { title: '规上企业分布', path: '/map/supply/enterprise' },
          { title: '配套资源分布', path: '/map/supply/resources' },
        ],
      },
      {
        title: '技术链地图',
        path: '/map/tech',
        children: [
          { title: '产业地图操作', path: '/map/tech/operate' },
          { title: '产业地图配置', path: '/map/tech/config' },
        ],
      },
    ],
  },
  {
    title: '产业图谱',
    icon: 'Share',
    path: '/atlas',
    children: [
      {
        title: '全国图谱',
        path: '/atlas/national',
        children: [
          { title: '全国图谱总览', path: '/atlas/national/overview' },
          { title: '产业链图谱', path: '/atlas/national/chain' },
          { title: '企业关系图谱', path: '/atlas/national/relation' },
          { title: '技术图谱', path: '/atlas/national/tech' },
        ],
      },
      {
        title: '区域图谱',
        path: '/atlas/regional',
        children: [
          { title: '区域图谱总览', path: '/atlas/regional/overview' },
          { title: '区域产业链图谱', path: '/atlas/regional/chain' },
          { title: '区域关系图谱', path: '/atlas/regional/relation' },
          { title: '区域对比图谱', path: '/atlas/regional/compare' },
        ],
      },
    ],
  },
  {
    title: '运行分析',
    icon: 'TrendCharts',
    path: '/analysis',
    children: [
      {
        title: '产业总览',
        path: '/analysis/overview',
        children: [
          { title: '产业总览', path: '/analysis/overview/summary' },
          { title: '发展趋势', path: '/analysis/overview/trend' },
          { title: '产业结构', path: '/analysis/overview/structure' },
          { title: '贡献分析', path: '/analysis/overview/contribution' },
        ],
      },
      {
        title: '企业布局',
        path: '/analysis/layout',
        children: [
          { title: '区域布局', path: '/analysis/layout/region' },
          { title: '行业布局', path: '/analysis/layout/industry' },
        ],
      },
      {
        title: '整体评价',
        path: '/analysis/evaluation',
        children: [
          { title: '综合评价', path: '/analysis/evaluation/comprehensive' },
          { title: '竞争力评价', path: '/analysis/evaluation/competitiveness' },
          { title: '创新力评价', path: '/analysis/evaluation/innovation' },
          { title: '效率评价', path: '/analysis/evaluation/efficiency' },
          { title: '潜力评价', path: '/analysis/evaluation/potential' },
        ],
      },
      {
        title: '载体分析',
        path: '/analysis/carrier',
        children: [
          { title: '园区分析', path: '/analysis/carrier/park' },
          { title: '平台分析', path: '/analysis/carrier/platform' },
          { title: '孵化器分析', path: '/analysis/carrier/incubator' },
        ],
      },
      {
        title: '强弱分析',
        path: '/analysis/strength',
        children: [
          { title: '强弱快照', path: '/analysis/strength/snapshot' },
          { title: '强弱详情', path: '/analysis/strength/detail' },
        ],
      },
      {
        title: '运行报告',
        path: '/analysis/report',
        children: [
          { title: '月度报告', path: '/analysis/report/monthly' },
          { title: '季度报告', path: '/analysis/report/quarterly' },
          { title: '年度报告', path: '/analysis/report/annual' },
        ],
      },
      {
        title: '对比报告',
        path: '/analysis/comparison',
        children: [
          { title: '区域对比', path: '/analysis/comparison/region' },
          { title: '行业对比', path: '/analysis/comparison/industry' },
          { title: '时期对比', path: '/analysis/comparison/period' },
        ],
      },
      {
        title: '企业报告',
        path: '/analysis/ent-report',
        children: [
          { title: '企业汇总', path: '/analysis/ent-report/summary' },
          { title: '企业详情报告', path: '/analysis/ent-report/detail' },
          { title: '报告导出', path: '/analysis/ent-report/export' },
        ],
      },
    ],
  },
  {
    title: '产业动态',
    icon: 'Notification',
    path: '/dynamics',
    children: [
      { title: '行业动态', path: '/dynamics/news' },
      { title: '政策速递', path: '/dynamics/policy' },
      { title: '产业事件', path: '/dynamics/event' },
      { title: '行业洞察', path: '/dynamics/insight' },
    ],
  },
  {
    title: '区域对标',
    icon: 'Aim',
    path: '/benchmarking',
    children: [
      { title: '对标总览', path: '/benchmarking/overview' },
      { title: '经济对标', path: '/benchmarking/economy' },
      { title: '产业对标', path: '/benchmarking/industry' },
      { title: '创新对标', path: '/benchmarking/innovation' },
      { title: '招商对标', path: '/benchmarking/investment' },
      { title: '区域排名', path: '/benchmarking/ranking' },
      { title: 'SWOT分析', path: '/benchmarking/swot' },
      { title: '对标报告', path: '/benchmarking/report' },
    ],
  },
  {
    title: '风险预警',
    icon: 'Warning',
    path: '/warning',
    children: [
      { title: '预警总览', path: '/warning/overview' },
      { title: '企业风险', path: '/warning/enterprise' },
      { title: '产业风险', path: '/warning/industry' },
      { title: '政策风险', path: '/warning/policy' },
      { title: '供应链风险', path: '/warning/supply' },
      { title: '风险报警', path: '/warning/alert' },
    ],
  },
  {
    title: '区域地图',
    icon: 'MapLocation',
    path: '/regional-map',
    children: [
      { title: '区域总览', path: '/regional-map/overview' },
      { title: '区域对比', path: '/regional-map/compare' },
      { title: '区域详情', path: '/regional-map/detail' },
    ],
  },
  {
    title: '精准招商',
    icon: 'Opportunity',
    path: '/invest',
    children: [
      {
        title: '产业链招商',
        path: '/invest/chain',
        children: [
          { title: '目标筛选', path: '/invest/chain/target' },
          { title: '链式匹配', path: '/invest/chain/match' },
          { title: '智能推荐', path: '/invest/chain/recommend' },
          { title: '推荐结果', path: '/invest/chain/result' },
        ],
      },
      {
        title: '地图招商',
        path: '/invest/map',
        children: [
          { title: '地图选商', path: '/invest/map/target' },
          { title: '周边搜索', path: '/invest/map/nearby' },
          { title: '资源匹配', path: '/invest/map/resource' },
          { title: '招商结果', path: '/invest/map/result' },
        ],
      },
      {
        title: '补链招商',
        path: '/invest/extension',
        children: [
          { title: '缺链分析', path: '/invest/extension/analysis' },
          { title: '补链目标', path: '/invest/extension/target' },
          { title: '补链结果', path: '/invest/extension/result' },
        ],
      },
      {
        title: '关系链招商',
        path: '/invest/relation',
        children: [
          { title: '关系图谱', path: '/invest/relation/graph' },
          { title: '关系目标', path: '/invest/relation/target' },
          { title: '关系招商结果', path: '/invest/relation/result' },
        ],
      },
      {
        title: '以商招商',
        path: '/invest/merchant',
        children: [
          { title: '锚点企业', path: '/invest/merchant/anchor' },
          { title: '衍生搜索', path: '/invest/merchant/derive' },
          { title: '以商招商结果', path: '/invest/merchant/result' },
        ],
      },
      {
        title: '榜单招商',
        path: '/invest/listed',
        children: [
          { title: '榜单列表', path: '/invest/listed/ranking' },
          { title: '榜单详情', path: '/invest/listed/detail' },
          { title: '榜单目标', path: '/invest/listed/target' },
          { title: '榜单招商结果', path: '/invest/listed/result' },
        ],
      },
      {
        title: '龙头骨干',
        path: '/invest/leading',
        children: [
          { title: '龙头总览', path: '/invest/leading/overview' },
          { title: '龙头详情', path: '/invest/leading/detail' },
          { title: '龙头目标', path: '/invest/leading/target' },
        ],
      },
      {
        title: '资质企业',
        path: '/invest/qualified',
        children: [
          { title: '资质列表', path: '/invest/qualified/list' },
          { title: '资质详情', path: '/invest/qualified/detail' },
          { title: '资质企业目标', path: '/invest/qualified/target' },
        ],
      },
      {
        title: '投行基金',
        path: '/invest/fund',
        children: [
          { title: '基金总览', path: '/invest/fund/overview' },
          { title: '基金详情', path: '/invest/fund/detail' },
          { title: '基金招商目标', path: '/invest/fund/target' },
        ],
      },
      {
        title: '科研机构',
        path: '/invest/research',
        children: [
          { title: '机构总览', path: '/invest/research/overview' },
          { title: '机构详情', path: '/invest/research/detail' },
          { title: '科研招商目标', path: '/invest/research/target' },
        ],
      },
      {
        title: '链主适配',
        path: '/invest/owner',
        children: [
          { title: '链主匹配', path: '/invest/owner/match' },
          { title: '链主详情', path: '/invest/owner/detail' },
          { title: '链主适配结果', path: '/invest/owner/result' },
        ],
      },
      {
        title: '园区招商',
        path: '/invest/park',
        children: [
          { title: '园区总览', path: '/invest/park/overview' },
          { title: '园区详情', path: '/invest/park/detail' },
          { title: '园区招商目标', path: '/invest/park/target' },
        ],
      },
    ],
  },
  {
    title: '招商情报',
    icon: 'Bell',
    path: '/intelligence',
    children: [
      { title: '招商资讯', path: '/intelligence/news' },
      { title: '项目信息', path: '/intelligence/project' },
      { title: '技术转移', path: '/intelligence/technology' },
      { title: '资质变更', path: '/intelligence/qualification' },
      { title: '资本动态', path: '/intelligence/capital' },
      { title: '人才流动', path: '/intelligence/talent' },
      { title: '招商活动', path: '/intelligence/event' },
      { title: '情报追踪', path: '/intelligence/track' },
      { title: '情报报告', path: '/intelligence/report' },
    ],
  },
  {
    title: '企业监测',
    icon: 'Monitor',
    path: '/monitor',
    children: [
      {
        title: '企业总览',
        path: '/monitor/overview',
        children: [
          { title: '基础信息总览', path: '/monitor/overview/basic-info' },
          { title: '经济贡献分析', path: '/monitor/overview/economic-contribution' },
          { title: '动态排名', path: '/monitor/overview/dynamic-ranking' },
        ],
      },
      {
        title: '健康度',
        path: '/monitor/health',
        children: [
          { title: '健康度总览', path: '/monitor/health/overview' },
          { title: '健康度详情', path: '/monitor/health/detail' },
          { title: '健康度趋势', path: '/monitor/health/trend' },
        ],
      },
      {
        title: '榜单',
        path: '/monitor/rankings',
        children: [
          { title: '营收榜单', path: '/monitor/rankings/revenue' },
          { title: '成长榜单', path: '/monitor/rankings/growth' },
        ],
      },
      {
        title: '筛选器',
        path: '/monitor/filter',
        children: [
          { title: '企业筛选', path: '/monitor/filter/enterprise' },
          { title: '行业筛选', path: '/monitor/filter/industry' },
          { title: '区域筛选', path: '/monitor/filter/region' },
          { title: '自定义筛选', path: '/monitor/filter/custom' },
        ],
      },
      {
        title: '画像',
        path: '/monitor/portrait',
        children: [
          { title: '画像总览', path: '/monitor/portrait/overview' },
          { title: '画像详情', path: '/monitor/portrait/detail' },
          { title: '画像对比', path: '/monitor/portrait/compare' },
        ],
      },
      {
        title: '评价',
        path: '/monitor/evaluation',
        children: [{ title: '评价指数', path: '/monitor/evaluation/index' }],
      },
    ],
  },
]
