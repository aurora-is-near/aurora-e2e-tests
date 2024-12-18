import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./test",
  fullyParallel: false,
  forbidOnly: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["html", { outputFolder: "my-report", open: "never" }]],
  timeout: (process.env.CI ? 3 : 1) * 60 * 1000,
  use: {
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    viewport: { width: 1920, height: 1080 },
  },
  expect: {
    timeout: (process.env.CI ? 5 : 3) * 60 * 1000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
