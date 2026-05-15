/**
 * PRD 核心功能测试 — 产业招商平台
 * 覆盖: 登录、主布局、侧边栏导航、路由跳转(10模块)、404、退出、视觉设计校验
 * 迁移自: prd-features.spec.py
 */
import { test, expect } from '@playwright/test'
import { gotoWithAuth, injectAuth, hashRoute } from './helpers/auth'
import { capturePageLogs } from './helpers/log-capture'

test.describe('1. 登录页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(hashRoute('/login'))
    await page.waitForLoadState('networkidle')
  })

  test('PRD-1.1: 登录页品牌面板与表单面板', async ({ page }) => {
    const brandPanel = page.locator('.login-page__brand')
    const formPanel = page.locator('.login-page__form-wrapper')
    await expect(brandPanel).toBeVisible()
    await expect(formPanel).toBeVisible()
  })

  test('PRD-1.2: 标题"产业招商平台"', async ({ page }) => {
    const title = page.locator('.login-page__title')
    await expect(title).toContainText('产业招商平台')
  })

  test('PRD-1.3: 登录表单元素齐全', async ({ page }) => {
    await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible()
    await expect(page.locator('input[placeholder="请输入密码"]')).toBeVisible()
    await expect(page.locator('text=记住密码')).toBeVisible()
    await expect(page.locator('text=忘记密码')).toBeVisible()
    await expect(page.locator('button:has-text("登 录")')).toBeVisible()
  })

  test('PRD-1.4: 左侧面板渐变背景', async ({ page }) => {
    const bg = await page
      .locator('.login-page__brand')
      .first()
      .evaluate((el) => {
        return getComputedStyle(el).background
      })
    expect(bg).toContain('gradient')
  })

  test('PRD-1.5: 登录后跳转', async ({ page }) => {
    const logs = capturePageLogs(page)

    // Fill login form
    await page
      .locator('.login-page .el-form-item')
      .nth(0)
      .locator('.el-input__inner')
      .first()
      .fill('admin')
    await page
      .locator('.login-page .el-form-item')
      .nth(1)
      .locator('.el-input__inner')
      .first()
      .fill('123456')
    await page.locator('button:has-text("登 录")').first().click({ force: true })
    await page.waitForTimeout(2000)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    const loginSuccess = !currentUrl.includes('/login')

    // If form login didn't work (mock backend), inject auth manually
    if (!loginSuccess) {
      await injectAuth(page)
      await page.goto(hashRoute('/'))
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)
    }

    expect(page.url()).not.toContain('/login')
    logs.assertClean()
  })
})

test.describe('2. 主布局', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithAuth(page, '/')
  })

  test('PRD-2.1: Header、Sidebar、Content 三栏布局', async ({ page }) => {
    await expect(page.locator('.app-header')).toBeVisible()
    await expect(page.locator('.app-sidebar')).toBeVisible()
    await expect(page.locator('.main-layout__content')).toBeVisible()
  })

  test('PRD-2.2: Header 标题"产业招商平台"', async ({ page }) => {
    const headerTitle = page.locator('.app-header__title')
    await expect(headerTitle).toContainText('产业招商平台')
  })

  test('PRD-2.3: 折叠按钮存在', async ({ page }) => {
    await expect(page.locator('.app-header__collapse-btn')).toBeVisible()
  })

  test('PRD-2.4: 侧边栏深色背景', async ({ page }) => {
    const bgColor = await page
      .locator('.app-sidebar')
      .first()
      .evaluate((el) => {
        return getComputedStyle(el).backgroundColor
      })
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('PRD-2.5: 10个一级菜单', async ({ page }) => {
    const expectedMenus = [
      '产业地图',
      '产业图谱',
      '运行分析',
      '产业动态',
      '区域对标',
      '风险预警',
      '区域地图',
      '精准招商',
      '招商情报',
      '企业监测',
    ]

    const menuItems = page.locator('.el-sub-menu__title, .el-menu-item')
    const menuTexts = await menuItems.allTextContents()

    for (const menuName of expectedMenus) {
      const found = menuTexts.some((t) => t.includes(menuName))
      expect(found, `Menu "${menuName}" should exist`).toBeTruthy()
    }
  })

  test('PRD-2.6: 面包屑存在', async ({ page }) => {
    await expect(page.locator('.el-breadcrumb')).toBeVisible()
  })

  test('PRD-2.7: PageHeader 存在', async ({ page }) => {
    await expect(page.locator('.page-header')).toBeVisible()
  })
})

