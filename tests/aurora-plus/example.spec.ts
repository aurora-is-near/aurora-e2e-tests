import { expect } from "playwright/test"
import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { test } from "../../lib/fixtures"

test.describe("Aurora Plus", { tag: AURORA_PLUS_TAG }, () => {
  test("connects a wallet", async ({ getApp, page, setupMetaMask }) => {
    await setupMetaMask()

    const app = getApp("aurora-plus")

    await app.goto("/dashboard")

    await page.getByText("Connect wallet").click()
    await page.getByTestId("connect-modal").getByText("Connect wallet").click()

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/)
  })
})
