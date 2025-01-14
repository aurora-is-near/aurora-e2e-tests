import { type Locator, type Page } from "playwright/test"
import { expect } from "@playwright/test"
import { BasePage } from "./base.page"

export class StakingPage extends BasePage {
  stakeTokensButton: Locator
  availableBalance: Locator
  stakeAmountInput: Locator
  stakeButton: Locator
  confirmTransactionButton: Locator
  successNotification: Locator
  stakeMoreButton: Locator
  notEnoughBalanceNotification: Locator
  unstakeButton: Locator
  selectButton: Locator
  unstakeLink: Locator
  insufficientFundsNotification: Locator
  maxButton: Locator
  withdrawButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.stakeTokensButton = page.getByRole("link", { name: "Stake tokens" })
    this.availableBalance = page.getByText("NEARMAX")
    this.stakeAmountInput = page.getByPlaceholder("0")
    this.stakeButton = page.getByRole("button", { name: "Stake" })
    this.confirmTransactionButton = page.getByRole("button", {
      name: "Confirm transaction",
    })
    this.successNotification = page.getByText("Success!")
    this.stakeMoreButton = page.getByRole("button", { name: "Stake more" })
    this.notEnoughBalanceNotification = page.getByText("Not enough balance")
    this.unstakeLink = page.getByRole("link", { name: "Unstake" })
    this.selectButton = page.getByRole("button", { name: "Select" })
    this.unstakeButton = page.getByRole("button", { name: "Unstake" })
    this.insufficientFundsNotification = page.getByText(
      "Unstake amount is greater",
    )
    this.maxButton = page.getByText("MAX")
    this.withdrawButton = page.getByRole("link", { name: "Withdraw" })
  }

  async clickStakeTokensButton() {
    const messageOnFail: string = '"Stake tokens" button is not visible'
    await expect(this.stakeTokensButton, messageOnFail).toBeVisible()
    await this.stakeTokensButton.click()
  }

  async getAvalableBalance() {
    const messageOnFail: string = "Available balance not visible"
    await expect(this.availableBalance, messageOnFail).toBeVisible()
    const availableBalanceText = await this.availableBalance.innerText()
    const balanceString = availableBalanceText
      .replace("~", "")
      .replace(" ", "")
      .replace("NEAR", "")
      .replace("MAX", "")

    return Number(balanceString)
  }

  async enterAmount(stakeAmount: number) {
    const messageOnFail: string = "Stake amount input field is not visible"
    await expect(this.stakeAmountInput, messageOnFail).toBeVisible()
    await this.stakeAmountInput.fill(stakeAmount.toString())
  }

  async confirmStake() {
    const messageOnFail: string = '"Stake" button is not visible'
    await expect(this.stakeButton, messageOnFail).toBeVisible()
    await this.stakeButton.click()
  }

  async confirmTransaction() {
    const messageOnFail: string = '"Confirm transaction" button is not visible'
    await expect(this.confirmTransactionButton, messageOnFail).toBeVisible()
    await this.confirmTransactionButton.click()
  }

  async confirmSuccessNotificationAppears() {
    const messageOnFail: string = '"Confirm transaction" button is not visible'
    await expect(this.successNotification, messageOnFail).toBeVisible({
      timeout: 30_000,
    })
  }

  async returnToStakingInputPage() {
    const messageOnFail: string = '"Stake more" button is not visible'
    await expect(this.stakeMoreButton, messageOnFail).toBeVisible()
    await this.stakeMoreButton.click()
  }

  async selectValidator(validator = null) {
    if (validator === null) {
      const locators = await this.page.getByText("%").all()
      await locators[0].click()
    } else {
      const validatorLocator = this.page.getByRole("link", {
        name: validator,
      })
      const messageOnFail: string = `Validator: ${validator} is not visible in the list of validators`
      await expect(validatorLocator, messageOnFail).toBeVisible()
      await validatorLocator.click()
    }
  }

  async confirmTransactionIsBlocked() {
    const messageOnFail =
      "Warning for insufficient funds should appear, but it not visible"
    await expect(this.notEnoughBalanceNotification, messageOnFail).toBeVisible()
  }

  confirmTransactionWasCorrect(
    availableBalance: number,
    availableBalanceAfter: number,
  ) {
    const messageOnFail = `Expected initial balance: ${availableBalance}, to be greater than one after transaction ${availableBalanceAfter}`
    expect(availableBalance, messageOnFail).toBeGreaterThan(
      availableBalanceAfter,
    )
  }

  async clickUnstakeLink() {
    await this.unstakeLink.click()
  }

  async clickSelectButton() {
    await this.selectButton.click()
  }

  async clickUnstakeButton() {
    await this.unstakeButton.click()
  }

  async confirmInsufficientFundsNotificationVisible() {
    const messageOnFail =
      'Notification: "Unstake amount is greater than amount available for unstake" must be visible'
    await expect(
      this.insufficientFundsNotification,
      messageOnFail,
    ).toBeVisible()
  }

  async clickMaxAmountButton() {
    await this.maxButton.click()
  }

  async withdrawalIsReady(): Promise<boolean> {
    // button is always enabled and clickable, but no onClick so checking
    // by attributes, this checks if button is disabled
    const attributeFound = await this.withdrawButton.getAttribute("bg-sand-12")

    return !(attributeFound == null)
  }

  async clickWithdrawButton() {
    await this.withdrawButton.click({ force: true })
  }
}