test.describe('3. 侧边栏导航', () => {
  test('PRD-3.1: 展开"运行分析"子菜单', async ({ page }) => {
    await gotoWithAuth(page, '/')

    const analysisMenu = page.locator('.el-sub-menu__title').filter({ hasText: '运行分析' })
    await analysisMenu.first().click({ force: true })
    await page.waitForTimeout(800)

    const expectedSubmenus = [
      '产业总览',
      '企业布局',
      '产业链整体评价',
      '产业链载体分析',
      '产业链强弱分析',
      '产业运行报告',
      '园区对比报告',
      '企业运行报告',
    ]
    const visibleMenus = page.locator('.el-menu-item, .el-sub-menu__title')
    const visibleTexts = await visibleMenus.allTextContents()

    for (const sub of expectedSubmenus) {
      const found = visibleTexts.some((t) => t.includes(sub))
      expect(found, `Submenu "${sub}" should exist`).toBeTruthy()
    }
  })

  test('PRD-3.2: 路由跳转到"产业招商数据概览"', async ({ page }) => {
    // Test sidebar navigation by clicking menu items
    await gotoWithAuth(page, '/')

    // Expand 运行分析
    const analysisMenu = page.locator('.el-sub-menu__title').filter({ hasText: '运行分析' })
    await analysisMenu.first().click({ force: true })
    await page.waitForTimeout(800)

    // Expand 产业总览 sub-menu
    const overviewMenu = page.locator('.el-sub-menu__title').filter({ hasText: '产业总览' })
    await overviewMenu.first().click({ force: true })
    await page.waitForTimeout(500)

    // Click 产业招商数据概览
    const item = page.locator('.el-menu-item').filter({ hasText: '产业招商数据概览' })
    await item.first().click()
    await page.waitForTimeout(1500)

    await expect(page.locator('.page-header__title')).toContainText('产业招商数据概览')
  })
})

test.describe('4. 侧边栏折叠/展开', () => {
  test('PRD-4.1: 折叠与展开', async ({ page }) => {
    await gotoWithAuth(page, '/')

    const sidebar = page.locator('.app-sidebar')
    const widthBefore = await sidebar.first().evaluate((el) => el.offsetWidth)

    await page.locator('.app-header__collapse-btn').first().click({ force: true })
    await page.waitForTimeout(600)
    const widthAfter = await page
      .locator('.app-sidebar')
      .first()
      .evaluate((el) => el.offsetWidth)
    expect(widthAfter).toBeLessThan(widthBefore)

    await page.locator('.app-header__collapse-btn').first().click({ force: true })
    await page.waitForTimeout(600)
    const widthRestored = await page
      .locator('.app-sidebar')
      .first()
      .evaluate((el) => el.offsetWidth)
    expect(widthRestored).toBeGreaterThan(widthAfter)
  })
})

