import { type BrowserContext, expect, type Page } from "playwright/test"

export class MetamaskActions {
  async switchContextToExtension(context: BrowserContext) {
    return context.waitForEvent("page")
  }

  async switchContextToPage(page: Page) {
    await page.bringToFront()
  }

  async clickConfirm(contextPromise: Page | Promise<Page>) {
    const contextPromiseResolved = await contextPromise
    const confirmButton = contextPromiseResolved.getByRole("button", {
      name: "Confirm",
    })
    await expect(
      confirmButton,
      "Metamask CONFIRM button not visible",
    ).toBeVisible()
    await confirmButton.click()
  }

  async clickNext(contextPromise: Page | Promise<Page>) {
    const contextPromiseResolved = await contextPromise
    const nextButton = contextPromiseResolved.getByRole("button", {
      name: "Next",
    })
    await expect(nextButton, "Metamask NEXT button not visible").toBeVisible()
    await nextButton.click()
  }

  async clickApprove(contextPromise: Page | Promise<Page>) {
    const contextPromiseResolved = await contextPromise
    const approveButton = contextPromiseResolved.getByRole("button", {
      name: "Approve",
    })
    await expect(
      approveButton,
      "Metamask APPROVE button not visible",
    ).toBeVisible()
    await approveButton.click()
  }

  async isButtonVisible(
    contextPromise: Page | Promise<Page>,
    button: string,
  ): Promise<boolean> {
    const contextPromiseResolved = await contextPromise
    const isButtonVisible = contextPromiseResolved
      .getByRole("button", {
        name: button,
      })
      .isVisible({ timeout: 20000 })

    return isButtonVisible
  }
}
