/**
 * Phase 4 功能测试 — 产业招商平台
 * 测试范围: 产业动态(4) + 区域对标(8) + 风险预警(6) + 区域地图(3)
 *          + 精准招商(39) + 招商情报(9) + 企业监测(16) = 85页
 * 迁移自: phase4-test.spec.py
 */
import { test, expect } from '@playwright/test'
import { gotoWithAuth } from './helpers/auth'
import { capturePageLogs } from './helpers/log-capture'
import type { RouteDef } from './helpers/types'

const DYNAMICS_ROUTES: RouteDef[] = [
  // 产业新闻热点 (2)
  { route: '/dynamics/news-hotspot/collection', title: '产业新闻热点采集', pageType: 'list' },
  { route: '/dynamics/news-hotspot/analysis', title: '产业新闻热点智能分析', pageType: 'list' },
  // 产业政策规划 (2)
  { route: '/dynamics/policy-plan/compilation', title: '政策汇编', pageType: 'list' },
  { route: '/dynamics/policy-plan/monitoring', title: '政策实施监测', pageType: 'list' },
]

const BENCHMARKING_ROUTES: RouteDef[] = [
  // 产业对比分析 (5)
  { route: '/benchmarking/industry-compare/scale', title: '产业规模', pageType: 'dashboard' },
  { route: '/benchmarking/industry-compare/structure', title: '产业结构', pageType: 'dashboard' },
  { route: '/benchmarking/industry-compare/benefit', title: '经济效益', pageType: 'dashboard' },
  { route: '/benchmarking/industry-compare/innovation', title: '创新能力', pageType: 'dashboard' },
  { route: '/benchmarking/industry-compare/talent', title: '人才资源', pageType: 'dashboard' },
  // 产业占比分析 (3)
  {
    route: '/benchmarking/proportion-analysis/global-distribution',
    title: '全局产业分布',
    pageType: 'dashboard',
  },
  { route: '/benchmarking/proportion-analysis/heatmap', title: '地图热力图', pageType: 'map' },
  {
    route: '/benchmarking/proportion-analysis/dashboard',
    title: '动态数据看板',
    pageType: 'dashboard',
  },
]

const WARNING_ROUTES: RouteDef[] = [
  // 产业发展预警 (3)
  { route: '/warning/industry-warning/indicators', title: '核心监测指标', pageType: 'dashboard' },
  { route: '/warning/industry-warning/threshold', title: '动态阈值设定', pageType: 'dashboard' },
  { route: '/warning/industry-warning/model', title: '预警分析模型', pageType: 'dashboard' },
  // 企业外迁预警 (3)
  {
    route: '/warning/relocation-warning/indicator-system',
    title: '预警指标体系',
    pageType: 'dashboard',
  },
  { route: '/warning/relocation-warning/risk-signal', title: '间接风险信号', pageType: 'list' },
  {
    route: '/warning/relocation-warning/scoring-model',
    title: '风险评分模型',
    pageType: 'dashboard',
  },
]

const REGIONAL_MAP_ROUTES: RouteDef[] = [
  // 园区榜单 (3)
  {
    route: '/regional-map/park-ranking/indicator-system',
    title: '榜单指标体系',
    pageType: 'dashboard',
  },
  { route: '/regional-map/park-ranking/enterprise-ranking', title: '企业综合榜', pageType: 'list' },
  { route: '/regional-map/park-ranking/chain-ranking', title: '产业链协同榜', pageType: 'list' },
]

