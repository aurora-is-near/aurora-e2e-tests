/* eslint-disable no-await-in-loop */
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
  getStartButton: Locator
  approveDepositButton: Locator
  depositMoreButton: Locator
  depositButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.earnPageTitle = page.getByText("Deposit to Earn")
    this.depositInputField = page.locator("//input[@id='deposit-amount']")
    this.confirmDepositButton = page.getByText("Deposit and Enable Collateral")
    this.approveDepositButton = page.getByRole("button", { name: "Approve" })
    this.depositButton = page.getByRole("button", { name: "Deposit" })
    this.depositSuccessfullNotificationInPopup = page.getByText(
      "Deposit Successful!",
    )
    this.depositSuccessfullNotificationInPage = page.getByText(
      '//*[text()="Successfully deposited"]',
    )
    this.auroraDepositButton = page.getByRole("button", {
      name: "AURORA",
    })
    this.firstOnboardingMessage = page.getByText("Earn More With Your Crypto")
    this.nextSlideButton = page.getByRole("button", { name: "Nextslide" })
    this.getStartButton = page.getByRole("button", {
      name: "Get Started",
    })
    this.depositMoreButton = page.getByRole("button", {
      name: "Deposit More",
    })
  }

  async confirmEarnPageLoaded(url: string, page = this.page) {
    await this.confirmCorrectPageLoaded(page, url)
  }

  async isOnboardingVisible() {
    const isVisible = this.firstOnboardingMessage.isVisible(
      this.timeouts.shortTimeout,
    )

    return isVisible
  }

  async skipOnboarding() {
    let isNextSlideVisible = true

    while (isNextSlideVisible) {
      await this.nextSlideButton.click()
      isNextSlideVisible = await this.nextSlideButton.isVisible()
    }

    const messageOnFail = "Button 'Get Started' not visible"
    await expect(this.getStartButton, messageOnFail).toBeVisible()

    await this.getStartButton.click()
  }

  async selectAuroraToDeposit() {
    const messageOnFail = "AURORA deposit button not visible"
    await expect(this.auroraDepositButton, messageOnFail).toBeVisible()

    await this.auroraDepositButton.click()
  }

  async enterAmountToDeposit(amount: number) {
    const messageOnFail = "Deposit input field not visible"
    await expect(this.depositInputField, messageOnFail).toBeVisible()

    await this.depositInputField.fill(amount.toString())
  }

  async confirmDeposit() {
    if (await this.confirmDepositButton.isVisible()) {
      await this.confirmDepositButton.click()
    } else if (await this.approveDepositButton.isVisible()) {
      await this.approveDepositButton.click()
    } else if (await this.depositButton.isVisible()) {
      await this.depositButton.click()
    }
  }

  async confirmSuccessfullyDepositedNotificationVisible() {
    const messageOnFail = "Successful deposit notification do not appeared"
    await expect(
      this.depositSuccessfullNotificationInPage,
      messageOnFail,
    ).toBeVisible(this.timeouts.longTimeout)
  }

  async clickDepositMoreButton() {
    await this.depositMoreButton.click()
  }

  async isAnyDepositsExist() {
    const isVisible = await this.depositMoreButton.isVisible()

    return isVisible
  }
}
