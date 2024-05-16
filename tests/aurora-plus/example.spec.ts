import { expect } from "playwright/test"
import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { test } from "../../lib/fixtures"

test.describe("Aurora Plus", { tag: AURORA_PLUS_TAG }, () => {
  test("connects a wallet", async ({ getApp, page, metamask, context }) => {
    await metamask.setup()

    const app = getApp("aurora-plus")

    await app.goto("/dashboard")

    await page.evaluate(() => {
      localStorage.setItem("ap-promo-hidden", "1")
    })

    await page.getByRole("button", { name: "Connect wallet" }).click()
    await page
      .getByTestId("connect-modal")
      .getByRole("button", { name: "Connect wallet" })
      .click()

    const connectPopupPromise = context.waitForEvent("page")

    await page.getByRole("button", { name: "MetaMask" }).click()
    await page.waitForSelector("w3m-connecting-external-view")

    const connectPage = await connectPopupPromise

    await connectPage.waitForLoadState("domcontentloaded")

    await connectPage.getByRole("button", { name: "Next" }).click()
    await connectPage.getByRole("button", { name: "Connect" }).click()
    await connectPage.getByRole("button", { name: "Approve" }).click()
    await connectPage.getByRole("button", { name: "Switch network" }).click()

    await page.bringToFront()

    const signPopupPromise = context.waitForEvent("page")

    await page
      .getByTestId("connect-modal")
      .getByRole("button", { name: "Accept and sign" })
      .click()

    const signPage = await signPopupPromise

    await signPage.getByTestId("popover-close").click()
    await signPage.getByRole("button", { name: "Sign" }).click()

    await page.bringToFront()

    await expect(page.getByTestId("connected-indicator")).toBeVisible()
  })
})
