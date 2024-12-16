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

  constructor(page: Page) {
    super(page)
    this.page = page
    this.stakeTokensButton = page.getByRole("link", { name: "Stake tokens" })
    this.availableBalance = page.getByText("Available to stake")
    this.stakeAmountInput = page.getByPlaceholder("0")
    this.stakeButton = page.getByRole("button", { name: "Stake" })
    this.confirmTransactionButton = page.getByRole("button", {
      name: "Confirm transaction",
    })
    this.successNotification = page.getByText("Success!")
    this.stakeMoreButton = page.getByRole("button", { name: "Stake more" })
  }

  async clickStakeTokensButton() {
    const messageOnFail: string = '"Stake tokens" button is not visible'
    await expect(this.stakeTokensButton, messageOnFail).toBeVisible()
    await this.stakeTokensButton.click()
  }

  async selectValidator(validator = "kiln.pool.f863973.m0") {
    const validatorLocator = this.page.getByRole("link", {
      name: validator,
    })
    const messageOnFail: string = `Validator: ${validator} is not visible in the list of validators`
    await expect(validatorLocator, messageOnFail).toBeVisible()
    await validatorLocator.click()
  }

  async getAvalableBalance() {
    const messageOnFail: string = "Available balance not visible"
    await expect(this.availableBalance, messageOnFail).toBeVisible()
    const availableBalanceText = await this.availableBalance.innerText()
  }

  async enterAmountToStake(stakeAmount: number) {
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
    await expect(this.successNotification, messageOnFail).toBeVisible()
  }

  async returnToStakingInputPage() {
    const messageOnFail: string = '"Stake more" button is not visible'
    await expect(this.stakeMoreButton, messageOnFail).toBeVisible()
    await this.stakeMoreButton.click()
  }
}
