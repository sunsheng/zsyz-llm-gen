/**
 * Phase 4 功能测试 — 产业招商平台
 * 测试范围: 产业动态(4) + 区域对标(8) + 风险预警(6) + 区域地图(3)
 *          + 精准招商(39) + 招商情报(9) + 企业监测(17) = 86页
 * 迁移自: phase4-test.spec.py
 */
import { test, expect } from '@playwright/test'
import { ensureAuth } from './helpers/auth'
import { capturePageLogs } from './helpers/log-capture'
import type { RouteDef } from './helpers/types'

const DYNAMICS_ROUTES: RouteDef[] = [
  { route: '/dynamics/news', title: '行业动态', pageType: 'list' },
  { route: '/dynamics/policy', title: '政策速递', pageType: 'list' },
  { route: '/dynamics/event', title: '产业事件', pageType: 'list' },
  { route: '/dynamics/insight', title: '行业洞察', pageType: 'list' },
]

const BENCHMARKING_ROUTES: RouteDef[] = [
  { route: '/benchmarking/overview', title: '对标总览', pageType: 'dashboard' },
  { route: '/benchmarking/economy', title: '经济对标', pageType: 'dashboard' },
  { route: '/benchmarking/industry', title: '产业对标', pageType: 'dashboard' },
  { route: '/benchmarking/innovation', title: '创新对标', pageType: 'dashboard' },
  { route: '/benchmarking/investment', title: '招商对标', pageType: 'dashboard' },
  { route: '/benchmarking/ranking', title: '区域排名', pageType: 'list' },
  { route: '/benchmarking/swot', title: 'SWOT分析', pageType: 'dashboard' },
  { route: '/benchmarking/report', title: '对标报告', pageType: 'dashboard' },
]

const WARNING_ROUTES: RouteDef[] = [
  { route: '/warning/overview', title: '预警总览', pageType: 'dashboard' },
  { route: '/warning/enterprise', title: '企业风险', pageType: 'list' },
  { route: '/warning/industry', title: '产业风险', pageType: 'dashboard' },
  { route: '/warning/policy', title: '政策风险', pageType: 'dashboard' },
  { route: '/warning/supply', title: '供应链风险', pageType: 'dashboard' },
  { route: '/warning/alert', title: '风险报警', pageType: 'list' },
]

const REGIONAL_MAP_ROUTES: RouteDef[] = [
  { route: '/regional-map/overview', title: '区域总览', pageType: 'dashboard' },
  { route: '/regional-map/compare', title: '区域对比', pageType: 'dashboard' },
  { route: '/regional-map/detail', title: '区域详情', pageType: 'dashboard' },
]

const INVEST_ROUTES: RouteDef[] = [
  { route: '/invest/chain/target', title: '目标筛选', pageType: 'list' },
  { route: '/invest/chain/match', title: '链式匹配', pageType: 'list' },
  { route: '/invest/chain/recommend', title: '智能推荐', pageType: 'list' },
  { route: '/invest/chain/result', title: '推荐结果', pageType: 'list' },
  { route: '/invest/map/target', title: '地图选商', pageType: 'map' },
  { route: '/invest/map/nearby', title: '周边搜索', pageType: 'map' },
  { route: '/invest/map/resource', title: '资源匹配', pageType: 'map' },
  { route: '/invest/map/result', title: '招商结果', pageType: 'list' },
  { route: '/invest/extension/analysis', title: '缺链分析', pageType: 'dashboard' },
  { route: '/invest/extension/target', title: '补链目标', pageType: 'list' },
  { route: '/invest/extension/result', title: '补链结果', pageType: 'list' },
  { route: '/invest/relation/graph', title: '关系图谱', pageType: 'graph' },
  { route: '/invest/relation/target', title: '关系目标', pageType: 'list' },
  { route: '/invest/relation/result', title: '关系招商结果', pageType: 'list' },
  { route: '/invest/merchant/anchor', title: '锚点企业', pageType: 'list' },
  { route: '/invest/merchant/derive', title: '衍生搜索', pageType: 'list' },
  { route: '/invest/merchant/result', title: '以商招商结果', pageType: 'list' },
  { route: '/invest/listed/ranking', title: '榜单列表', pageType: 'list' },
  { route: '/invest/listed/detail', title: '榜单详情', pageType: 'list' },
  { route: '/invest/listed/target', title: '榜单目标', pageType: 'list' },
  { route: '/invest/listed/result', title: '榜单招商结果', pageType: 'list' },
  { route: '/invest/leading/overview', title: '龙头总览', pageType: 'dashboard' },
  { route: '/invest/leading/detail', title: '龙头详情', pageType: 'dashboard' },
  { route: '/invest/leading/target', title: '龙头目标', pageType: 'list' },
  { route: '/invest/qualified/list', title: '资质列表', pageType: 'list' },
  { route: '/invest/qualified/detail', title: '资质详情', pageType: 'dashboard' },
  { route: '/invest/qualified/target', title: '资质企业目标', pageType: 'list' },
  { route: '/invest/fund/overview', title: '基金总览', pageType: 'dashboard' },
  { route: '/invest/fund/detail', title: '基金详情', pageType: 'dashboard' },
  { route: '/invest/fund/target', title: '基金招商目标', pageType: 'list' },
  { route: '/invest/research/overview', title: '机构总览', pageType: 'dashboard' },
  { route: '/invest/research/detail', title: '机构详情', pageType: 'dashboard' },
  { route: '/invest/research/target', title: '科研招商目标', pageType: 'list' },
  { route: '/invest/owner/match', title: '链主匹配', pageType: 'list' },
  { route: '/invest/owner/detail', title: '链主详情', pageType: 'dashboard' },
  { route: '/invest/owner/result', title: '链主适配结果', pageType: 'list' },
  { route: '/invest/park/overview', title: '园区总览', pageType: 'dashboard' },
  { route: '/invest/park/detail', title: '园区详情', pageType: 'dashboard' },
  { route: '/invest/park/target', title: '园区招商目标', pageType: 'list' },
]