const INVEST_ROUTES: RouteDef[] = [
  // 产业链招商 (4)
  { route: '/invest/chain/structure', title: '产业链结构', pageType: 'dashboard' },
  { route: '/invest/chain/key-node', title: '关键节点', pageType: 'list' },
  { route: '/invest/chain/competitiveness', title: '竞争力评估', pageType: 'dashboard' },
  { route: '/invest/chain/smart-recommend', title: '目标企业智能推荐', pageType: 'list' },
  // 产业地图招商 (4)
  { route: '/invest/map-invest/resource-distribution', title: '产业资源分布', pageType: 'map' },
  { route: '/invest/map-invest/space-atlas', title: '产业链空间图谱', pageType: 'map' },
  { route: '/invest/map-invest/advantage-identify', title: '优势环节识别', pageType: 'map' },
  { route: '/invest/map-invest/extension-recommend', title: '延伸方向推荐', pageType: 'list' },
  // 强延补链招商 (3)
  { route: '/invest/strengthen/benchmark', title: '对标管理工具', pageType: 'dashboard' },
  { route: '/invest/strengthen/gap-diagnosis', title: '缺口智能诊断', pageType: 'dashboard' },
  { route: '/invest/strengthen/fill-target', title: '补链目标库', pageType: 'list' },
  // 关系链招商 (3)
  { route: '/invest/relation/graph', title: '关系图谱', pageType: 'graph' },
  { route: '/invest/relation/radiation', title: '链主企业辐射力分析', pageType: 'dashboard' },
  { route: '/invest/relation/secondary', title: '二级关联招商', pageType: 'list' },
  // 以商招商 (3)
  { route: '/invest/merchant/driving-portrait', title: '带动能力画像', pageType: 'dashboard' },
  { route: '/invest/merchant/eco-network', title: '生态网络挖掘', pageType: 'graph' },
  { route: '/invest/merchant/incentive-policy', title: '招商激励政策', pageType: 'list' },
  // 名企榜单招商 (4)
  { route: '/invest/ranking/vertical', title: '垂直榜单', pageType: 'list' },
  { route: '/invest/ranking/featured', title: '特色榜单', pageType: 'list' },
  { route: '/invest/ranking/empower-tool', title: '榜单赋能招商工具', pageType: 'list' },
  { route: '/invest/ranking/brand-linkage', title: '品牌联动与传播', pageType: 'list' },
  // 龙头骨干招商 (3)
  { route: '/invest/leading/identify', title: '龙头骨干企业识别与评估', pageType: 'dashboard' },
  { route: '/invest/leading/strategy', title: '精准招商策略生成', pageType: 'dashboard' },
  { route: '/invest/leading/eco-build', title: '生态构建与协同', pageType: 'dashboard' },
  // 资质企业招商 (3)
  { route: '/invest/qualified/smart-identify', title: '资质企业智能识别', pageType: 'list' },
  { route: '/invest/qualified/demand-portrait', title: '资质企业需求画像', pageType: 'dashboard' },
  { route: '/invest/qualified/resource-match', title: '资源智能匹配', pageType: 'list' },
  // 投行基金招商 (3)
  { route: '/invest/fund/guide', title: '产业基金引导', pageType: 'dashboard' },
  { route: '/invest/fund/project-lib', title: '项目库管理', pageType: 'list' },
  { route: '/invest/fund/capital-docking', title: '资本对接', pageType: 'dashboard' },
  // 科研机构招商 (3)
  { route: '/invest/research/panorama', title: '科研资源全景库', pageType: 'dashboard' },
  { route: '/invest/research/tech-transfer', title: '技术转化潜力评估', pageType: 'dashboard' },
  { route: '/invest/research/talent-mechanism', title: '人才流动与共享机制', pageType: 'list' },
  // 链主适配招商 (3)
  { route: '/invest/chain-owner/portrait', title: '链主画像与需求解析', pageType: 'dashboard' },
  { route: '/invest/chain-owner/gap-diagnosis', title: '产业链缺口诊断', pageType: 'dashboard' },
  { route: '/invest/chain-owner/smart-match', title: '适配企业智能匹配', pageType: 'list' },
  // 园区招商 (3)
  { route: '/invest/park/panorama', title: '园区资源全景展示', pageType: 'dashboard' },
  { route: '/invest/park/smart-match', title: '智能企业匹配引擎', pageType: 'list' },
  { route: '/invest/park/chain-collaborate', title: '产业链协同招商', pageType: 'list' },
]

const INTELLIGENCE_ROUTES: RouteDef[] = [
  // 资讯招商情报 (1)
  { route: '/intelligence/news-invest/index', title: '资讯招商情报', pageType: 'list' },
  // 项目招商情报 (1)
  { route: '/intelligence/project-invest/index', title: '项目招商情报', pageType: 'list' },
  // 技术招商情报 (1)
  { route: '/intelligence/tech-invest/index', title: '技术招商情报', pageType: 'list' },
  // 资质招商情报 (1)
  { route: '/intelligence/qual-invest/index', title: '资质招商情报', pageType: 'list' },
  // 资本招商情报 (1)
  { route: '/intelligence/capital-invest/index', title: '资本招商情报', pageType: 'list' },
  // 招商风险监测 (2)
  { route: '/intelligence/risk-monitor/monitor', title: '招商风险监测', pageType: 'dashboard' },
  {
    route: '/intelligence/risk-monitor/classification',
    title: '风险分类体系',
    pageType: 'dashboard',
  },
  // 招商情报搜索 (1)
  { route: '/intelligence/search/index', title: '招商情报搜索', pageType: 'list' },
  // 我的招商情报 (1)
  { route: '/intelligence/mine/index', title: '我的招商情报', pageType: 'list' },
]

