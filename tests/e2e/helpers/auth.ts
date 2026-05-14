import { Page } from '@playwright/test'

const MOCK_TOKEN = 'mock-token-123456'
const MOCK_USER = JSON.stringify({ username: 'admin', role: 'admin' })

/**
 * Navigate to a route with mock authentication injected.
 * Must go to the site first to have a valid origin for localStorage.
 */
export async function gotoWithAuth(page: Page, route: string) {
  // Navigate to the app root first to establish a valid origin for localStorage
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')

  // Inject auth
  await page.evaluate(
    ([token, user]) => {
      localStorage.setItem('zsyz_token', token)
      localStorage.setItem('zsyz_user', user)
    },
    [MOCK_TOKEN, MOCK_USER],
  )

  // Now navigate to the target route
  await page.goto(route)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2500)

  // If redirected to login, re-inject and retry
  if (page.url().includes('/login')) {
    await page.evaluate(
      ([token, user]) => {
        localStorage.setItem('zsyz_token', token)
        localStorage.setItem('zsyz_user', user)
      },
      [MOCK_TOKEN, MOCK_USER],
    )
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2500)
  }
}

/**
 * Inject mock authentication into localStorage so pages load without login.
 * The page must already be on a valid origin (not about:blank).
 */
export async function injectAuth(page: Page) {
  await page.evaluate(
    ([token, user]) => {
      localStorage.setItem('zsyz_token', token)
      localStorage.setItem('zsyz_user', user)
    },
    [MOCK_TOKEN, MOCK_USER],
  )
}

/**
 * Clear auth from localStorage (simulate logout).
 */
export async function clearAuth(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('zsyz_token')
    localStorage.removeItem('zsyz_user')
  })
}