const INTELLIGENCE_ROUTES: RouteDef[] = [
  { route: '/intelligence/news', title: '招商资讯', pageType: 'list' },
  { route: '/intelligence/project', title: '项目信息', pageType: 'list' },
  { route: '/intelligence/technology', title: '技术转移', pageType: 'list' },
  { route: '/intelligence/qualification', title: '资质变更', pageType: 'list' },
  { route: '/intelligence/capital', title: '资本动态', pageType: 'list' },
  { route: '/intelligence/talent', title: '人才流动', pageType: 'list' },
  { route: '/intelligence/event', title: '招商活动', pageType: 'list' },
  { route: '/intelligence/track', title: '情报追踪', pageType: 'list' },
  { route: '/intelligence/report', title: '情报报告', pageType: 'dashboard' },
]

const MONITOR_ROUTES: RouteDef[] = [
  { route: '/monitor/overview/summary', title: '监测总览', pageType: 'dashboard' },
  { route: '/monitor/overview/dashboard', title: '监测仪表盘', pageType: 'dashboard' },
  { route: '/monitor/overview/map', title: '监测地图', pageType: 'map' },
  { route: '/monitor/health/overview', title: '健康度总览', pageType: 'dashboard' },
  { route: '/monitor/health/detail', title: '健康度详情', pageType: 'dashboard' },
  { route: '/monitor/health/trend', title: '健康度趋势', pageType: 'dashboard' },
  { route: '/monitor/rankings/revenue', title: '营收榜单', pageType: 'list' },
  { route: '/monitor/rankings/growth', title: '成长榜单', pageType: 'list' },
  { route: '/monitor/filter/enterprise', title: '企业筛选', pageType: 'list' },
  { route: '/monitor/filter/industry', title: '行业筛选', pageType: 'list' },
  { route: '/monitor/filter/region', title: '区域筛选', pageType: 'list' },
  { route: '/monitor/filter/custom', title: '自定义筛选', pageType: 'list' },
  { route: '/monitor/portrait/overview', title: '画像总览', pageType: 'dashboard' },
  { route: '/monitor/portrait/detail', title: '画像详情', pageType: 'dashboard' },
  { route: '/monitor/portrait/compare', title: '画像对比', pageType: 'dashboard' },
  { route: '/monitor/evaluation/index', title: '评价指数', pageType: 'dashboard' },
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
    const hasDashboard =
      statCount > 0 || chartCount > 0 || chartPanelCount > 0 || canvasCount > 0 || tableCount > 0
    expect(hasDashboard, '仪表盘内容应存在').toBeTruthy()
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
        await ensureAuth(page)
        await page.goto(route)
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(2500)

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