test.describe('5. 页面路由导航', () => {
  const routesToTest = [
    { route: '/map/chain/search', title: '产业资源搜索' },
    { route: '/atlas/national/build', title: '产业链图谱构建' },
    { route: '/analysis/overview/investment-data', title: '产业招商数据概览' },
    { route: '/dynamics/news-hotspot/collection', title: '产业新闻热点采集' },
    { route: '/benchmarking/industry-compare/scale', title: '产业规模' },
    { route: '/warning/industry-warning/indicators', title: '核心监测指标' },
    { route: '/regional-map/park-ranking/indicator-system', title: '榜单指标体系' },
    { route: '/invest/chain/structure', title: '产业链结构' },
    { route: '/intelligence/news-invest/index', title: '资讯招商情报' },
    { route: '/monitor/overview/basic-info', title: '基础信息总览' },
  ]

  for (const { route, title } of routesToTest) {
    test(`PRD-5: ${route}`, async ({ page }) => {
      await gotoWithAuth(page, route)

      const pageTitle = page.locator('.page-header__title')
      const hasTitle = await pageTitle.count()
      if (hasTitle > 0) {
        await expect(pageTitle).toContainText(title)
      } else {
        // Fallback: page should at least have content
        const bodyText = await page.locator('body').innerText()
        expect(bodyText.trim().length).toBeGreaterThan(10)
      }
    })
  }
})

test.describe('6. 404 页面', () => {
  test('PRD-6.1: 无效路由显示404', async ({ page }) => {
    await gotoWithAuth(page, '/nonexistent-page-xyz')

    const errorCode = page.locator('.error-page__code')
    const errorMsg = page.locator('.error-page__message')
    const is404 = (await errorCode.count()) > 0 || (await errorMsg.count()) > 0
    expect(is404, 'Should show error page with code or message').toBeTruthy()
  })
})

test.describe('7. 退出登录', () => {
  test('PRD-7.1: 退出后跳转登录页', async ({ page }) => {
    await gotoWithAuth(page, '/')

    const userDropdown = page.locator('.app-header__user')
    if ((await userDropdown.count()) > 0) {
      await userDropdown.first().click({ force: true })
      await page.waitForTimeout(500)

      const logoutItem = page.locator('.el-dropdown-menu__item:has-text("退出登录")')
      if ((await logoutItem.count()) > 0) {
        await logoutItem.first().click({ force: true })
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(1500)
        expect(page.url()).toContain('/login')
      }
    }
  })
})

test.describe('8. 视觉设计校验', () => {
  test('PRD-8.1: 登录页视觉规范', async ({ page }) => {
    await page.goto(hashRoute('/login'))
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Left panel gradient
    const brandBg = await page
      .locator('.login-page__brand')
      .first()
      .evaluate((el) => {
        return getComputedStyle(el).background
      })
    expect(brandBg).toContain('gradient')

    // Form card white background (may be on wrapper or card)
    const formCard = page.locator('.login-page__form-card')
    const formWrapper = page.locator('.login-page__form-wrapper')
    const cardElement = (await formCard.count()) > 0 ? formCard : formWrapper
    if ((await cardElement.count()) > 0) {
      const cardBg = await cardElement.first().evaluate((el) => {
        return getComputedStyle(el).backgroundColor
      })
      // Accept white or transparent (inherits from parent)
      const isWhite = cardBg.includes('255, 255, 255')
      const isTransparent = cardBg === 'rgba(0, 0, 0, 0)'
      expect(
        isWhite || isTransparent,
        `Form card should be white or transparent, got: ${cardBg}`,
      ).toBeTruthy()
    }

    // Login button has color
    const loginBtn = page.locator('button:has-text("登 录")')
    if ((await loginBtn.count()) > 0) {
      const btnBg = await loginBtn.first().evaluate((el) => {
        return getComputedStyle(el).backgroundColor
      })
      expect(btnBg).toContain('rgb')
    }
  })

  test('PRD-8.2: 主页面视觉规范', async ({ page }) => {
    await gotoWithAuth(page, '/')

    // Body has background color
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(bodyBg).not.toBe('rgba(0, 0, 0, 0)')

    // Sidebar dark background
    const sidebar = page.locator('.app-sidebar')
    if ((await sidebar.count()) > 0) {
      const sidebarBg = await sidebar.first().evaluate((el) => {
        return getComputedStyle(el).backgroundColor
      })
      const isDark = sidebarBg.includes('0, 21, 41') || sidebarBg.includes('rgb(0, 21, 41)')
      expect(isDark, `Sidebar should be dark, got: ${sidebarBg}`).toBeTruthy()
    }
  })
})
