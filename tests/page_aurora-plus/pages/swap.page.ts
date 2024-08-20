// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { expect, type Locator, type Page } from "@playwright/test"

import { BasePage } from "./base.page"
import { midTimeout } from "../../helpers/constants/timeouts"

export class SwapPage extends BasePage {
  swapFromContainer: Locator
  swapToContainer: Locator
  reviewSwapButton: Locator
  reviewSwapModalTitle: Locator
  approveSwapButton: Locator
  swapNowButton: Locator
  swapFromInput: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.swapFromContainer = page.getByTestId("swap-from-container")
    this.swapToContainer = page.getByTestId("swap-to-container")

    this.reviewSwapButton = page.getByTestId("review-swap-button")
    this.reviewSwapModalTitle = page.getByText("Review your Swap")
    this.approveSwapButton = page.getByRole("button", {
      name: "Approve",
    })
    this.swapNowButton = page.getByTestId("swap-now-button")
    this.swapFromInput = page.locator("#input-amount")
  }

  async confirmHomePageLoaded(url: string, page = this.page) {
    await this.confirmCorrectPageLoaded(page, url)
  }

  async selectTokenWithBalance(token: string) {
    const tokenWithBalance = this.swapFromContainer.getByTestId(
      `${token}-swap-button`,
    )

    const messageOnFail = `not visible in list of tokens with balance`
    await expect(tokenWithBalance, `${token} ${messageOnFail}`).toBeVisible()

    await tokenWithBalance.click()
  }

  async selectDestinationSupportedToken(token: string) {
    const supportedToken = this.swapToContainer.getByTestId(
      `${token}-swap-button`,
    )

    const messageOnFail = `${token} not visible in list of supported tokens`
    await expect(supportedToken, `${token} ${messageOnFail}`).toBeVisible()

    await supportedToken.click()
  }

  async enterSwapFromAmount(amount: number) {
    const messageOnFail = '"From" input field not visible'
    await expect(this.swapFromInput, messageOnFail).toBeVisible()

    await this.swapFromInput.fill(amount.toString())
  }

  async clickReviewSwapButton() {
    let messageOnFail = "Review swap button not visible"
    await expect(this.reviewSwapButton, messageOnFail).toBeVisible()
    messageOnFail = "Review swap button not enabled"
    await expect(this.reviewSwapButton, messageOnFail).toBeEnabled()

    await this.reviewSwapButton.click()
  }

  async confirmThatReviewYourSwapModalVisible() {
    const messageOnFail = "Review swap modal title not visible"
    await expect(this.reviewSwapModalTitle, messageOnFail).toBeVisible(
      midTimeout,
    )
  }

  async clickApproveSwapButton() {
    if (await this.approveSwapButton.isVisible(midTimeout)) {
      await this.approveSwapButton.click()
    } else {
      const messageOnFail = "Swap now button not visible"
      await expect(this.swapNowButton, messageOnFail).toBeVisible()
      await this.swapNowButton.click()
    }
  }
}
