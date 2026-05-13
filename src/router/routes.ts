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
    meta: { title: '登录', requiresAuth: false }
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
              { path: 'search', name: 'MapChainSearch', component: lazy('map/chain/ResourceSearch'), meta: { title: '产业资源搜索' } },
              { path: 'filter', name: 'MapChainFilter', component: lazy('map/chain/ResourceFilter'), meta: { title: '产业资源筛选' } },
              { path: 'layers', name: 'MapChainLayers', component: lazy('map/chain/LayerSwitch'), meta: { title: '产业图层切换' } },
              { path: 'space', name: 'MapChainSpace', component: lazy('map/chain/SpaceDistribution'), meta: { title: '产业空间分布' } },
              { path: 'clusters', name: 'MapChainClusters', component: lazy('map/chain/ClusterDistribution'), meta: { title: '产业集群分布' } }
            ]
          },
          {
            path: 'supply',
            name: 'MapSupply',
            meta: { title: '供应链地图' },
            redirect: '/map/supply/overview',
            children: [
              { path: 'overview', name: 'MapSupplyOverview', component: lazy('map/supply/SupplyOverview'), meta: { title: '供应链总览' } },
              { path: 'detail', name: 'MapSupplyDetail', component: lazy('map/supply/SupplyDetail'), meta: { title: '供应链详情' } }
            ]
          },
          {
            path: 'tech',
            name: 'MapTech',
            meta: { title: '技术链地图' },
            redirect: '/map/tech/overview',
            children: [
              { path: 'overview', name: 'MapTechOverview', component: lazy('map/tech/TechOverview'), meta: { title: '技术链总览' } },
              { path: 'detail', name: 'MapTechDetail', component: lazy('map/tech/TechDetail'), meta: { title: '技术链详情' } }
            ]
          }
        ]
      },

      // ===== 模块二: 产业图谱 =====
      {
        path: 'atlas',
        name: 'Atlas',
        meta: { title: '产业图谱', icon: 'Share' },
        redirect: '/atlas/national/overview',
        children: [
          {
            path: 'national',
            name: 'AtlasNational',
            meta: { title: '全国图谱' },
            redirect: '/atlas/national/overview',
            children: [
              { path: 'overview', name: 'AtlasNationalOverview', component: lazy('atlas/national/NationalOverview'), meta: { title: '全国图谱总览' } },
              { path: 'chain', name: 'AtlasNationalChain', component: lazy('atlas/national/ChainGraph'), meta: { title: '产业链图谱' } },
              { path: 'relation', name: 'AtlasNationalRelation', component: lazy('atlas/national/RelationGraph'), meta: { title: '企业关系图谱' } },
              { path: 'tech', name: 'AtlasNationalTech', component: lazy('atlas/national/TechGraph'), meta: { title: '技术图谱' } }
            ]
          },
          {
            path: 'regional',
            name: 'AtlasRegional',
            meta: { title: '区域图谱' },
            redirect: '/atlas/regional/overview',
            children: [
              { path: 'overview', name: 'AtlasRegionalOverview', component: lazy('atlas/regional/RegionalOverview'), meta: { title: '区域图谱总览' } },
              { path: 'chain', name: 'AtlasRegionalChain', component: lazy('atlas/regional/ChainGraph'), meta: { title: '区域产业链图谱' } },
              { path: 'relation', name: 'AtlasRegionalRelation', component: lazy('atlas/regional/RelationGraph'), meta: { title: '区域关系图谱' } },
              { path: 'compare', name: 'AtlasRegionalCompare', component: lazy('atlas/regional/CompareGraph'), meta: { title: '区域对比图谱' } }
            ]
          }
        ]
      },

      // ===== 模块三: 运行分析 =====
      {
        path: 'analysis',
        name: 'Analysis',
        meta: { title: '运行分析', icon: 'TrendCharts' },
        redirect: '/analysis/overview/summary',
        children: [
          {
            path: 'overview',
            name: 'AnalysisOverview',
            meta: { title: '产业总览' },
            redirect: '/analysis/overview/summary',
            children: [
              { path: 'summary', name: 'AnalysisOverviewSummary', component: lazy('analysis/overview/Summary'), meta: { title: '产业总览' } },
              { path: 'trend', name: 'AnalysisOverviewTrend', component: lazy('analysis/overview/Trend'), meta: { title: '发展趋势' } },
              { path: 'structure', name: 'AnalysisOverviewStructure', component: lazy('analysis/overview/Structure'), meta: { title: '产业结构' } },
              { path: 'contribution', name: 'AnalysisOverviewContribution', component: lazy('analysis/overview/Contribution'), meta: { title: '贡献分析' } }
            ]
          },
          {
            path: 'layout',
            name: 'AnalysisLayout',
            meta: { title: '企业布局' },
            redirect: '/analysis/layout/region',
            children: [
              { path: 'region', name: 'AnalysisLayoutRegion', component: lazy('analysis/layout/RegionLayout'), meta: { title: '区域布局' } },
              { path: 'industry', name: 'AnalysisLayoutIndustry', component: lazy('analysis/layout/IndustryLayout'), meta: { title: '行业布局' } }
            ]
          },
          {
            path: 'evaluation',
            name: 'AnalysisEvaluation',
            meta: { title: '整体评价' },
            redirect: '/analysis/evaluation/comprehensive',
            children: [
              { path: 'comprehensive', name: 'AnalysisEvaluationComprehensive', component: lazy('analysis/evaluation/Comprehensive'), meta: { title: '综合评价' } },
              { path: 'competitiveness', name: 'AnalysisEvaluationCompetitiveness', component: lazy('analysis/evaluation/Competitiveness'), meta: { title: '竞争力评价' } },
              { path: 'innovation', name: 'AnalysisEvaluationInnovation', component: lazy('analysis/evaluation/Innovation'), meta: { title: '创新力评价' } },
              { path: 'efficiency', name: 'AnalysisEvaluationEfficiency', component: lazy('analysis/evaluation/Efficiency'), meta: { title: '效率评价' } },
              { path: 'potential', name: 'AnalysisEvaluationPotential', component: lazy('analysis/evaluation/Potential'), meta: { title: '潜力评价' } }
            ]
          },
          {
            path: 'carrier',
            name: 'AnalysisCarrier',
            meta: { title: '载体分析' },
            redirect: '/analysis/carrier/park',
            children: [
              { path: 'park', name: 'AnalysisCarrierPark', component: lazy('analysis/carrier/ParkAnalysis'), meta: { title: '园区分析' } },
              { path: 'platform', name: 'AnalysisCarrierPlatform', component: lazy('analysis/carrier/PlatformAnalysis'), meta: { title: '平台分析' } },
              { path: 'incubator', name: 'AnalysisCarrierIncubator', component: lazy('analysis/carrier/IncubatorAnalysis'), meta: { title: '孵化器分析' } }
            ]
          },
          {
            path: 'strength',
            name: 'AnalysisStrength',
            meta: { title: '强弱分析' },
            redirect: '/analysis/strength/snapshot',
            children: [
              { path: 'snapshot', name: 'AnalysisStrengthSnapshot', component: lazy('analysis/strength/StrengthSnapshot'), meta: { title: '强弱快照' } },
              { path: 'detail', name: 'AnalysisStrengthDetail', component: lazy('analysis/strength/StrengthDetail'), meta: { title: '强弱详情' } }
            ]
          },
          {
            path: 'report',
            name: 'AnalysisReport',
            meta: { title: '运行报告' },
            redirect: '/analysis/report/monthly',
            children: [
              { path: 'monthly', name: 'AnalysisReportMonthly', component: lazy('analysis/report/MonthlyReport'), meta: { title: '月度报告' } },
              { path: 'quarterly', name: 'AnalysisReportQuarterly', component: lazy('analysis/report/QuarterlyReport'), meta: { title: '季度报告' } },
              { path: 'annual', name: 'AnalysisReportAnnual', component: lazy('analysis/report/AnnualReport'), meta: { title: '年度报告' } }
            ]
          },
          {
            path: 'comparison',
            name: 'AnalysisComparison',
            meta: { title: '对比报告' },
            redirect: '/analysis/comparison/region',
            children: [
              { path: 'region', name: 'AnalysisComparisonRegion', component: lazy('analysis/comparison/RegionComparison'), meta: { title: '区域对比' } },
              { path: 'industry', name: 'AnalysisComparisonIndustry', component: lazy('analysis/comparison/IndustryComparison'), meta: { title: '行业对比' } },
              { path: 'period', name: 'AnalysisComparisonPeriod', component: lazy('analysis/comparison/PeriodComparison'), meta: { title: '时期对比' } }
            ]
          },
          {
            path: 'ent-report',
            name: 'AnalysisEntReport',
            meta: { title: '企业报告' },
            redirect: '/analysis/ent-report/summary',
            children: [
              { path: 'summary', name: 'AnalysisEntReportSummary', component: lazy('analysis/ent-report/EnterpriseSummary'), meta: { title: '企业汇总' } },
              { path: 'detail', name: 'AnalysisEntReportDetail', component: lazy('analysis/ent-report/EnterpriseDetail'), meta: { title: '企业详情报告' } },
              { path: 'export', name: 'AnalysisEntReportExport', component: lazy('analysis/ent-report/ReportExport'), meta: { title: '报告导出' } }
            ]
          }
        ]
      },

      // ===== 模块四: 产业动态 =====
      {
        path: 'dynamics',
        name: 'Dynamics',
        meta: { title: '产业动态', icon: 'Notification' },
        redirect: '/dynamics/news',
        children: [
          { path: 'news', name: 'DynamicsNews', component: lazy('dynamics/IndustryNews'), meta: { title: '行业动态' } },
          { path: 'policy', name: 'DynamicsPolicy', component: lazy('dynamics/PolicyUpdate'), meta: { title: '政策速递' } },
          { path: 'event', name: 'DynamicsEvent', component: lazy('dynamics/IndustryEvent'), meta: { title: '产业事件' } },
          { path: 'insight', name: 'DynamicsInsight', component: lazy('dynamics/IndustryInsight'), meta: { title: '行业洞察' } }
        ]
      },

      // ===== 模块五: 区域对标 =====
      {
        path: 'benchmarking',
        name: 'Benchmarking',
        meta: { title: '区域对标', icon: 'Aim' },
        redirect: '/benchmarking/overview',
        children: [
          { path: 'overview', name: 'BenchmarkingOverview', component: lazy('benchmarking/BenchmarkingOverview'), meta: { title: '对标总览' } },
          { path: 'economy', name: 'BenchmarkingEconomy', component: lazy('benchmarking/EconomyCompare'), meta: { title: '经济对标' } },
          { path: 'industry', name: 'BenchmarkingIndustry', component: lazy('benchmarking/IndustryCompare'), meta: { title: '产业对标' } },
          { path: 'innovation', name: 'BenchmarkingInnovation', component: lazy('benchmarking/InnovationCompare'), meta: { title: '创新对标' } },
          { path: 'investment', name: 'BenchmarkingInvestment', component: lazy('benchmarking/InvestmentCompare'), meta: { title: '招商对标' } },
          { path: 'ranking', name: 'BenchmarkingRanking', component: lazy('benchmarking/RegionRanking'), meta: { title: '区域排名' } },
          { path: 'swot', name: 'BenchmarkingSwot', component: lazy('benchmarking/SwotAnalysis'), meta: { title: 'SWOT分析' } },
          { path: 'report', name: 'BenchmarkingReport', component: lazy('benchmarking/CompareReport'), meta: { title: '对标报告' } }
        ]
      },

      // ===== 模块六: 风险预警 =====
      {
        path: 'warning',
        name: 'Warning',
        meta: { title: '风险预警', icon: 'Warning' },
        redirect: '/warning/overview',
        children: [
          { path: 'overview', name: 'WarningOverview', component: lazy('warning/WarningOverview'), meta: { title: '预警总览' } },
          { path: 'enterprise', name: 'WarningEnterprise', component: lazy('warning/EnterpriseRisk'), meta: { title: '企业风险' } },
          { path: 'industry', name: 'WarningIndustry', component: lazy('warning/IndustryRisk'), meta: { title: '产业风险' } },
          { path: 'policy', name: 'WarningPolicy', component: lazy('warning/PolicyRisk'), meta: { title: '政策风险' } },
          { path: 'supply', name: 'WarningSupply', component: lazy('warning/SupplyChainRisk'), meta: { title: '供应链风险' } },
          { path: 'alert', name: 'WarningAlert', component: lazy('warning/RiskAlert'), meta: { title: '风险报警' } }
        ]
      },

      // ===== 模块七: 区域地图 =====
      {
        path: 'regional-map',
        name: 'RegionalMap',
        meta: { title: '区域地图', icon: 'MapLocation' },
        redirect: '/regional-map/overview',
        children: [
          { path: 'overview', name: 'RegionalMapOverview', component: lazy('regional-map/RegionalOverview'), meta: { title: '区域总览' } },
          { path: 'compare', name: 'RegionalMapCompare', component: lazy('regional-map/RegionalCompare'), meta: { title: '区域对比' } },
          { path: 'detail', name: 'RegionalMapDetail', component: lazy('regional-map/RegionalDetail'), meta: { title: '区域详情' } }
        ]
      },

      // ===== 模块八: 精准招商 =====
      {
        path: 'invest',
        name: 'Invest',
        meta: { title: '精准招商', icon: 'Opportunity' },
        redirect: '/invest/chain/target',
        children: [
          {
            path: 'chain',
            name: 'InvestChain',
            meta: { title: '产业链招商' },
            redirect: '/invest/chain/target',
            children: [
              { path: 'target', name: 'InvestChainTarget', component: lazy('invest/chain/TargetSelection'), meta: { title: '目标筛选' } },
              { path: 'match', name: 'InvestChainMatch', component: lazy('invest/chain/ChainMatch'), meta: { title: '链式匹配' } },
              { path: 'recommend', name: 'InvestChainRecommend', component: lazy('invest/chain/SmartRecommend'), meta: { title: '智能推荐' } },
              { path: 'result', name: 'InvestChainResult', component: lazy('invest/chain/RecommendResult'), meta: { title: '推荐结果' } }
            ]
          },
          {
            path: 'map',
            name: 'InvestMap',
            meta: { title: '地图招商' },
            redirect: '/invest/map/target',
            children: [
              { path: 'target', name: 'InvestMapTarget', component: lazy('invest/map/MapTarget'), meta: { title: '地图选商' } },
              { path: 'nearby', name: 'InvestMapNearby', component: lazy('invest/map/NearbySearch'), meta: { title: '周边搜索' } },
              { path: 'resource', name: 'InvestMapResource', component: lazy('invest/map/ResourceMatch'), meta: { title: '资源匹配' } },
              { path: 'result', name: 'InvestMapResult', component: lazy('invest/map/MapResult'), meta: { title: '招商结果' } }
            ]
          },
          {
            path: 'extension',
            name: 'InvestExtension',
            meta: { title: '补链招商' },
            redirect: '/invest/extension/analysis',
            children: [
              { path: 'analysis', name: 'InvestExtensionAnalysis', component: lazy('invest/extension/GapAnalysis'), meta: { title: '缺链分析' } },
              { path: 'target', name: 'InvestExtensionTarget', component: lazy('invest/extension/FillTarget'), meta: { title: '补链目标' } },
              { path: 'result', name: 'InvestExtensionResult', component: lazy('invest/extension/FillResult'), meta: { title: '补链结果' } }
            ]
          },
          {
            path: 'relation',
            name: 'InvestRelation',
            meta: { title: '关系链招商' },
            redirect: '/invest/relation/graph',
            children: [
              { path: 'graph', name: 'InvestRelationGraph', component: lazy('invest/relation/RelationGraph'), meta: { title: '关系图谱' } },
              { path: 'target', name: 'InvestRelationTarget', component: lazy('invest/relation/RelationTarget'), meta: { title: '关系目标' } },
              { path: 'result', name: 'InvestRelationResult', component: lazy('invest/relation/RelationResult'), meta: { title: '关系招商结果' } }
            ]
          },
          {
            path: 'merchant',
            name: 'InvestMerchant',
            meta: { title: '以商招商' },
            redirect: '/invest/merchant/anchor',
            children: [
              { path: 'anchor', name: 'InvestMerchantAnchor', component: lazy('invest/merchant/AnchorEnterprise'), meta: { title: '锚点企业' } },
              { path: 'derive', name: 'InvestMerchantDerive', component: lazy('invest/merchant/DeriveSearch'), meta: { title: '衍生搜索' } },
              { path: 'result', name: 'InvestMerchantResult', component: lazy('invest/merchant/MerchantResult'), meta: { title: '以商招商结果' } }
            ]
          },
          {
            path: 'listed',
            name: 'InvestListed',
            meta: { title: '榜单招商' },
            redirect: '/invest/listed/ranking',
            children: [
              { path: 'ranking', name: 'InvestListedRanking', component: lazy('invest/listed/RankingList'), meta: { title: '榜单列表' } },
              { path: 'detail', name: 'InvestListedDetail', component: lazy('invest/listed/RankingDetail'), meta: { title: '榜单详情' } },
              { path: 'target', name: 'InvestListedTarget', component: lazy('invest/listed/RankingTarget'), meta: { title: '榜单目标' } },
              { path: 'result', name: 'InvestListedResult', component: lazy('invest/listed/RankingResult'), meta: { title: '榜单招商结果' } }
            ]
          },
          {
            path: 'leading',
            name: 'InvestLeading',
            meta: { title: '龙头骨干' },
            redirect: '/invest/leading/overview',
            children: [
              { path: 'overview', name: 'InvestLeadingOverview', component: lazy('invest/leading/LeadingOverview'), meta: { title: '龙头总览' } },
              { path: 'detail', name: 'InvestLeadingDetail', component: lazy('invest/leading/LeadingDetail'), meta: { title: '龙头详情' } },
              { path: 'target', name: 'InvestLeadingTarget', component: lazy('invest/leading/LeadingTarget'), meta: { title: '龙头目标' } }
            ]
          },
          {
            path: 'qualified',
            name: 'InvestQualified',
            meta: { title: '资质企业' },
            redirect: '/invest/qualified/list',
            children: [
              { path: 'list', name: 'InvestQualifiedList', component: lazy('invest/qualified/QualifiedList'), meta: { title: '资质列表' } },
              { path: 'detail', name: 'InvestQualifiedDetail', component: lazy('invest/qualified/QualifiedDetail'), meta: { title: '资质详情' } },
              { path: 'target', name: 'InvestQualifiedTarget', component: lazy('invest/qualified/QualifiedTarget'), meta: { title: '资质企业目标' } }
            ]
          },
          {
            path: 'fund',
            name: 'InvestFund',
            meta: { title: '投行基金' },
            redirect: '/invest/fund/overview',
            children: [
              { path: 'overview', name: 'InvestFundOverview', component: lazy('invest/fund/FundOverview'), meta: { title: '基金总览' } },
              { path: 'detail', name: 'InvestFundDetail', component: lazy('invest/fund/FundDetail'), meta: { title: '基金详情' } },
              { path: 'target', name: 'InvestFundTarget', component: lazy('invest/fund/FundTarget'), meta: { title: '基金招商目标' } }
            ]
          },
          {
            path: 'research',
            name: 'InvestResearch',
            meta: { title: '科研机构' },
            redirect: '/invest/research/overview',
            children: [
              { path: 'overview', name: 'InvestResearchOverview', component: lazy('invest/research/ResearchOverview'), meta: { title: '机构总览' } },
              { path: 'detail', name: 'InvestResearchDetail', component: lazy('invest/research/ResearchDetail'), meta: { title: '机构详情' } },
              { path: 'target', name: 'InvestResearchTarget', component: lazy('invest/research/ResearchTarget'), meta: { title: '科研招商目标' } }
            ]
          },
          {
            path: 'owner',
            name: 'InvestOwner',
            meta: { title: '链主适配' },
            redirect: '/invest/owner/match',
            children: [
              { path: 'match', name: 'InvestOwnerMatch', component: lazy('invest/owner/ChainOwnerMatch'), meta: { title: '链主匹配' } },
              { path: 'detail', name: 'InvestOwnerDetail', component: lazy('invest/owner/ChainOwnerDetail'), meta: { title: '链主详情' } },
              { path: 'result', name: 'InvestOwnerResult', component: lazy('invest/owner/ChainOwnerResult'), meta: { title: '链主适配结果' } }
            ]
          },
          {
            path: 'park',
            name: 'InvestPark',
            meta: { title: '园区招商' },
            redirect: '/invest/park/overview',
            children: [
              { path: 'overview', name: 'InvestParkOverview', component: lazy('invest/park/ParkOverview'), meta: { title: '园区总览' } },
              { path: 'detail', name: 'InvestParkDetail', component: lazy('invest/park/ParkDetail'), meta: { title: '园区详情' } },
              { path: 'target', name: 'InvestParkTarget', component: lazy('invest/park/ParkTarget'), meta: { title: '园区招商目标' } }
            ]
          }
        ]
      },

      // ===== 模块九: 招商情报 =====
      {
        path: 'intelligence',
        name: 'Intelligence',
        meta: { title: '招商情报', icon: 'Bell' },
        redirect: '/intelligence/news',
        children: [
          { path: 'news', name: 'IntelligenceNews', component: lazy('intelligence/InvestNews'), meta: { title: '招商资讯' } },
          { path: 'project', name: 'IntelligenceProject', component: lazy('intelligence/ProjectInfo'), meta: { title: '项目信息' } },
          { path: 'technology', name: 'IntelligenceTech', component: lazy('intelligence/TechTransfer'), meta: { title: '技术转移' } },
          { path: 'qualification', name: 'IntelligenceQualification', component: lazy('intelligence/QualificationChange'), meta: { title: '资质变更' } },
          { path: 'capital', name: 'IntelligenceCapital', component: lazy('intelligence/CapitalFlow'), meta: { title: '资本动态' } },
          { path: 'talent', name: 'IntelligenceTalent', component: lazy('intelligence/TalentFlow'), meta: { title: '人才流动' } },
          { path: 'event', name: 'IntelligenceEvent', component: lazy('intelligence/InvestEvent'), meta: { title: '招商活动' } },
          { path: 'track', name: 'IntelligenceTrack', component: lazy('intelligence/IntelligenceTrack'), meta: { title: '情报追踪' } },
          { path: 'report', name: 'IntelligenceReport', component: lazy('intelligence/IntelligenceReport'), meta: { title: '情报报告' } }
        ]
      },

      // ===== 模块十: 企业监测 =====
      {
        path: 'monitor',
        name: 'Monitor',
        meta: { title: '企业监测', icon: 'Monitor' },
        redirect: '/monitor/overview/summary',
        children: [
          {
            path: 'overview',
            name: 'MonitorOverview',
            meta: { title: '总览' },
            redirect: '/monitor/overview/summary',
            children: [
              { path: 'summary', name: 'MonitorOverviewSummary', component: lazy('monitor/overview/MonitorSummary'), meta: { title: '监测总览' } },
              { path: 'dashboard', name: 'MonitorOverviewDashboard', component: lazy('monitor/overview/MonitorDashboard'), meta: { title: '监测仪表盘' } },
              { path: 'map', name: 'MonitorOverviewMap', component: lazy('monitor/overview/MonitorMap'), meta: { title: '监测地图' } }
            ]
          },
          {
            path: 'health',
            name: 'MonitorHealth',
            meta: { title: '健康度' },
            redirect: '/monitor/health/overview',
            children: [
              { path: 'overview', name: 'MonitorHealthOverview', component: lazy('monitor/health/HealthOverview'), meta: { title: '健康度总览' } },
              { path: 'detail', name: 'MonitorHealthDetail', component: lazy('monitor/health/HealthDetail'), meta: { title: '健康度详情' } },
              { path: 'trend', name: 'MonitorHealthTrend', component: lazy('monitor/health/HealthTrend'), meta: { title: '健康度趋势' } }
            ]
          },
          {
            path: 'rankings',
            name: 'MonitorRankings',
            meta: { title: '榜单' },
            redirect: '/monitor/rankings/revenue',
            children: [
              { path: 'revenue', name: 'MonitorRankingsRevenue', component: lazy('monitor/rankings/RevenueRanking'), meta: { title: '营收榜单' } },
              { path: 'growth', name: 'MonitorRankingsGrowth', component: lazy('monitor/rankings/GrowthRanking'), meta: { title: '成长榜单' } }
            ]
          },
          {
            path: 'filter',
            name: 'MonitorFilter',
            meta: { title: '筛选器' },
            redirect: '/monitor/filter/enterprise',
            children: [
              { path: 'enterprise', name: 'MonitorFilterEnterprise', component: lazy('monitor/filter/EnterpriseFilter'), meta: { title: '企业筛选' } },
              { path: 'industry', name: 'MonitorFilterIndustry', component: lazy('monitor/filter/IndustryFilter'), meta: { title: '行业筛选' } },
              { path: 'region', name: 'MonitorFilterRegion', component: lazy('monitor/filter/RegionFilter'), meta: { title: '区域筛选' } },
              { path: 'custom', name: 'MonitorFilterCustom', component: lazy('monitor/filter/CustomFilter'), meta: { title: '自定义筛选' } }
            ]
          },
          {
            path: 'portrait',
            name: 'MonitorPortrait',
            meta: { title: '画像' },
            redirect: '/monitor/portrait/overview',
            children: [
              { path: 'overview', name: 'MonitorPortraitOverview', component: lazy('monitor/portrait/PortraitOverview'), meta: { title: '画像总览' } },
              { path: 'detail', name: 'MonitorPortraitDetail', component: lazy('monitor/portrait/PortraitDetail'), meta: { title: '画像详情' } },
              { path: 'compare', name: 'MonitorPortraitCompare', component: lazy('monitor/portrait/PortraitCompare'), meta: { title: '画像对比' } }
            ]
          },
          {
            path: 'evaluation',
            name: 'MonitorEvaluation',
            meta: { title: '评价' },
            redirect: '/monitor/evaluation/index',
            children: [
              { path: 'index', name: 'MonitorEvaluationIndex', component: lazy('monitor/evaluation/EvaluationIndex'), meta: { title: '评价指数' } }
            ]
          }
        ]
      },

      // 404
      { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/error/404' },
      { path: '/error/404', name: 'Error404', component: lazy('error/404'), meta: { title: '页面不存在', requiresAuth: false } }
    ]
  }
]
