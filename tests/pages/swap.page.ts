// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

export class SwapPage extends BasePage {
  swapFromContainer: Locator
  swapToContainer: Locator
  reviewSwapButton: Locator
  reviewSwapModalTitle: Locator
  approveSwapButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.swapFromContainer = page.getByText("Swap from")
    this.swapToContainer = page.getByText("Swap to")
    this.reviewSwapButton = page.getByRole("button", { name: "Review Swap" })
    this.reviewSwapModalTitle = page.getByText("Review your Swap")
    this.approveSwapButton = page.getByRole("button", { name: "Approve" })
  }

  confirmSwapPageLoaded() {
    expect(this.page.url()).toBe("https://aurora.plus/swap")
  }

  async selectTokenWithBalance(token: string) {
    const tokenWithBalance = this.swapFromContainer.filter({
      has: this.page.getByRole("button", { name: token }),
    })
    await tokenWithBalance.click()
  }

  async selectDestinationSupportedToken(token: string) {
    const supportedToken = this.swapToContainer.filter({
      has: this.page.getByRole("button", { name: token }),
    })
    await supportedToken.click()
  }

  async enterSwapFromValue(amount: number) {
    const swapFromInput = this.swapFromContainer.filter({
      has: this.page.getByLabel("Amount"),
    })
    await swapFromInput.fill(amount.toString())
  }

  async clickReviewSwapButton() {
    await this.reviewSwapButton.click()
  }

  async confirmThatReviewYourSwapModalVisible() {
    await expect(this.reviewSwapModalTitle).toBeVisible()
  }

  async clickApproveSwapButton() {
    await this.approveSwapButton.click()
  }
}
