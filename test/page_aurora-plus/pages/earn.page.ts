import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"
import { midTimeout, shortTimeout } from "../../helpers/constants/timeouts"

export class EarnPage extends BasePage {
  earnPageTitle: Locator

  depositInputField: Locator

  confirmDepositButton: Locator

  depositSuccessfullNotificationInPopup: Locator

  depositSuccessfullNotificationInPage: Locator

  auroraDepositButton: Locator

  firstOnboardingMessage: Locator

  nextSlideButton: Locator

  previousSlideButton: Locator

  getStartButton: Locator

  approveDepositButton: Locator

  depositMoreButton: Locator

  depositButton: Locator

  depositedTokenBalance: Locator

  depositedTokenValue: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.earnPageTitle = page.getByText("Deposit to Earn")
    this.depositInputField = page.locator("//input[@id='deposit-amount']")
    this.confirmDepositButton = page.getByText("Deposit and Enable Collateral")
    this.approveDepositButton = page.getByRole("button", { name: "Approve" })
    this.depositButton = page.getByRole("button", {
      name: "Deposit",
      exact: true,
    })
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
    this.previousSlideButton = page.getByTestId("previous-slide-button")
    this.nextSlideButton = page.getByRole("button", { name: "Next slide" })
    this.getStartButton = page.getByRole("button", { name: "Get Started" })
    this.depositMoreButton = page.getByTestId("deposit-more-button")
    this.depositedTokenBalance = page.getByTestId("deposited-token-balance")
    this.depositedTokenValue = page.getByTestId("deposited-token-value")
  }

  async confirmEarnPageLoaded(url: string, page = this.page) {
    await this.confirmCorrectPageLoaded(page, url)
  }

  async isOnboardingVisible(): Promise<boolean> {
    const isVisible: boolean = await this.firstOnboardingMessage.isVisible(shortTimeout)

    return isVisible
  }

  async skipOnboarding() {
    // eslint-disable-next-line no-await-in-loop
    while (await this.nextSlideButton.isVisible()) {
      // eslint-disable-next-line no-await-in-loop
      await this.nextSlideButton.click()
    }

    const messageOnFail: string ="Button 'Get Started' not visible"
    await expect(this.getStartButton, messageOnFail).toBeVisible()

    await this.getStartButton.click()
  }

  async selectAuroraToDeposit() {
    const messageOnFail: string ="AURORA deposit button not visible"
    await expect(this.auroraDepositButton, messageOnFail).toBeVisible()

    await this.auroraDepositButton.click()
  }

  async clickDepositMoreButton() {
    const messageOnFail: string ='"Deposit more" button not visible'
    await expect(this.depositMoreButton, messageOnFail).toBeVisible(
      shortTimeout,
    )

    await this.depositMoreButton.click()
  }

  async enterAmountToDeposit(amount: number) {
    const messageOnFail: string ="Deposit input field not visible"
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
    const messageOnFail: string ="Successful deposit notification do not appeared"
    await expect(
      this.depositSuccessfullNotificationInPage,
      messageOnFail,
    ).toBeVisible(midTimeout)
  }

  async isAnyDepositsExist(): Promise<boolean> {
    let isVisible: boolean = false

    isVisible = await this.depositMoreButton.isVisible(midTimeout)

    return isVisible
  }

  async getDepositedTokenBalance(): Promise<number> {
    const balance: string = await this.depositedTokenBalance.innerText()

    return parseFloat(balance)
  }

  async getDepositedTokenValue(): Promise<number> {
    const value: string = await this.depositedTokenValue.innerText()

    return parseFloat(value.replace("$", ""))
  }
}
