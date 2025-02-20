import type { GitHubActionOptions } from "@estruyf/github-actions-reporter"
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./test",
  fullyParallel: false,
  forbidOnly: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "my-report", open: "never" }],
    ["junit", { outputFile: "results.xml", open: "never" }],
    [
      "@estruyf/github-actions-reporter",
      <GitHubActionOptions>{
        useDetails: true,
        showError: false,
        showTags: false,
      },
    ],
  ],
  reportSlowTests: null,
  timeout: (process.env.CI ? 3 : 2) * 60 * 1000,
  globalTimeout: (process.env.CI ? 60 : 30) * 60 * 1000,
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    viewport: { width: 1920, height: 1080 },
  },
  expect: {
    timeout: (process.env.CI ? 50 : 30) * 1000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        contextOptions: {
          geolocation: {
            latitude: 57.395, // Example: Latitude (Ventspils)
            longitude: 21.559, // Example: Longitude (Ventspils)
            accuracy: 100, // Example: Accuracy of the location
          },
          permissions: ["geolocation"], // Allow geolocation access
        },
      },
    },
  ],
})
