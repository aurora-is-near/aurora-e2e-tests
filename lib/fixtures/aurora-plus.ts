import { type Response, test } from "@playwright/test"

const BASE_URL = process.env.AURORA_PLUS_BASE_URL ?? "https://aurora.plus"

/**
 * Setup test fixtures for our apps.
 */
export const auroraPlusTest = test.extend<{
  auroraPlus: {
    goto: (url: string) => Promise<null | Response>
    connectToMetaMask: () => Promise<void>
  }
}>({
  auroraPlus: async ({ page, context }, use) => {
    await use({
      goto: async (url: string) => page.goto(new URL(url, BASE_URL).href),
      connectToMetaMask: async () => {
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
        await connectPage
          .getByRole("button", { name: "Switch network" })
          .click()

        await page.bringToFront()

        const signPopupPromise = context.waitForEvent("page")

        await page
          .getByTestId("connect-modal")
          .getByRole("button", { name: "Accept and sign" })
          .click()

        const signPage = await signPopupPromise

        await signPage.getByRole("button", { name: "Sign" }).click()

        await page.bringToFront()
      },
    })
  },
})
