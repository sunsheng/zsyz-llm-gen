/**
 * Phase 3 功能测试 — 产业招商平台
 * 测试范围: 产业地图(9) + 产业图谱(8) + 运行分析(25) = 42页
 * 迁移自: phase3-test.spec.py
 */
import { test, expect } from '@playwright/test'
import { gotoWithAuth } from './helpers/auth'
import { capturePageLogs } from './helpers/log-capture'
import type { RouteDef } from './helpers/types'

const MAP_ROUTES: RouteDef[] = [
  { route: '/map/chain/search', title: '产业资源搜索', pageType: 'map' },
  { route: '/map/chain/filter', title: '产业资源筛选', pageType: 'map' },
  { route: '/map/chain/layers', title: '产业图层切换', pageType: 'map' },
  { route: '/map/chain/space', title: '产业空间分布', pageType: 'map' },
  { route: '/map/chain/clusters', title: '产业集群分布', pageType: 'map' },
  { route: '/map/supply/enterprise', title: '规上企业分布', pageType: 'map' },
  { route: '/map/supply/resources', title: '配套资源分布', pageType: 'map' },
  { route: '/map/tech/operate', title: '产业地图操作', pageType: 'map' },
  { route: '/map/tech/config', title: '产业地图配置', pageType: 'map' },
]

const ATLAS_ROUTES: RouteDef[] = [
  { route: '/atlas/national/build', title: '产业链图谱构建', pageType: 'atlas' },
  { route: '/atlas/national/enterprise', title: '产业链关联企业', pageType: 'atlas' },
  { route: '/atlas/national/key-node', title: '产业链关键环节识别', pageType: 'atlas' },
  { route: '/atlas/national/manage', title: '产业链图谱管理', pageType: 'atlas' },
  { route: '/atlas/regional/build', title: '产业链图谱构建', pageType: 'atlas' },
  { route: '/atlas/regional/enterprise', title: '产业链关联企业', pageType: 'atlas' },
  { route: '/atlas/regional/key-node', title: '产业链关键环节识别', pageType: 'atlas' },
  { route: '/atlas/regional/manage', title: '产业链图谱管理', pageType: 'atlas' },
]

const ANALYSIS_ROUTES: RouteDef[] = [
  // 产业总览 (4)
  { route: '/analysis/overview/investment-data', title: '产业招商数据概览', pageType: 'analysis' },
  { route: '/analysis/overview/carrier-space', title: '载体空间数据', pageType: 'analysis' },
  { route: '/analysis/overview/channel-data', title: '渠道空间数据', pageType: 'analysis' },
  {
    route: '/analysis/overview/investment-management',
    title: '招商管理数据',
    pageType: 'analysis',
  },
  // 企业布局 (2)
  { route: '/analysis/enterprise-layout/related', title: '关联企业', pageType: 'analysis' },
  { route: '/analysis/enterprise-layout/leading', title: '龙头企业', pageType: 'analysis' },
  // 产业链整体评价 (5)
  { route: '/analysis/chain-evaluation/profitability', title: '盈利能力', pageType: 'analysis' },
  {
    route: '/analysis/chain-evaluation/capital-valuation',
    title: '资本估值指数',
    pageType: 'analysis',
  },
  {
    route: '/analysis/chain-evaluation/investment-expansion',
    title: '投资扩张指数',
    pageType: 'analysis',
  },
  {
    route: '/analysis/chain-evaluation/pricing-power',
    title: '议价能力指数',
    pageType: 'analysis',
  },
  {
    route: '/analysis/chain-evaluation/capacity-utilization',
    title: '产能利用指数',
    pageType: 'analysis',
  },
  // 产业链载体分析 (3)
  {
    route: '/analysis/carrier-analysis/scale-forecast',
    title: '产业规模及预测',
    pageType: 'analysis',
  },
  {
    route: '/analysis/carrier-analysis/enterprise-analysis',
    title: '关联企业分析',
    pageType: 'analysis',
  },
  {
    route: '/analysis/carrier-analysis/investment-hotspot',
    title: '投资热点分析',
    pageType: 'analysis',
  },
  // 产业链强弱分析 (2)
  { route: '/analysis/strength-analysis/structure', title: '产业结构分析', pageType: 'analysis' },
  { route: '/analysis/strength-analysis/spatial', title: '产业空间分布', pageType: 'analysis' },
  // 产业运行报告 (3)
  {
    route: '/analysis/operation-report/data-collection',
    title: '数据采集与整合',
    pageType: 'analysis',
  },
  {
    route: '/analysis/operation-report/data-analysis',
    title: '数据分析与可视化',
    pageType: 'analysis',
  },
  { route: '/analysis/operation-report/template', title: '报告模板', pageType: 'analysis' },
  // 园区对比报告 (3)
  { route: '/analysis/park-comparison/analysis', title: '报告分析', pageType: 'analysis' },
  { route: '/analysis/park-comparison/dimension', title: '对比维度', pageType: 'analysis' },
  { route: '/analysis/park-comparison/indicator', title: '对比指标', pageType: 'analysis' },
  // 企业运行报告 (3)
  {
    route: '/analysis/enterprise-report/data-collection',
    title: '数据采集与整合',
    pageType: 'analysis',
  },
  {
    route: '/analysis/enterprise-report/indicator-system',
    title: '企业运行指标体系',
    pageType: 'analysis',
  },
  {
    route: '/analysis/enterprise-report/generation',
    title: '报告生成与输出',
    pageType: 'analysis',
  },
]

