import { type BrowserContext, expect, type Page } from "playwright/test"
import { midTimeout } from "../../lib/constants/timouts"

export class MetamaskActions {
  async switchContextToExtension(context: BrowserContext) {
    return context.waitForEvent("page")
  }

  async switchContextToPage(page: Page) {
    await page.bringToFront()
  }

  async findAndClickButton(text: string, contextPromise: Page | Promise<Page>) {
    const contextPromiseResolved = await contextPromise
    const button = contextPromiseResolved.getByRole("button", {
      name: text,
    })
    const messageOnFail = `Metamask "${text}" button not visible`
    await expect(button, messageOnFail).toBeVisible(midTimeout)
    await button.click()
  }

  async clickConfirm(contextPromise: Page | Promise<Page>) {
    await this.findAndClickButton("Confirm", contextPromise)
  }

  async clickNext(contextPromise: Page | Promise<Page>) {
    await this.findAndClickButton("Next", contextPromise)
  }

  async clickApprove(contextPromise: Page | Promise<Page>) {
    await this.findAndClickButton("Approve", contextPromise)
  }

  async clickConnect(contextPromise: Page | Promise<Page>) {
    await this.findAndClickButton("Connect", contextPromise)
  }

  async clickSwitchNetworkButton(contextPromise: Page | Promise<Page>) {
    await this.findAndClickButton("Switch network", contextPromise)
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
