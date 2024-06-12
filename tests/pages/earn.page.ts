// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

export class EarnPage extends BasePage {
  earnPageTitle: Locator
  depositInputField: Locator
  confirmDepositButton: Locator
  depositSuccessfullNotificationInPopup: Locator
  depositSuccessfullNotificationInPage: Locator
  auroraDepositButton: Locator
  firstOnboardingMessage: Locator
  nextSlideButton: Locator
  getStartEarning: Locator
  approveDepositButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.earnPageTitle = page.getByText("Deposit to Earn")
    this.depositInputField = page.locator("//input[@id='deposit-amount']")
    this.confirmDepositButton = page.getByText("Deposit and Enable Collateral")
    this.approveDepositButton = page.getByRole("button", { name: "Approve" })
    this.depositSuccessfullNotificationInPopup = page.getByText(
      "Deposit Successful!",
    )
    this.depositSuccessfullNotificationInPage = page.getByText(
      "Successfully deposited",
    )
    this.auroraDepositButton = page.getByRole("button", {
      name: "AURORA",
    })
    this.firstOnboardingMessage = page.getByText("Earn More With Your Crypto")
    this.nextSlideButton = page.getByRole("button", { name: "Nextslide" })
    this.getStartEarning = page.getByRole("button", { name: "Get Started" })
  }

  confirmEarnPageLoaded() {
    expect(this.page.url()).toBe("https://aurora.plus/earn")
  }

  async isOnboardingVisible() {
    const isVisible = this.firstOnboardingMessage.isVisible({ timeout: 20000 })

    return isVisible
  }

  async skipOnboarding() {
    // eslint-disable-next-line no-await-in-loop
    while (await this.nextSlideButton.isVisible()) {
      // eslint-disable-next-line no-await-in-loop
      await this.nextSlideButton.click()
    }

    await this.getStartEarning.click()
  }

  async selectAuroraToDeposit() {
    await this.auroraDepositButton.click()
  }

  async enterAmountToDeposit(amount: number) {
    await this.depositInputField.fill(amount.toString())
  }

  async confirmDeposit() {
    if (await this.confirmDepositButton.isVisible()) {
      await this.confirmDepositButton.click()
    } else if (await this.approveDepositButton.isVisible()) {
      await this.approveDepositButton.click()
    }
  }

  async confirmDepositWasSuccessfullPopUpVisible() {
    await expect(this.depositSuccessfullNotificationInPopup).toBeVisible({
      timeout: 20000,
    })
  }

  async confirmSuccessfullyDepositedNotificationVisible() {
    await expect(this.depositSuccessfullNotificationInPage).toBeVisible({
      timeout: 20000,
    })
  }
}
