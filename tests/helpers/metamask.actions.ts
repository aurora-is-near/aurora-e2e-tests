// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BrowserContext, Page } from "playwright/test"

export class MetamaskActions {
  async switchContextToExtension(context: BrowserContext) {
    return context.waitForEvent("page")
  }

  async switchContextToPage(page: Page) {
    await page.bringToFront()
  }

  async clickConfirm(contextPromise: any) {
    const contextPromiseResolved = await contextPromise
    await contextPromiseResolved
      .getByRole("button", { name: "Confirm" })
      .click()
  }

  async clickNext(contextPromise: any) {
    const contextPromiseResolved = await contextPromise
    await contextPromiseResolved.getByRole("button", { name: "Next" }).click()
  }

  async clickApprove(contextPromise: any) {
    const contextPromiseResolved = await contextPromise
    await contextPromiseResolved
      .getByRole("button", { name: "Approve" })
      .click()
  }
}
