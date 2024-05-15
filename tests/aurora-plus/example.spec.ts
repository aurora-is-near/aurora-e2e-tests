import { expect, test } from "@playwright/test"
import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { AURORA_PLUS_BASE_URL } from "../../lib/constants/base-urls"

test.describe("Aurora Plus", { tag: AURORA_PLUS_TAG }, () => {
  test("has title", async ({ page }) => {
    await page.goto(`${AURORA_PLUS_BASE_URL}/dashboard`)

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/)
  })
})
