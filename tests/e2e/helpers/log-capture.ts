import { Page, expect } from '@playwright/test'

interface FailedRequest {
  url: string
  status: number
  method: string
}

/**
 * Capture failed network requests and console errors on a page.
 * Call `assertClean()` at the end of each test to fail on any server errors.
 */
export function capturePageLogs(page: Page) {
  const failedRequests: FailedRequest[] = []
  const consoleErrors: string[] = []

  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        method: response.request().method(),
      })
    }
  })

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text()
      // Filter out known harmless errors
      if (!text.includes('favicon') && !text.includes('net::ERR')) {
        consoleErrors.push(text)
      }
    }
  })

  return {
    getFailedRequests: () => failedRequests,
    getConsoleErrors: () => consoleErrors,
    assertClean: () => {
      expect(
        failedRequests,
        `No failed requests expected, got: ${JSON.stringify(failedRequests, null, 2)}`,
      ).toEqual([])
      expect(consoleErrors, `No console errors expected, got: ${consoleErrors.join('\n')}`).toEqual(
        [],
      )
    },
  }
}
