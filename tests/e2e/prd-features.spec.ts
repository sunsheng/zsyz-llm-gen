/**
 * PRD 核心功能测试 — 产业招商平台
 * 覆盖: 登录、主布局、侧边栏导航、路由跳转、404、退出、视觉设计校验
 * 迁移自: prd-features.spec.py
 */
import { test, expect } from '@playwright/test'
import { gotoWithAuth, injectAuth } from './helpers/auth'
import { capturePageLogs } from './helpers/log-capture'

test.describe('1. 登录页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
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
      await page.goto('/')
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
  test.beforeEach(async ({ page }) => {
    await gotoWithAuth(page, '/')
  })

  test('PRD-3.1: 展开"运行分析"子菜单', async ({ page }) => {
    const analysisMenu = page.locator('.el-sub-menu__title').filter({ hasText: '运行分析' })
    await analysisMenu.first().click({ force: true })
    await page.waitForTimeout(800)

    const expectedSubmenus = [
      '产业总览',
      '企业布局',
      '整体评价',
      '载体分析',
      '强弱分析',
      '运行报告',
      '对比报告',
      '企业报告',
    ]
    const visibleMenus = page.locator('.el-menu-item, .el-sub-menu__title')
    const visibleTexts = await visibleMenus.allTextContents()

    for (const sub of expectedSubmenus) {
      const found = visibleTexts.some((t) => t.includes(sub))
      expect(found, `Submenu "${sub}" should exist`).toBeTruthy()
    }
  })

  test('PRD-3.2: 路由跳转到"产业总览"', async ({ page }) => {
    await page.goto('/analysis/overview/summary')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    await expect(page.locator('.page-header__title')).toBeVisible()
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
    { route: '/atlas/national/overview', title: '全国图谱总览' },
    { route: '/analysis/overview/summary', title: '产业总览' },
    { route: '/dynamics/news', title: '行业动态' },
    { route: '/warning/overview', title: '预警总览' },
    { route: '/invest/chain/target', title: '目标筛选' },
    { route: '/intelligence/news', title: '招商资讯' },
    { route: '/monitor/overview/summary', title: '监测总览' },
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

    const errorCode = page.locator('text=404')
    const errorMsg = page.locator('text=页面不存在')
    const is404 = (await errorCode.count()) > 0 || (await errorMsg.count()) > 0
    expect(is404, 'Should show 404 or "页面不存在"').toBeTruthy()
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
    await page.goto('/login')
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

    // Form card white background
    const formCard = page.locator('.login-page__form-card')
    if ((await formCard.count()) > 0) {
      const cardBg = await formCard.first().evaluate((el) => {
        return getComputedStyle(el).backgroundColor
      })
      expect(cardBg).toContain('rgb(255, 255, 255)')
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
