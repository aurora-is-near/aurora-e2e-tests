// eslint-disable-next-line no-restricted-imports
import { test } from "@playwright/test"
import type { AppName } from "../types/app"
import { BASE_URLS } from "../base-urls"

type App = {
  goto: (url: string) => Promise<void>
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
        const envVarName = BASE_URLS[appName]
        const baseUrl = process.env[envVarName]

        if (!baseUrl) {
          throw new Error(`Missing ${envVarName} environment variable`)
        }

        await page.goto(new URL(url, baseUrl).href)
      },
    }))
  },
})

export const { expect } = test
