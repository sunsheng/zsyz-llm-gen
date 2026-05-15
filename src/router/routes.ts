import type { RouteRecordRaw } from 'vue-router'

// 使用 import.meta.glob 预收集所有视图组件，支持 Vite 动态导入
const viewModules = import.meta.glob('@/views/**/*.vue')

function lazy(path: string) {
  const importPath = `/src/views/${path}.vue`
  const mod = viewModules[importPath]
  if (!mod) {
    console.warn(`[Router] View not found: ${importPath}`)
    return () => import('@/views/error/404.vue')
  }
  return mod as () => Promise<typeof import('*.vue')>
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: lazy('login/index'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    redirect: '/map/chain/search',
    children: [
      // ===== 模块一: 产业地图 =====
      {
        path: 'map',
        name: 'Map',
        meta: { title: '产业地图', icon: 'Location' },
        redirect: '/map/chain/search',
        children: [
          {
            path: 'chain',
            name: 'MapChain',
            meta: { title: '产业链地图' },
            redirect: '/map/chain/search',
            children: [
              {
                path: 'search',
                name: 'MapChainSearch',
                component: lazy('map/chain/ResourceSearch'),
                meta: { title: '产业资源搜索' },
              },
              {
                path: 'filter',
                name: 'MapChainFilter',
                component: lazy('map/chain/ResourceFilter'),
                meta: { title: '产业资源筛选' },
              },
              {
                path: 'layers',
                name: 'MapChainLayers',
                component: lazy('map/chain/LayerSwitch'),
                meta: { title: '产业图层切换' },
              },
              {
                path: 'space',
                name: 'MapChainSpace',
                component: lazy('map/chain/SpaceDistribution'),
                meta: { title: '产业空间分布' },
              },
              {
                path: 'clusters',
                name: 'MapChainClusters',
                component: lazy('map/chain/ClusterDistribution'),
                meta: { title: '产业集群分布' },
              },
            ],
          },
          {
            path: 'supply',
            name: 'MapSupply',
            meta: { title: '供应链地图' },
            redirect: '/map/supply/enterprise',
            children: [
              {
                path: 'enterprise',
                name: 'MapSupplyEnterprise',
                component: lazy('map/supply/ScaleEntDistribution'),
                meta: { title: '规上企业分布' },
              },
              {
                path: 'resources',
                name: 'MapSupplyResources',
                component: lazy('map/support/SupportResourceDistribution'),
                meta: { title: '配套资源分布' },
              },
            ],
          },
          {
            path: 'tech',
            name: 'MapTech',
            meta: { title: '技术链地图' },
            redirect: '/map/tech/operate',
            children: [
              {
                path: 'operate',
                name: 'MapTechOperate',
                component: lazy('map/tech/MapOperation'),
                meta: { title: '产业地图操作' },
              },
              {
                path: 'config',
                name: 'MapTechConfig',
                component: lazy('map/tech/MapConfig'),
                meta: { title: '产业地图配置' },
              },
            ],
          },
        ],
      },

      // ===== 模块二: 产业图谱 =====
      {
        path: 'atlas',
        name: 'Atlas',
        meta: { title: '产业图谱', icon: 'Share' },
        redirect: '/atlas/national/build',
        children: [
          {
            path: 'national',
            name: 'AtlasNational',
            meta: { title: '全国图谱' },
            redirect: '/atlas/national/build',
            children: [
              {
                path: 'build',
                name: 'AtlasNationalBuild',
                component: lazy('atlas/national/ChainBuild'),
                meta: { title: '产业链图谱构建' },
              },
              {
                path: 'enterprises',
                name: 'AtlasNationalEnterprise',
                component: lazy('atlas/national/ChainEnterprise'),
                meta: { title: '产业链关联企业' },
              },
              {
                path: 'key-nodes',
                name: 'AtlasNationalKeyNode',
                component: lazy('atlas/national/KeyNodeIdentify'),
                meta: { title: '产业链关键环节识别' },
              },
              {
                path: 'manage',
                name: 'AtlasNationalManage',
                component: lazy('atlas/national/ChainGraphManage'),
                meta: { title: '产业链图谱管理' },
              },
            ],
          },
          {
            path: 'regional',
            name: 'AtlasRegional',
            meta: { title: '区域图谱' },
            redirect: '/atlas/regional/build',
            children: [
              {
                path: 'build',
                name: 'AtlasRegionalBuild',
                component: lazy('atlas/regional/ChainBuild'),
                meta: { title: '产业链图谱构建' },
              },
              {
                path: 'enterprises',
                name: 'AtlasRegionalEnterprise',
                component: lazy('atlas/regional/ChainEnterprise'),
                meta: { title: '产业链关联企业' },
              },
              {
                path: 'key-nodes',
                name: 'AtlasRegionalKeyNode',
                component: lazy('atlas/regional/KeyNodeIdentify'),
                meta: { title: '产业链关键环节识别' },
              },
              {
                path: 'manage',
                name: 'AtlasRegionalManage',
                component: lazy('atlas/regional/ChainGraphManage'),
                meta: { title: '产业链图谱管理' },
              },
            ],
          },
        ],
      },

      // ===== 模块三: 运行分析 =====
      {
        path: 'analysis',
        name: 'Analysis',
        meta: { title: '运行分析', icon: 'TrendCharts' },
        redirect: '/analysis/overview/investment-data',
        children: [
          {
            path: 'overview',
            name: 'AnalysisOverview',
            meta: { title: '产业总览' },
            redirect: '/analysis/overview/investment-data',
            children: [
              {
                path: 'investment-data',
                name: 'AnalysisOverviewInvestmentData',
                component: lazy('analysis/overview/InvestmentData'),
                meta: { title: '招商数据概览' },
              },
              {
                path: 'space-data',
                name: 'AnalysisOverviewSpaceData',
                component: lazy('analysis/overview/SpaceData'),
                meta: { title: '载体空间数据' },
              },
              {
                path: 'channel-data',
                name: 'AnalysisOverviewChannelData',
                component: lazy('analysis/overview/ChannelData'),
                meta: { title: '渠道空间数据' },
              },
              {
                path: 'manage-data',
                name: 'AnalysisOverviewManageData',
                component: lazy('analysis/overview/ManageData'),
                meta: { title: '招商管理数据' },
              },
            ],
          },
          {
            path: 'layout',
            name: 'AnalysisLayout',
            meta: { title: '企业布局' },
            redirect: '/analysis/layout/related',
            children: [
              {
                path: 'related',
                name: 'AnalysisLayoutRelated',
                component: lazy('analysis/layout/Related'),
                meta: { title: '关联企业' },
              },
              {
                path: 'leading',
                name: 'AnalysisLayoutLeading',
                component: lazy('analysis/layout/Leading'),
                meta: { title: '龙头企业' },
              },
            ],
          },
          {
            path: 'evaluation',
            name: 'AnalysisEvaluation',
            meta: { title: '产业链整体评价' },
            redirect: '/analysis/evaluation/profitability',
            children: [
              {
                path: 'profitability',
                name: 'AnalysisEvaluationProfitability',
                component: lazy('analysis/evaluation/Profitability'),
                meta: { title: '盈利能力' },
              },
              {
                path: 'capital-valuation',
                name: 'AnalysisEvaluationCapitalValuation',
                component: lazy('analysis/evaluation/CapitalValuation'),
                meta: { title: '资本估值指数' },
              },
              {
                path: 'investment-expansion',
                name: 'AnalysisEvaluationInvestmentExpansion',
                component: lazy('analysis/evaluation/InvestmentExpansion'),
                meta: { title: '投资扩张指数' },
              },
              {
                path: 'pricing-power-price',
                name: 'AnalysisEvaluationPricingPowerPrice',
                component: lazy('analysis/evaluation/PricingPowerPrice'),
                meta: { title: '议价能力指数(价格)' },
              },
              {
                path: 'pricing-power-capacity',
                name: 'AnalysisEvaluationPricingPowerCapacity',
                component: lazy('analysis/evaluation/PricingPowerCapacity'),
                meta: { title: '议价能力指数(产能)' },
              },
            ],
          },
          {
            path: 'carrier',
            name: 'AnalysisCarrier',
            meta: { title: '产业链载体分析' },
            redirect: '/analysis/carrier/scale-forecast',
            children: [
              {
                path: 'scale-forecast',
                name: 'AnalysisCarrierScaleForecast',
                component: lazy('analysis/carrier/ScaleForecast'),
                meta: { title: '产业规模及预测' },
              },
              {
                path: 'enterprise-analysis',
                name: 'AnalysisCarrierEnterpriseAnalysis',
                component: lazy('analysis/carrier/EnterpriseAnalysis'),
                meta: { title: '关联企业分析' },
              },
              {
                path: 'hotspots',
                name: 'AnalysisCarrierHotspots',
                component: lazy('analysis/carrier/Hotspots'),
                meta: { title: '投资热点分析' },
              },
            ],
          },
          {
            path: 'strength',
            name: 'AnalysisStrength',
            meta: { title: '产业链强弱分析' },
            redirect: '/analysis/strength/structure',
            children: [
              {
                path: 'structure',
                name: 'AnalysisStrengthStructure',
                component: lazy('analysis/strength/StructureAnalysis'),
                meta: { title: '产业结构分析' },
              },
              {
                path: 'space-distribution',
                name: 'AnalysisStrengthSpaceDistribution',
                component: lazy('analysis/strength/SpaceDistribution'),
                meta: { title: '产业空间分布' },
              },
            ],
          },
          {
            path: 'report',
            name: 'AnalysisReport',
            meta: { title: '产业运行报告' },
            redirect: '/analysis/report/data-collection',
            children: [
              {
                path: 'data-collection',
                name: 'AnalysisReportDataCollection',
                component: lazy('analysis/report/DataCollection'),
                meta: { title: '数据采集与整合' },
              },
              {
                path: 'visualization',
                name: 'AnalysisReportVisualization',
                component: lazy('analysis/report/Visualization'),
                meta: { title: '数据分析与可视化' },
              },
              {
                path: 'templates',
                name: 'AnalysisReportTemplates',
                component: lazy('analysis/report/Templates'),
                meta: { title: '报告模板' },
              },
            ],
          },
          {
            path: 'comparison',
            name: 'AnalysisComparison',
            meta: { title: '园区对比报告' },
            redirect: '/analysis/comparison/analysis',
            children: [
              {
                path: 'analysis',
                name: 'AnalysisComparisonAnalysis',
                component: lazy('analysis/comparison/Analysis'),
                meta: { title: '报告分析' },
              },
              {
                path: 'dimensions',
                name: 'AnalysisComparisonDimensions',
                component: lazy('analysis/comparison/Dimensions'),
                meta: { title: '对比维度' },
              },
              {
                path: 'metrics',
                name: 'AnalysisComparisonMetrics',
                component: lazy('analysis/comparison/Metrics'),
                meta: { title: '对比指标' },
              },
            ],
          },
          {
            path: 'ent-report',
            name: 'AnalysisEntReport',
            meta: { title: '企业运行报告' },
            redirect: '/analysis/ent-report/data-collection',
            children: [
              {
                path: 'data-collection',
                name: 'AnalysisEntReportDataCollection',
                component: lazy('analysis/ent-report/DataCollection'),
                meta: { title: '数据采集与整合' },
              },
              {
                path: 'indicators',
                name: 'AnalysisEntReportIndicators',
                component: lazy('analysis/ent-report/Indicators'),
                meta: { title: '运行指标体系' },
              },
              {
                path: 'generate',
                name: 'AnalysisEntReportGenerate',
                component: lazy('analysis/ent-report/Generate'),
                meta: { title: '报告生成与输出' },
              },
            ],
          },
        ],
      },

      // ===== 模块四: 产业动态 =====
      {
        path: 'dynamics',
        name: 'Dynamics',
        meta: { title: '产业动态', icon: 'Notification' },
        redirect: '/dynamics/news/collect',
        children: [
          {
            path: 'news',
            name: 'DynamicsNews',
            meta: { title: '产业新闻热点' },
            redirect: '/dynamics/news/collect',
            children: [
              {
                path: 'collect',
                name: 'DynamicsNewsCollect',
                component: lazy('dynamics/news/NewsCollection'),
                meta: { title: '产业新闻热点采集' },
              },
              {
                path: 'analysis',
                name: 'DynamicsNewsAnalysis',
                component: lazy('dynamics/news/NewsAnalysis'),
                meta: { title: '产业新闻热点智能分析' },
              },
            ],
          },
          {
            path: 'policy',
            name: 'DynamicsPolicy',
            meta: { title: '产业政策规划' },
            redirect: '/dynamics/policy/compilation',
            children: [
              {
                path: 'compilation',
                name: 'DynamicsPolicyCompilation',
                component: lazy('dynamics/policy/PolicyCompilation'),
                meta: { title: '政策汇编' },
              },
              {
                path: 'monitoring',
                name: 'DynamicsPolicyMonitoring',
                component: lazy('dynamics/policy/PolicyMonitoring'),
                meta: { title: '政策实施监测' },
              },
            ],
          },
        ],
      },

      // ===== 模块五: 区域对标 =====
      {
        path: 'benchmarking',
        name: 'Benchmarking',
        meta: { title: '区域对标', icon: 'Aim' },
        redirect: '/benchmarking/comparison/scale',
        children: [
          {
            path: 'comparison',
            name: 'BenchmarkingIndustryCompare',
            meta: { title: '产业对比分析' },
            redirect: '/benchmarking/comparison/scale',
            children: [
              {
                path: 'scale',
                name: 'BenchmarkingIndustryCompareScale',
                component: lazy('benchmarking/industry-compare/IndustryScale'),
                meta: { title: '产业规模' },
              },
              {
                path: 'structure',
                name: 'BenchmarkingIndustryCompareStructure',
                component: lazy('benchmarking/industry-compare/IndustryStructure'),
                meta: { title: '产业结构' },
              },
              {
                path: 'economic-benefit',
                name: 'BenchmarkingIndustryCompareBenefit',
                component: lazy('benchmarking/industry-compare/EconomicBenefit'),
                meta: { title: '经济效益' },
              },
              {
                path: 'innovation',
                name: 'BenchmarkingIndustryCompareInnovation',
                component: lazy('benchmarking/industry-compare/InnovationCapacity'),
                meta: { title: '创新能力' },
              },
              {
                path: 'talent',
                name: 'BenchmarkingIndustryCompareTalent',
                component: lazy('benchmarking/industry-compare/TalentResource'),
                meta: { title: '人才资源' },
              },
            ],
          },
          {
            path: 'proportion',
            name: 'BenchmarkingProportionAnalysis',
            meta: { title: '产业占比分析' },
            redirect: '/benchmarking/proportion/global',
            children: [
              {
                path: 'global',
                name: 'BenchmarkingProportionGlobalDistribution',
                component: lazy('benchmarking/proportion-analysis/GlobalDistribution'),
                meta: { title: '全局产业分布' },
              },
              {
                path: 'heatmap',
                name: 'BenchmarkingProportionHeatmap',
                component: lazy('benchmarking/proportion-analysis/MapHeatmap'),
                meta: { title: '地图热力图' },
              },
              {
                path: 'dashboard',
                name: 'BenchmarkingProportionDashboard',
                component: lazy('benchmarking/proportion-analysis/DynamicDashboard'),
                meta: { title: '动态数据看板' },
              },
            ],
          },
        ],
      },

      // ===== 模块六: 风险预警 =====
      {
        path: 'warning',
        name: 'Warning',
        meta: { title: '风险预警', icon: 'Warning' },
        redirect: '/warning/industry-warning/indicators',
        children: [
          {
            path: 'industry-warning',
            name: 'WarningIndustryWarning',
            meta: { title: '产业发展预警' },
            redirect: '/warning/industry-warning/indicators',
            children: [
              {
                path: 'indicators',
                name: 'WarningIndustryWarningIndicators',
                component: lazy('warning/industry-warning/CoreIndicators'),
                meta: { title: '核心监测指标' },
              },
              {
                path: 'threshold',
                name: 'WarningIndustryWarningThreshold',
                component: lazy('warning/industry-warning/DynamicThreshold'),
                meta: { title: '动态阈值设定' },
              },
              {
                path: 'model',
                name: 'WarningIndustryWarningModel',
                component: lazy('warning/industry-warning/WarningModel'),
                meta: { title: '预警分析模型' },
              },
            ],
          },
          {
            path: 'relocation-warning',
            name: 'WarningRelocationWarning',
            meta: { title: '企业外迁预警' },
            redirect: '/warning/relocation-warning/indicator-system',
            children: [
              {
                path: 'indicator-system',
                name: 'WarningRelocationIndicatorSystem',
                component: lazy('warning/relocation-warning/IndicatorSystem'),
                meta: { title: '预警指标体系' },
              },
              {
                path: 'risk-signal',
                name: 'WarningRelocationRiskSignal',
                component: lazy('warning/relocation-warning/IndirectRiskSignal'),
                meta: { title: '间接风险信号' },
              },
              {
                path: 'scoring-model',
                name: 'WarningRelocationScoringModel',
                component: lazy('warning/relocation-warning/RiskScoringModel'),
                meta: { title: '风险评分模型' },
              },
            ],
          },
        ],
      },

      // ===== 模块七: 区域地图 =====
      {
        path: 'regional-map',
        name: 'RegionalMap',
        meta: { title: '区域地图', icon: 'MapLocation' },
        redirect: '/regional-map/park-ranking/indicator-system',
        children: [
          {
            path: 'park-ranking',
            name: 'RegionalMapParkRanking',
            meta: { title: '园区榜单' },
            redirect: '/regional-map/park-ranking/indicator-system',
            children: [
              {
                path: 'indicator-system',
                name: 'RegionalMapParkRankingIndicatorSystem',
                component: lazy('regional-map/park-ranking/IndicatorSystem'),
                meta: { title: '榜单指标体系' },
              },
              {
                path: 'enterprise-ranking',
                name: 'RegionalMapParkRankingEnterpriseRanking',
                component: lazy('regional-map/park-ranking/EnterpriseRanking'),
                meta: { title: '企业综合榜' },
              },
              {
                path: 'chain-ranking',
                name: 'RegionalMapParkRankingChainRanking',
                component: lazy('regional-map/park-ranking/ChainRanking'),
                meta: { title: '产业链协同榜' },
              },
            ],
          },
        ],
      },

      // ===== 模块八: 精准招商 =====
      {
        path: 'invest',
        name: 'Invest',
        meta: { title: '精准招商', icon: 'Opportunity' },
        redirect: '/invest/chain/structure',
        children: [
          {
            path: 'chain',
            name: 'InvestChain',
            meta: { title: '产业链招商' },
            redirect: '/invest/chain/structure',
            children: [
              {
                path: 'structure',
                name: 'InvestChainStructure',
                component: lazy('invest/chain/ChainStructure'),
                meta: { title: '产业链结构' },
              },
              {
                path: 'key-node',
                name: 'InvestChainKeyNode',
                component: lazy('invest/chain/KeyNode'),
                meta: { title: '关键节点' },
              },
              {
                path: 'competitiveness',
                name: 'InvestChainCompetitiveness',
                component: lazy('invest/chain/CompetitivenessAssess'),
                meta: { title: '竞争力评估' },
              },
              {
                path: 'smart-recommend',
                name: 'InvestChainSmartRecommend',
                component: lazy('invest/chain/SmartRecommend'),
                meta: { title: '目标企业智能推荐' },
              },
            ],
          },
          {
            path: 'map-invest',
            name: 'InvestMapInvest',
            meta: { title: '产业地图招商' },
            redirect: '/invest/map-invest/resource-distribution',
            children: [
              {
                path: 'resource-distribution',
                name: 'InvestMapInvestResourceDistribution',
                component: lazy('invest/map-invest/ResourceDistribution'),
                meta: { title: '产业资源分布' },
              },
              {
                path: 'space-atlas',
                name: 'InvestMapInvestSpaceAtlas',
                component: lazy('invest/map-invest/SpaceAtlas'),
                meta: { title: '产业链空间图谱' },
              },
              {
                path: 'advantage-identify',
                name: 'InvestMapInvestAdvantageIdentify',
                component: lazy('invest/map-invest/AdvantageIdentify'),
                meta: { title: '优势环节识别' },
              },
              {
                path: 'extension-recommend',
                name: 'InvestMapInvestExtensionRecommend',
                component: lazy('invest/map-invest/ExtensionRecommend'),
                meta: { title: '延伸方向推荐' },
              },
            ],
          },
          {
            path: 'strengthen',
            name: 'InvestStrengthen',
            meta: { title: '强延补链招商' },
            redirect: '/invest/strengthen/benchmark',
            children: [
              {
                path: 'benchmark',
                name: 'InvestStrengthenBenchmark',
                component: lazy('invest/strengthen/BenchmarkTool'),
                meta: { title: '对标管理工具' },
              },
              {
                path: 'gap-diagnosis',
                name: 'InvestStrengthenGapDiagnosis',
                component: lazy('invest/strengthen/GapDiagnosis'),
                meta: { title: '缺口智能诊断' },
              },
              {
                path: 'fill-target',
                name: 'InvestStrengthenFillTarget',
                component: lazy('invest/strengthen/FillTargetLib'),
                meta: { title: '补链目标库' },
              },
            ],
          },
          {
            path: 'relation',
            name: 'InvestRelation',
            meta: { title: '关系链招商' },
            redirect: '/invest/relation/graph',
            children: [
              {
                path: 'graph',
                name: 'InvestRelationGraph',
                component: lazy('invest/relation/RelationGraph'),
                meta: { title: '关系图谱' },
              },
              {
                path: 'radiation',
                name: 'InvestRelationRadiation',
                component: lazy('invest/relation/ChainOwnerRadiation'),
                meta: { title: '链主企业辐射力分析' },
              },
              {
                path: 'secondary',
                name: 'InvestRelationSecondary',
                component: lazy('invest/relation/SecondaryInvest'),
                meta: { title: '二级关联招商' },
              },
            ],
          },
          {
            path: 'merchant',
            name: 'InvestMerchant',
            meta: { title: '以商招商' },
            redirect: '/invest/merchant/driving-portrait',
            children: [
              {
                path: 'driving-portrait',
                name: 'InvestMerchantDrivingPortrait',
                component: lazy('invest/merchant/DrivingPortrait'),
                meta: { title: '带动能力画像' },
              },
              {
                path: 'eco-network',
                name: 'InvestMerchantEcoNetwork',
                component: lazy('invest/merchant/EcoNetworkMining'),
                meta: { title: '生态网络挖掘' },
              },
              {
                path: 'incentive-policy',
                name: 'InvestMerchantIncentivePolicy',
                component: lazy('invest/merchant/IncentivePolicy'),
                meta: { title: '招商激励政策' },
              },
            ],
          },
          {
            path: 'ranking',
            name: 'InvestRanking',
            meta: { title: '名企榜单招商' },
            redirect: '/invest/ranking/vertical',
            children: [
              {
                path: 'vertical',
                name: 'InvestRankingVertical',
                component: lazy('invest/ranking/VerticalRanking'),
                meta: { title: '垂直榜单' },
              },
              {
                path: 'featured',
                name: 'InvestRankingFeatured',
                component: lazy('invest/ranking/FeaturedRanking'),
                meta: { title: '特色榜单' },
              },
              {
                path: 'empower-tool',
                name: 'InvestRankingEmpowerTool',
                component: lazy('invest/ranking/EmpowerTool'),
                meta: { title: '榜单赋能招商工具' },
              },
              {
                path: 'brand-linkage',
                name: 'InvestRankingBrandLinkage',
                component: lazy('invest/ranking/BrandLinkage'),
                meta: { title: '品牌联动与传播' },
              },
            ],
          },
          {
            path: 'leading',
            name: 'InvestLeading',
            meta: { title: '龙头骨干招商' },
            redirect: '/invest/leading/identify',
            children: [
              {
                path: 'identify',
                name: 'InvestLeadingIdentify',
                component: lazy('invest/leading/LeadingIdentify'),
                meta: { title: '龙头骨干企业识别与评估' },
              },
              {
                path: 'strategy',
                name: 'InvestLeadingStrategy',
                component: lazy('invest/leading/StrategyGenerate'),
                meta: { title: '精准招商策略生成' },
              },
              {
                path: 'eco-build',
                name: 'InvestLeadingEcoBuild',
                component: lazy('invest/leading/EcoBuildCollaborate'),
                meta: { title: '生态构建与协同' },
              },
            ],
          },
          {
            path: 'qualified',
            name: 'InvestQualified',
            meta: { title: '资质企业招商' },
            redirect: '/invest/qualified/smart-identify',
            children: [
              {
                path: 'smart-identify',
                name: 'InvestQualifiedSmartIdentify',
                component: lazy('invest/qualified/SmartIdentify'),
                meta: { title: '资质企业智能识别' },
              },
              {
                path: 'demand-portrait',
                name: 'InvestQualifiedDemandPortrait',
                component: lazy('invest/qualified/DemandPortrait'),
                meta: { title: '资质企业需求画像' },
              },
              {
                path: 'resource-match',
                name: 'InvestQualifiedResourceMatch',
                component: lazy('invest/qualified/ResourceMatch'),
                meta: { title: '资源智能匹配' },
              },
            ],
          },
          {
            path: 'fund',
            name: 'InvestFund',
            meta: { title: '投行基金招商' },
            redirect: '/invest/fund/guide',
            children: [
              {
                path: 'guide',
                name: 'InvestFundGuide',
                component: lazy('invest/fund/FundGuide'),
                meta: { title: '产业基金引导' },
              },
              {
                path: 'project-lib',
                name: 'InvestFundProjectLib',
                component: lazy('invest/fund/ProjectLib'),
                meta: { title: '项目库管理' },
              },
              {
                path: 'capital-docking',
                name: 'InvestFundCapitalDocking',
                component: lazy('invest/fund/CapitalDocking'),
                meta: { title: '资本对接' },
              },
            ],
          },
          {
            path: 'research',
            name: 'InvestResearch',
            meta: { title: '科研机构招商' },
            redirect: '/invest/research/panorama',
            children: [
              {
                path: 'panorama',
                name: 'InvestResearchPanorama',
                component: lazy('invest/research/ResourcePanorama'),
                meta: { title: '科研资源全景库' },
              },
              {
                path: 'tech-transfer',
                name: 'InvestResearchTechTransfer',
                component: lazy('invest/research/TechTransferAssess'),
                meta: { title: '技术转化潜力评估' },
              },
              {
                path: 'talent-mechanism',
                name: 'InvestResearchTalentMechanism',
                component: lazy('invest/research/TalentMechanism'),
                meta: { title: '人才流动与共享机制' },
              },
            ],
          },
          {
            path: 'chain-owner',
            name: 'InvestChainOwner',
            meta: { title: '链主适配招商' },
            redirect: '/invest/chain-owner/portrait',
            children: [
              {
                path: 'portrait',
                name: 'InvestChainOwnerPortrait',
                component: lazy('invest/chain-owner/OwnerPortrait'),
                meta: { title: '链主画像与需求解析' },
              },
              {
                path: 'gap-diagnosis',
                name: 'InvestChainOwnerGapDiagnosis',
                component: lazy('invest/chain-owner/ChainGapDiagnosis'),
                meta: { title: '产业链缺口诊断' },
              },
              {
                path: 'smart-match',
                name: 'InvestChainOwnerSmartMatch',
                component: lazy('invest/chain-owner/AdaptiveMatch'),
                meta: { title: '适配企业智能匹配' },
              },
            ],
          },
          {
            path: 'park',
            name: 'InvestPark',
            meta: { title: '园区招商' },
            redirect: '/invest/park/panorama',
            children: [
              {
                path: 'panorama',
                name: 'InvestParkPanorama',
                component: lazy('invest/park/ParkPanorama'),
                meta: { title: '园区资源全景展示' },
              },
              {
                path: 'smart-match',
                name: 'InvestParkSmartMatch',
                component: lazy('invest/park/SmartMatchEngine'),
                meta: { title: '智能企业匹配引擎' },
              },
              {
                path: 'chain-collaborate',
                name: 'InvestParkChainCollaborate',
                component: lazy('invest/park/ChainCollaborate'),
                meta: { title: '产业链协同招商' },
              },
            ],
          },
        ],
      },

      // ===== 模块九: 招商情报 =====
      {
        path: 'intelligence',
        name: 'Intelligence',
        meta: { title: '招商情报', icon: 'Bell' },
        redirect: '/intelligence/news-invest/index',
        children: [
          {
            path: 'news-invest',
            name: 'IntelligenceNewsInvest',
            meta: { title: '资讯招商情报' },
            redirect: '/intelligence/news-invest/index',
            children: [
              {
                path: 'index',
                name: 'IntelligenceNewsInvestIndex',
                component: lazy('intelligence/news-invest/NewsInvest'),
                meta: { title: '资讯招商情报' },
              },
            ],
          },
          {
            path: 'project-invest',
            name: 'IntelligenceProjectInvest',
            meta: { title: '项目招商情报' },
            redirect: '/intelligence/project-invest/index',
            children: [
              {
                path: 'index',
                name: 'IntelligenceProjectInvestIndex',
                component: lazy('intelligence/project-invest/ProjectInvest'),
                meta: { title: '项目招商情报' },
              },
            ],
          },
          {
            path: 'tech-invest',
            name: 'IntelligenceTechInvest',
            meta: { title: '技术招商情报' },
            redirect: '/intelligence/tech-invest/index',
            children: [
              {
                path: 'index',
                name: 'IntelligenceTechInvestIndex',
                component: lazy('intelligence/tech-invest/TechInvest'),
                meta: { title: '技术招商情报' },
              },
            ],
          },
          {
            path: 'qual-invest',
            name: 'IntelligenceQualInvest',
            meta: { title: '资质招商情报' },
            redirect: '/intelligence/qual-invest/index',
            children: [
              {
                path: 'index',
                name: 'IntelligenceQualInvestIndex',
                component: lazy('intelligence/qual-invest/QualInvest'),
                meta: { title: '资质招商情报' },
              },
            ],
          },
          {
            path: 'capital-invest',
            name: 'IntelligenceCapitalInvest',
            meta: { title: '资本招商情报' },
            redirect: '/intelligence/capital-invest/index',
            children: [
              {
                path: 'index',
                name: 'IntelligenceCapitalInvestIndex',
                component: lazy('intelligence/capital-invest/CapitalInvest'),
                meta: { title: '资本招商情报' },
              },
            ],
          },
          {
            path: 'risk-monitor',
            name: 'IntelligenceRiskMonitor',
            meta: { title: '招商风险监测' },
            redirect: '/intelligence/risk-monitor/monitor',
            children: [
              {
                path: 'monitor',
                name: 'IntelligenceRiskMonitorIndex',
                component: lazy('intelligence/risk-monitor/RiskMonitor'),
                meta: { title: '招商风险监测' },
              },
              {
                path: 'classification',
                name: 'IntelligenceRiskMonitorClassification',
                component: lazy('intelligence/risk-monitor/RiskClassification'),
                meta: { title: '风险分类体系' },
              },
            ],
          },
          {
            path: 'search',
            name: 'IntelligenceSearch',
            meta: { title: '招商情报搜索' },
            redirect: '/intelligence/search/index',
            children: [
              {
                path: 'index',
                name: 'IntelligenceSearchIndex',
                component: lazy('intelligence/search/IntelligenceSearch'),
                meta: { title: '招商情报搜索' },
              },
            ],
          },
          {
            path: 'mine',
            name: 'IntelligenceMine',
            meta: { title: '我的招商情报' },
            redirect: '/intelligence/mine/index',
            children: [
              {
                path: 'index',
                name: 'IntelligenceMineIndex',
                component: lazy('intelligence/mine/MyIntelligence'),
                meta: { title: '我的招商情报' },
              },
            ],
          },
        ],
      },

      // ===== 模块十: 企业监测 =====
      {
        path: 'monitor',
        name: 'Monitor',
        meta: { title: '企业监测', icon: 'Monitor' },
        redirect: '/monitor/overview/basic-info',
        children: [
          {
            path: 'overview',
            name: 'MonitorOverview',
            meta: { title: '企业总览' },
            redirect: '/monitor/overview/basic-info',
            children: [
              {
                path: 'basic-info',
                name: 'MonitorOverviewBasicInfo',
                component: lazy('monitor/overview/BasicInfo'),
                meta: { title: '基础信息总览' },
              },
              {
                path: 'economic-contribution',
                name: 'MonitorOverviewEconomicContribution',
                component: lazy('monitor/overview/EconomicContribution'),
                meta: { title: '经济贡献分析' },
              },
              {
                path: 'dynamic-ranking',
                name: 'MonitorOverviewDynamicRanking',
                component: lazy('monitor/overview/DynamicRanking'),
                meta: { title: '动态排名' },
              },
            ],
          },
          {
            path: 'health',
            name: 'MonitorHealth',
            meta: { title: '经营健康度监测' },
            redirect: '/monitor/health/key-dashboard',
            children: [
              {
                path: 'key-dashboard',
                name: 'MonitorHealthKeyDashboard',
                component: lazy('monitor/health/KeyDashboard'),
                meta: { title: '关键指标看板' },
              },
              {
                path: 'chain-collaborate',
                name: 'MonitorHealthChainCollaborate',
                component: lazy('monitor/health/ChainCollaborateMonitor'),
                meta: { title: '产业链协同监测' },
              },
              {
                path: 'sustainable',
                name: 'MonitorHealthSustainable',
                component: lazy('monitor/health/SustainableMonitor'),
                meta: { title: '可持续发展监测' },
              },
            ],
          },
          {
            path: 'rankings',
            name: 'MonitorRankings',
            meta: { title: '企业榜单' },
            redirect: '/monitor/rankings/multi-source',
            children: [
              {
                path: 'multi-source',
                name: 'MonitorRankingsMultiSource',
                component: lazy('monitor/rankings/MultiSourceRanking'),
                meta: { title: '多源榜单动态整合' },
              },
              {
                path: 'fluctuation-warning',
                name: 'MonitorRankingsFluctuationWarning',
                component: lazy('monitor/rankings/FluctuationWarning'),
                meta: { title: '榜单波动预警体系' },
              },
            ],
          },
          {
            path: 'filter',
            name: 'MonitorFilter',
            meta: { title: '企业筛选器' },
            redirect: '/monitor/filter/basic-info',
            children: [
              {
                path: 'basic-info',
                name: 'MonitorFilterBasicInfo',
                component: lazy('monitor/filter/BasicInfoFilter'),
                meta: { title: '基础信息筛选' },
              },
              {
                path: 'business-qual',
                name: 'MonitorFilterBusinessQual',
                component: lazy('monitor/filter/BusinessQualFilter'),
                meta: { title: '经营与资质筛选' },
              },
              {
                path: 'chain-relation',
                name: 'MonitorFilterChainRelation',
                component: lazy('monitor/filter/ChainRelationFilter'),
                meta: { title: '产业链关联筛选' },
              },
              {
                path: 'risk-compliance',
                name: 'MonitorFilterRiskCompliance',
                component: lazy('monitor/filter/RiskComplianceFilter'),
                meta: { title: '风险与合规筛选' },
              },
            ],
          },
          {
            path: 'portrait',
            name: 'MonitorPortrait',
            meta: { title: '企业画像' },
            redirect: '/monitor/portrait/health-index',
            children: [
              {
                path: 'health-index',
                name: 'MonitorPortraitHealthIndex',
                component: lazy('monitor/portrait/HealthIndex'),
                meta: { title: '企业健康指数' },
              },
              {
                path: 'multi-dimension',
                name: 'MonitorPortraitMultiDimension',
                component: lazy('monitor/portrait/MultiDimensionPortrait'),
                meta: { title: '多维度画像' },
              },
              {
                path: 'chain-relation',
                name: 'MonitorPortraitChainRelation',
                component: lazy('monitor/portrait/ChainRelation'),
                meta: { title: '产业链关联' },
              },
            ],
          },
          {
            path: 'evaluation',
            name: 'MonitorEvaluation',
            meta: { title: '企业综合评价' },
            redirect: '/monitor/evaluation/five-dimension',
            children: [
              {
                path: 'five-dimension',
                name: 'MonitorEvaluationFiveDimension',
                component: lazy('monitor/evaluation/FiveDimensionModel'),
                meta: { title: '五维评价模型' },
              },
            ],
          },
        ],
      },

      // 404
      { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/error/404' },
      {
        path: '/error/404',
        name: 'Error404',
        component: lazy('error/404'),
        meta: { title: '页面不存在', requiresAuth: false },
      },
    ],
  },
]
