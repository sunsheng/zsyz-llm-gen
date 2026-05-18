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
          { title: '产业链图谱构建', path: '/atlas/national/build' },
          { title: '产业链关联企业', path: '/atlas/national/enterprises' },
          { title: '产业链关键环节识别', path: '/atlas/national/key-nodes' },
          { title: '产业链图谱管理', path: '/atlas/national/manage' },
        ],
      },
      {
        title: '区域图谱',
        path: '/atlas/regional',
        children: [
          { title: '产业链图谱构建', path: '/atlas/regional/build' },
          { title: '产业链关联企业', path: '/atlas/regional/enterprises' },
          { title: '产业链关键环节识别', path: '/atlas/regional/key-nodes' },
          { title: '产业链图谱管理', path: '/atlas/regional/manage' },
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
          { title: '招商数据概览', path: '/analysis/overview/investment-data' },
          { title: '载体空间数据', path: '/analysis/overview/space-data' },
          { title: '渠道空间数据', path: '/analysis/overview/channel-data' },
          { title: '招商管理数据', path: '/analysis/overview/manage-data' },
        ],
      },
      {
        title: '企业布局',
        path: '/analysis/layout',
        children: [
          { title: '关联企业', path: '/analysis/layout/related' },
          { title: '龙头企业', path: '/analysis/layout/leading' },
        ],
      },
      {
        title: '产业链整体评价',
        path: '/analysis/evaluation',
        children: [
          { title: '盈利能力', path: '/analysis/evaluation/profitability' },
          { title: '资本估值指数', path: '/analysis/evaluation/capital-valuation' },
          { title: '投资扩张指数', path: '/analysis/evaluation/investment-expansion' },
          { title: '议价能力指数(价格)', path: '/analysis/evaluation/pricing-power-price' },
          { title: '议价能力指数(产能)', path: '/analysis/evaluation/pricing-power-capacity' },
        ],
      },
      {
        title: '产业链载体分析',
        path: '/analysis/carrier',
        children: [
          { title: '产业规模及预测', path: '/analysis/carrier/scale-forecast' },
          { title: '关联企业分析', path: '/analysis/carrier/enterprise-analysis' },
          { title: '投资热点分析', path: '/analysis/carrier/hotspots' },
        ],
      },
      {
        title: '产业链强弱分析',
        path: '/analysis/strength',
        children: [
          { title: '产业结构分析', path: '/analysis/strength/structure' },
          { title: '产业空间分布', path: '/analysis/strength/space-distribution' },
        ],
      },
      {
        title: '产业运行报告',
        path: '/analysis/report',
        children: [
          { title: '数据采集与整合', path: '/analysis/report/data-collection' },
          { title: '数据分析与可视化', path: '/analysis/report/visualization' },
          { title: '报告模板', path: '/analysis/report/templates' },
        ],
      },
      {
        title: '园区对比报告',
        path: '/analysis/comparison',
        children: [
          { title: '报告分析', path: '/analysis/comparison/analysis' },
          { title: '对比维度', path: '/analysis/comparison/dimensions' },
          { title: '对比指标', path: '/analysis/comparison/metrics' },
        ],
      },
      {
        title: '企业运行报告',
        path: '/analysis/ent-report',
        children: [
          { title: '数据采集与整合', path: '/analysis/ent-report/data-collection' },
          { title: '运行指标体系', path: '/analysis/ent-report/indicators' },
          { title: '报告生成与输出', path: '/analysis/ent-report/generate' },
        ],
      },
    ],
  },
  {
    title: '产业动态',
    icon: 'Notification',
    path: '/dynamics',
    children: [
      {
        title: '产业新闻热点',
        path: '/dynamics/news',
        children: [
          { title: '产业新闻热点采集', path: '/dynamics/news/collect' },
          { title: '产业新闻热点智能分析', path: '/dynamics/news/analysis' },
        ],
      },
      {
        title: '产业政策规划',
        path: '/dynamics/policy',
        children: [
          { title: '政策汇编', path: '/dynamics/policy/compilation' },
          { title: '政策实施监测', path: '/dynamics/policy/monitoring' },
        ],
      },
    ],
  },
  {
    title: '区域对标',
    icon: 'Aim',
    path: '/benchmarking',
    children: [
      {
        title: '产业对比分析',
        path: '/benchmarking/comparison',
        children: [
          { title: '产业规模', path: '/benchmarking/comparison/scale' },
          { title: '产业结构', path: '/benchmarking/comparison/structure' },
          { title: '经济效益', path: '/benchmarking/comparison/economic-benefit' },
          { title: '创新能力', path: '/benchmarking/comparison/innovation' },
          { title: '人才资源', path: '/benchmarking/comparison/talent' },
        ],
      },
      {
        title: '产业占比分析',
        path: '/benchmarking/proportion',
        children: [
          { title: '全局产业分布', path: '/benchmarking/proportion/global' },
          { title: '地图热力图', path: '/benchmarking/proportion/heatmap' },
          { title: '动态数据看板', path: '/benchmarking/proportion/dashboard' },
        ],
      },
    ],
  },
  {
    title: '风险预警',
    icon: 'Warning',
    path: '/warning',
    children: [
      {
        title: '产业发展预警',
        path: '/warning/dev',
        children: [
          { title: '核心监测指标', path: '/warning/dev/indicators' },
          { title: '动态阈值设定', path: '/warning/dev/threshold' },
          { title: '预警分析模型', path: '/warning/dev/model' },
        ],
      },
      {
        title: '企业外迁预警',
        path: '/warning/relocation',
        children: [
          { title: '预警指标体系', path: '/warning/relocation/indicators' },
          { title: '间接风险信号', path: '/warning/relocation/signals' },
          { title: '风险评分模型', path: '/warning/relocation/model' },
        ],
      },
    ],
  },
  {
    title: '区域地图',
    icon: 'MapLocation',
    path: '/regional-map',
    children: [
      {
        title: '园区榜单',
        path: '/regional-map/ranking',
        children: [
          { title: '榜单指标体系', path: '/regional-map/ranking/indicator-system' },
          { title: '企业综合榜', path: '/regional-map/ranking/enterprise-comprehensive' },
          { title: '产业链协同榜', path: '/regional-map/ranking/chain-synergy' },
        ],
      },
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
          { title: '产业链结构', path: '/invest/chain/structure' },
          { title: '关键节点', path: '/invest/chain/key-node' },
          { title: '竞争力评估', path: '/invest/chain/competitiveness' },
          { title: '目标企业智能推荐', path: '/invest/chain/smart-recommend' },
        ],
      },
      {
        title: '产业地图招商',
        path: '/invest/map-invest',
        children: [
          { title: '产业资源分布', path: '/invest/map-invest/resource-distribution' },
          { title: '产业链空间图谱', path: '/invest/map-invest/space-atlas' },
          { title: '优势环节识别', path: '/invest/map-invest/advantage-identify' },
          { title: '延伸方向推荐', path: '/invest/map-invest/extension-recommend' },
        ],
      },
      {
        title: '强延补链招商',
        path: '/invest/strengthen',
        children: [
          { title: '对标管理工具', path: '/invest/strengthen/benchmark' },
          { title: '缺口智能诊断', path: '/invest/strengthen/gap-diagnosis' },
          { title: '补链目标库', path: '/invest/strengthen/fill-target' },
        ],
      },
      {
        title: '关系链招商',
        path: '/invest/relation',
        children: [
          { title: '关系图谱', path: '/invest/relation/graph' },
          { title: '链主企业辐射力分析', path: '/invest/relation/radiation' },
          { title: '二级关联招商', path: '/invest/relation/secondary' },
        ],
      },
      {
        title: '以商招商',
        path: '/invest/merchant',
        children: [
          { title: '带动能力画像', path: '/invest/merchant/driving-portrait' },
          { title: '生态网络挖掘', path: '/invest/merchant/eco-network' },
          { title: '招商激励政策', path: '/invest/merchant/incentive-policy' },
        ],
      },
      {
        title: '名企榜单招商',
        path: '/invest/ranking',
        children: [
          { title: '垂直榜单', path: '/invest/ranking/vertical' },
          { title: '特色榜单', path: '/invest/ranking/featured' },
          { title: '榜单赋能招商工具', path: '/invest/ranking/empower-tool' },
          { title: '品牌联动与传播', path: '/invest/ranking/brand-linkage' },
        ],
      },
      {
        title: '龙头骨干招商',
        path: '/invest/leading',
        children: [
          { title: '龙头骨干企业识别与评估', path: '/invest/leading/identify' },
          { title: '精准招商策略生成', path: '/invest/leading/strategy' },
          { title: '生态构建与协同', path: '/invest/leading/eco-build' },
        ],
      },
      {
        title: '资质企业招商',
        path: '/invest/qualified',
        children: [
          { title: '资质企业智能识别', path: '/invest/qualified/smart-identify' },
          { title: '资质企业需求画像', path: '/invest/qualified/demand-portrait' },
          { title: '资源智能匹配', path: '/invest/qualified/resource-match' },
        ],
      },
      {
        title: '投行基金招商',
        path: '/invest/fund',
        children: [
          { title: '产业基金引导', path: '/invest/fund/guide' },
          { title: '项目库管理', path: '/invest/fund/project-lib' },
          { title: '资本对接', path: '/invest/fund/capital-docking' },
        ],
      },
      {
        title: '科研机构招商',
        path: '/invest/research',
        children: [
          { title: '科研资源全景库', path: '/invest/research/panorama' },
          { title: '技术转化潜力评估', path: '/invest/research/tech-transfer' },
          { title: '人才流动与共享机制', path: '/invest/research/talent-mechanism' },
        ],
      },
      {
        title: '链主适配招商',
        path: '/invest/chain-owner',
        children: [
          { title: '链主画像与需求解析', path: '/invest/chain-owner/portrait' },
          { title: '产业链缺口诊断', path: '/invest/chain-owner/gap-diagnosis' },
          { title: '适配企业智能匹配', path: '/invest/chain-owner/smart-match' },
        ],
      },
      {
        title: '园区招商',
        path: '/invest/park',
        children: [
          { title: '园区资源全景展示', path: '/invest/park/panorama' },
          { title: '智能企业匹配引擎', path: '/invest/park/smart-match' },
          { title: '产业链协同招商', path: '/invest/park/chain-collaborate' },
        ],
      },
    ],
  },
  {
    title: '招商情报',
    icon: 'Bell',
    path: '/intelligence',
    children: [
      { title: '资讯招商情报', path: '/intelligence/news-invest/index' },
      { title: '项目招商情报', path: '/intelligence/project-invest/index' },
      { title: '技术招商情报', path: '/intelligence/tech-invest/index' },
      { title: '资质招商情报', path: '/intelligence/qual-invest/index' },
      { title: '资本招商情报', path: '/intelligence/capital-invest/index' },
      {
        title: '招商风险监测',
        path: '/intelligence/risk-monitor',
        children: [
          { title: '招商风险监测', path: '/intelligence/risk-monitor/monitor' },
          { title: '风险分类体系', path: '/intelligence/risk-monitor/classification' },
        ],
      },
      { title: '招商情报搜索', path: '/intelligence/search/index' },
      { title: '我的招商情报', path: '/intelligence/mine/index' },
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
        title: '经营健康度监测',
        path: '/monitor/health',
        children: [
          { title: '关键指标看板', path: '/monitor/health/key-dashboard' },
          { title: '产业链协同监测', path: '/monitor/health/chain-collaborate' },
          { title: '可持续发展监测', path: '/monitor/health/sustainable' },
        ],
      },
      {
        title: '企业榜单',
        path: '/monitor/rankings',
        children: [
          { title: '多源榜单动态整合', path: '/monitor/rankings/multi-source' },
          { title: '榜单波动预警体系', path: '/monitor/rankings/fluctuation-warning' },
        ],
      },
      {
        title: '企业筛选器',
        path: '/monitor/filter',
        children: [
          { title: '基础信息筛选', path: '/monitor/filter/basic-info' },
          { title: '经营与资质筛选', path: '/monitor/filter/business-qual' },
          { title: '产业链关联筛选', path: '/monitor/filter/chain-relation' },
          { title: '风险与合规筛选', path: '/monitor/filter/risk-compliance' },
        ],
      },
      {
        title: '企业画像',
        path: '/monitor/portrait',
        children: [
          { title: '企业健康指数', path: '/monitor/portrait/health-index' },
          { title: '多维度画像', path: '/monitor/portrait/multi-dimension' },
          { title: '产业链关联', path: '/monitor/portrait/chain-relation' },
        ],
      },
      {
        title: '企业综合评价',
        path: '/monitor/evaluation',
        children: [{ title: '五维评价模型', path: '/monitor/evaluation/five-dimension' }],
      },
    ],
  },
]
