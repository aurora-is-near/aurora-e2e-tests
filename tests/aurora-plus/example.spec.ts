import { expect } from "playwright/test"
import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { AURORA_PLUS_BASE_URL } from "../../lib/constants/base-urls"
import { test } from "../../lib/fixtures"

test.describe("Aurora Plus", { tag: AURORA_PLUS_TAG }, () => {
  test("connects a wallet", async ({ page, setupMetaMask }) => {
    await setupMetaMask()
    await page.goto(`${AURORA_PLUS_BASE_URL}/dashboard`)

    await page.getByText("Connect wallet").click()
    await page.getByTestId("connect-modal").getByText("Connect wallet").click()

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/)
  })
})
