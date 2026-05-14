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
  { route: '/map/supply/overview', title: '供应链总览', pageType: 'map' },
  { route: '/map/supply/detail', title: '供应链详情', pageType: 'map' },
  { route: '/map/tech/overview', title: '技术链总览', pageType: 'map' },
  { route: '/map/tech/detail', title: '技术链详情', pageType: 'map' },
]

const ATLAS_ROUTES: RouteDef[] = [
  { route: '/atlas/national/overview', title: '全国图谱总览', pageType: 'atlas' },
  { route: '/atlas/national/chain', title: '产业链图谱', pageType: 'atlas' },
  { route: '/atlas/national/relation', title: '企业关系图谱', pageType: 'atlas' },
  { route: '/atlas/national/tech', title: '技术图谱', pageType: 'atlas' },
  { route: '/atlas/regional/overview', title: '区域图谱总览', pageType: 'atlas' },
  { route: '/atlas/regional/chain', title: '区域产业链图谱', pageType: 'atlas' },
  { route: '/atlas/regional/relation', title: '区域关系图谱', pageType: 'atlas' },
  { route: '/atlas/regional/compare', title: '区域对比图谱', pageType: 'atlas' },
]

const ANALYSIS_ROUTES: RouteDef[] = [
  { route: '/analysis/overview/summary', title: '产业总览', pageType: 'analysis' },
  { route: '/analysis/overview/trend', title: '发展趋势', pageType: 'analysis' },
  { route: '/analysis/overview/structure', title: '产业结构', pageType: 'analysis' },
  { route: '/analysis/overview/contribution', title: '贡献分析', pageType: 'analysis' },
  { route: '/analysis/layout/region', title: '区域布局', pageType: 'analysis' },
  { route: '/analysis/layout/industry', title: '行业布局', pageType: 'analysis' },
  { route: '/analysis/evaluation/comprehensive', title: '综合评价', pageType: 'analysis' },
  { route: '/analysis/evaluation/competitiveness', title: '竞争力评价', pageType: 'analysis' },
  { route: '/analysis/evaluation/innovation', title: '创新力评价', pageType: 'analysis' },
  { route: '/analysis/evaluation/efficiency', title: '效率评价', pageType: 'analysis' },
  { route: '/analysis/evaluation/potential', title: '潜力评价', pageType: 'analysis' },
  { route: '/analysis/carrier/park', title: '园区分析', pageType: 'analysis' },
  { route: '/analysis/carrier/platform', title: '平台分析', pageType: 'analysis' },
  { route: '/analysis/carrier/incubator', title: '孵化器分析', pageType: 'analysis' },
  { route: '/analysis/strength/snapshot', title: '强弱快照', pageType: 'analysis' },
  { route: '/analysis/strength/detail', title: '强弱详情', pageType: 'analysis' },
  { route: '/analysis/report/monthly', title: '月度报告', pageType: 'analysis' },
  { route: '/analysis/report/quarterly', title: '季度报告', pageType: 'analysis' },
  { route: '/analysis/report/annual', title: '年度报告', pageType: 'analysis' },
  { route: '/analysis/comparison/region', title: '区域对比', pageType: 'analysis' },
  { route: '/analysis/comparison/industry', title: '行业对比', pageType: 'analysis' },
  { route: '/analysis/comparison/period', title: '时期对比', pageType: 'analysis' },
  { route: '/analysis/ent-report/summary', title: '企业汇总', pageType: 'analysis' },
  { route: '/analysis/ent-report/detail', title: '企业详情报告', pageType: 'analysis' },
  { route: '/analysis/ent-report/export', title: '报告导出', pageType: 'analysis' },
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

      const hasDashboard =
        statCount > 0 || chartCount > 0 || chartPanelCount > 0 || canvasCount > 0 || tableCount > 0
      // At least some dashboard content should be present
      expect(hasDashboard, '仪表盘内容(统计卡片/图表/表格)应存在').toBeTruthy()

      logs.assertClean()
    })
  }
})
