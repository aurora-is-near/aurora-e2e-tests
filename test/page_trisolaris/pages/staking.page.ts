import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"
import {
  longTimeout,
  midTimeout,
  shortTimeout,
} from "../../helpers/constants/timeouts"

export class StakingPage extends BasePage {
  stakeToggleState: string

  balanceAmountLocator: Locator
  stakingInputField: Locator
  stakeBtn: Locator
  confirmStakeBtn: Locator
  insufficientBalanceBtn: Locator
  txConfirmationWindow: Locator
  txConfirmationWindowClose: Locator
  txConfirmedDialog: Locator
  stakeToggleBtn: Locator
  unstakeBtn: Locator
  confirmUnstakeBtn: Locator

  constructor(page: Page) {
    super(page)
    // Internal variables
    this.stakeToggleState = "Stake"
    // Locators
    this.page = page
    this.balanceAmountLocator = page.getByText("Balance:")
    this.stakingInputField = page.getByPlaceholder("0.0")
    this.stakeBtn = page.getByRole("button", { name: "Stake", exact: true })
    this.confirmStakeBtn = page.getByRole("button", { name: "Confirm Stake" })
    this.insufficientBalanceBtn = page.getByRole("button", {
      name: "Insufficient Balance",
    })
    this.txConfirmationWindow = page
      .getByLabel("dialog")
      .locator("div")
      .filter({ hasText: "Transaction SubmittedView on" })
      .nth(1)
    this.txConfirmationWindowClose = page.getByRole("button", { name: "Close" })
    this.txConfirmedDialog = page.getByText("Deposited into pTRI").first()
    this.stakeToggleBtn = page.getByRole("button", { name: "Stake Unstake" })

    this.unstakeBtn = page.getByRole("button", { name: "Unstake", exact: true })
    this.confirmUnstakeBtn = page.getByRole("button", {
      name: "Confirm Unstake",
    })
  }

  async confirmStakingPageLoaded(page = this.page) {
    await this.confirmCorrectPageLoaded(page, "/stake")
  }

  async getAvalableBalance() {
    await this.balanceAmountLocator.isVisible(midTimeout)
    // wait a bit until the balance actually looks for 5 seconds
    await this.page.waitForTimeout(5_000)
    const temp = await this.balanceAmountLocator.innerText()
    const m = temp.match(/[-+]?\d+(?:\.\d+)?/)
    const num = m ? parseFloat(m[0]) : NaN

    return num
  }

  async enterAmount(amount: number) {
    await this.stakingInputField.isVisible(shortTimeout)
    await this.stakingInputField.fill(amount.toString())
  }

  async clickStakeButton() {
    await this.stakeBtn.isVisible(shortTimeout)
    await this.stakeBtn.click()
  }

  async confirmStake() {
    await this.confirmStakeBtn.isVisible(shortTimeout)
    await this.confirmStakeBtn.click()
  }

  async confirmTransactionIsBlocked() {
    await expect(this.insufficientBalanceBtn).toBeVisible(shortTimeout)
  }

  async confirmTransactionIsSubmitted() {
    await this.txConfirmationWindow.isVisible(midTimeout)
    await this.txConfirmationWindowClose.click(midTimeout)
  }

  async confirmTransactionIsDone() {
    await this.txConfirmedDialog.isVisible(longTimeout)
    await this.page.waitForTimeout(5_000)
  }

  async setStakeMode() {
    await this.stakeToggleBtn.isVisible(shortTimeout)
    await this.stakeToggleBtn.click()

    if (this.stakeToggleState === "Stake") {
      this.stakeToggleState = "Unstake"
    } else if (this.stakeToggleState === "Unstake") {
      this.stakeToggleState = "Stake"
    }
  }

  async clickUnstakeButton() {
    await this.unstakeBtn.isVisible(shortTimeout)
    await this.unstakeBtn.click()
  }

  async confirmUnstake() {
    await this.confirmUnstakeBtn.isVisible(shortTimeout)
    await this.confirmUnstakeBtn.click()
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
}
