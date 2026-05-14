import { Page } from '@playwright/test'

const MOCK_TOKEN = 'mock-token-123456'
const MOCK_USER = JSON.stringify({ username: 'admin', role: 'admin' })

/**
 * Inject mock authentication into localStorage so pages load without login.
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
 * Ensure auth is present — inject only if missing.
 */
export async function ensureAuth(page: Page) {
  await page.evaluate(
    ([token, user]) => {
      if (!localStorage.getItem('zsyz_token')) {
        localStorage.setItem('zsyz_token', token)
        localStorage.setItem('zsyz_user', user)
      }
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
