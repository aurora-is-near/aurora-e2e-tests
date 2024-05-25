import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"

dotenv.config({ path: ".env" })
dotenv.config({ path: ".env.production" })

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 240000,
  reporter: "dot",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup metamask",
      testMatch: /metamask\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup metamask"],
    },
  ],
})
