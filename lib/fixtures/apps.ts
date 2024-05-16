// eslint-disable-next-line no-restricted-imports
import { test } from "@playwright/test"

type AppName = "aurora-plus"

type App = {
  goto: (url: string) => Promise<void>
}

const BASE_URL_ENV_VAR_NAMES: Record<AppName, string> = {
  "aurora-plus": "AURORA_PLUS_BASE_URL",
}

/**
 * Setup test fixtures for Chrome extensions.
 *
 * @see https://playwright.dev/docs/chrome-extensions
 */
export const appsTest = test.extend<{
  getApp: (appName: AppName) => App
}>({
  getApp: async ({ page }, use) => {
    await use((appName: AppName) => ({
      goto: async (url: string) => {
        const envVarName = BASE_URL_ENV_VAR_NAMES[appName]
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