const MONITOR_ROUTES: RouteDef[] = [
  // 企业总览 (3)
  { route: '/monitor/overview/basic-info', title: '基础信息总览', pageType: 'dashboard' },
  {
    route: '/monitor/overview/economic-contribution',
    title: '经济贡献分析',
    pageType: 'dashboard',
  },
  { route: '/monitor/overview/dynamic-ranking', title: '动态排名', pageType: 'list' },
  // 经营健康度监测 (3)
  { route: '/monitor/health/key-dashboard', title: '关键指标看板', pageType: 'dashboard' },
  { route: '/monitor/health/chain-collaborate', title: '产业链协同监测', pageType: 'dashboard' },
  { route: '/monitor/health/sustainable', title: '可持续发展监测', pageType: 'dashboard' },
  // 企业榜单 (2)
  { route: '/monitor/rankings/multi-source', title: '多源榜单动态整合', pageType: 'list' },
  {
    route: '/monitor/rankings/fluctuation-warning',
    title: '榜单波动预警体系',
    pageType: 'dashboard',
  },
  // 企业筛选器 (4)
  { route: '/monitor/filter/basic-info', title: '基础信息筛选', pageType: 'list' },
  { route: '/monitor/filter/business-qual', title: '经营与资质筛选', pageType: 'list' },
  { route: '/monitor/filter/chain-relation', title: '产业链关联筛选', pageType: 'list' },
  { route: '/monitor/filter/risk-compliance', title: '风险与合规筛选', pageType: 'list' },
  // 企业画像 (3)
  { route: '/monitor/portrait/health-index', title: '企业健康指数', pageType: 'dashboard' },
  { route: '/monitor/portrait/multi-dimension', title: '多维度画像', pageType: 'dashboard' },
  { route: '/monitor/portrait/chain-relation', title: '产业链关联', pageType: 'dashboard' },
  // 企业综合评价 (1)
  { route: '/monitor/evaluation/five-dimension', title: '五维评价模型', pageType: 'dashboard' },
]

// Helper: type-specific assertions
async function assertPageType(
  page: import('@playwright/test').Page,
  pageType: RouteDef['pageType'],
) {
  if (pageType === 'dashboard') {
    const statCount = await page.locator('.stat-card').count()
    const chartCount = await page.locator('.base-chart').count()
    const chartPanelCount = await page.locator('.chart-panel').count()
    const canvasCount = await page.locator('canvas').count()
    const tableCount = await page.locator('.el-table').count()
    const cardCount = await page.locator('.el-card').count()
    const formCount = await page.locator('.el-form').count()
    const hasDashboard =
      statCount > 0 ||
      chartCount > 0 ||
      chartPanelCount > 0 ||
      canvasCount > 0 ||
      tableCount > 0 ||
      cardCount > 0 ||
      formCount > 0
    expect(hasDashboard, '页面内容应存在').toBeTruthy()
  } else if (pageType === 'list') {
    const tableCount = await page.locator('.el-table').count()
    const cardCount = await page.locator('.el-card').count()
    const listItemCount = await page
      .locator('.list-item, .news-item, .project-card, .enterprise-card')
      .count()
    const searchCount = await page.locator('input[type="text"], .el-input').count()
    const hasList = tableCount > 0 || cardCount > 0 || listItemCount > 0 || searchCount > 0
    expect(hasList, '列表/表格/搜索内容应存在').toBeTruthy()
  } else if (pageType === 'map') {
    const mapCount = await page.locator('.maptalks-map').count()
    expect(mapCount, '地图容器应渲染').toBeGreaterThan(0)
  } else if (pageType === 'graph') {
    const svgCount = await page.locator('svg').count()
    const graphCanvasCount = await page.locator('.graph-page__canvas').count()
    const hasGraph = svgCount > 0 || graphCanvasCount > 0
    expect(hasGraph, '关系图应渲染').toBeTruthy()
  }
}

// Shared test factory for a group of routes
function testRouteGroup(describeName: string, routes: RouteDef[]) {
  test.describe(`Phase 4: ${describeName}`, () => {
    for (const { route, title, pageType } of routes) {
      test(`${title} (${route})`, async ({ page }) => {
        const logs = capturePageLogs(page)
        await gotoWithAuth(page, route)

        // Not redirected to login
        expect(page.url()).not.toContain('/login')
        // Not 404
        expect(page.url()).not.toContain('error/404')
        // Page has content
        const bodyText = await page.locator('body').innerText()
        expect(bodyText.trim().length, '页面不应为空').toBeGreaterThan(5)

        // PageHeader or h2
        const headerCount = await page.locator('.page-header').count()
        const h2Count = await page.locator('h2').count()
        expect(headerCount + h2Count, 'PageHeader 或 h2 应存在').toBeGreaterThan(0)

        // Type-specific assertions
        await assertPageType(page, pageType)

        logs.assertClean()
      })
    }
  })
}

testRouteGroup('产业动态', DYNAMICS_ROUTES)
testRouteGroup('区域对标', BENCHMARKING_ROUTES)
testRouteGroup('风险预警', WARNING_ROUTES)
testRouteGroup('区域地图', REGIONAL_MAP_ROUTES)
testRouteGroup('精准招商', INVEST_ROUTES)
testRouteGroup('招商情报', INTELLIGENCE_ROUTES)
testRouteGroup('企业监测', MONITOR_ROUTES)
