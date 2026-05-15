import { Page } from '@playwright/test'

const MOCK_TOKEN = 'mock-token-123456'
const MOCK_USER = JSON.stringify({ username: 'admin', role: 'admin' })

/**
 * Convert a Vue Router path to a hash-history URL fragment.
 * The app uses createWebHashHistory(), so routes must be prefixed with /#.
 */
export function hashRoute(route: string): string {
  return '/#' + route
}

/**
 * Navigate to a route with mock authentication injected.
 * Must go to the site first to have a valid origin for localStorage.
 */
export async function gotoWithAuth(page: Page, route: string) {
  // Navigate to a blank page first to ensure a clean full-page load
  await page.goto('about:blank')
  await page.waitForLoadState('domcontentloaded')

  // Navigate to the app root to establish a valid origin for localStorage
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

  // Now navigate to the target route (hash-history format)
  // Using the full absolute URL forces a proper page load
  await page.goto(hashRoute(route))
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
    await page.goto(hashRoute(route))
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
