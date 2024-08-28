import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["html", { outputFolder: "my-report" }]],
  timeout: 2 * 60 * 1000,
  use: {
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  expect: {
    timeout: 5 * 60 * 1000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
