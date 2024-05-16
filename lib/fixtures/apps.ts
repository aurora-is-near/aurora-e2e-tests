import { test } from "@playwright/test"

type AppName = "aurora-plus"

type App = {
  goto: (url: string) => Promise<void>
}

const BASE_URLS: Record<AppName, string> = {
  "aurora-plus": process.env.AURORA_PLUS_BASE_URL ?? "https://aurora.plus",
}

/**
 * Setup test fixtures for our apps.
 */
export const appsTest = test.extend<{
  getApp: (appName: AppName) => App
}>({
  getApp: async ({ page }, use) => {
    await use((appName: AppName) => ({
      goto: async (url: string) => {
        const baseUrl = BASE_URLS[appName]

        if (!baseUrl) {
          throw new Error(`No URL set for app: ${appName}`)
        }

        await page.goto(new URL(url, baseUrl).href)
      },
    }))
  },
})

export const { expect } = test
