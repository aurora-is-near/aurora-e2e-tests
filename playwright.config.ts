import type { GitHubActionOptions } from "@estruyf/github-actions-reporter"
import { defineConfig, devices } from "@playwright/test"
import generateCustomLayoutSimpleMeta from "./reporter/layout_generator"

export default defineConfig({
  testDir: "./test",
  fullyParallel: false,
  forbidOnly: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [
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
        [
          "./node_modules/playwright-slack-report/dist/src/SlackReporter.js",
          {
            slackWebHookUrl:
              "https://hooks.slack.com/services/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",
            sendResults: "always",
            layout: generateCustomLayoutSimpleMeta,
            meta: [{ key: "Product", value: `${process.env.RUN_TAG}` }],
          },
        ],
      ]
    : [["dot"], ["list"], ["html"]],
  reportSlowTests: null,
  timeout: (process.env.CI ? 3 : 2) * 60 * 1000,
  globalTimeout: (process.env.CI ? 60 : 30) * 60 * 1000,
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    viewport: { width: 1920, height: 1080 },
  },
  expect: {
    timeout: 50 * 1000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
})