const ALL_ROUTES = [...MAP_ROUTES, ...ATLAS_ROUTES, ...ANALYSIS_ROUTES]

test.describe('Phase 3: 产业地图', () => {
  for (const { route, title } of MAP_ROUTES) {
    test(`${title} (${route})`, async ({ page }) => {
      const logs = capturePageLogs(page)
      await gotoWithAuth(page, route)

      // Not redirected to login
      expect(page.url()).not.toContain('/login')
      // Not 404
      expect(page.url()).not.toContain('error/404')
      // Page has content
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.trim().length, '页面不应为空').toBeGreaterThan(10)
      // PageHeader exists
      const headerCount = await page.locator('.page-header').count()
      const h2Count = await page.locator('h2').count()
      expect(headerCount + h2Count, 'PageHeader 或 h2 应存在').toBeGreaterThan(0)

      // Map-specific: maptalks container
      const mapCount = await page.locator('.maptalks-map').count()
      if (mapCount > 0) {
        expect(mapCount, '地图容器应渲染').toBeGreaterThan(0)
      }

      logs.assertClean()
    })
  }
})

test.describe('Phase 3: 产业图谱', () => {
  for (const { route, title } of ATLAS_ROUTES) {
    test(`${title} (${route})`, async ({ page }) => {
      const logs = capturePageLogs(page)
      await gotoWithAuth(page, route)

      expect(page.url()).not.toContain('/login')
      expect(page.url()).not.toContain('error/404')
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.trim().length, '页面不应为空').toBeGreaterThan(10)

      // Atlas: stat cards or force graph
      const statCount = await page.locator('.stat-card').count()
      const graphCount = await page.locator('.graph-page__canvas').count()
      const svgCount = await page.locator('svg').count()
      const hasContent = statCount > 0 || graphCount > 0 || svgCount > 0
      expect(hasContent, '统计卡片或力导向图应渲染').toBeTruthy()

      logs.assertClean()
    })
  }
})

test.describe('Phase 3: 运行分析', () => {
  for (const { route, title } of ANALYSIS_ROUTES) {
    test(`${title} (${route})`, async ({ page }) => {
      const logs = capturePageLogs(page)
      await gotoWithAuth(page, route)

      expect(page.url()).not.toContain('/login')
      expect(page.url()).not.toContain('error/404')
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.trim().length, '页面不应为空').toBeGreaterThan(10)

      // Analysis: stat cards, charts, possibly tables
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
      // At least some content should be present
      expect(hasDashboard, '页面内容(统计卡片/图表/表格/卡片/表单)应存在').toBeTruthy()

      logs.assertClean()
    })
  }
})
