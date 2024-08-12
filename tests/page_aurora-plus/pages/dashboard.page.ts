// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { expect, type Locator, type Page } from "@playwright/test"
import { BasePage } from "./base.page"
import { midTimeout, shortTimeout } from "../../helpers/constants/timeouts"
import { setTimeout } from "timers/promises"

export class DashboardPage extends BasePage {
  page: Page
  stakeButton: Locator
  onboardingModal: Locator
  stakeConfirmModal: Locator
  stakeRewardsModal: Locator
  gotItContinueButton: Locator
  allClearNextButton: Locator
  okLetsStakeButton: Locator
  stakeConfirmModalAmountInput: Locator
  stakeConfirmModalButton: Locator
  loadingModalSpinner: Locator
  unstakeConfirmModalButton: Locator
  withdrawalCooldownButton: Locator
  auroraPendingWithdrawalAmount: Locator
  auroraBalance: Locator
  auroraStakedBalance: Locator
  gettingStartedTitle: Locator
  stakeAmountInput: Locator
  unstakeConfirmModal: Locator
  unstakeAmountInput: Locator
  unstakeButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.gettingStartedTitle = page.getByText("Get started with Aurora")
    this.stakeButton = page.getByTestId("stake-button")
    this.unstakeButton = page.getByTestId("unstake-button")
    this.onboardingModal = page.getByTestId("stake-onboarding-modal")
    this.stakeAmountInput = page.locator("#stake-amount")
    this.unstakeAmountInput = page.getByPlaceholder('0.00')
    // this.unstakeAmountInput = page.locator("#unstake-amount")
    this.stakeConfirmModal = page.getByTestId("stake-confirm-modal")
    this.stakeRewardsModal = page.getByTestId("stake-rewards-modal")
    this.gotItContinueButton = page.getByTestId("got-it-button")
    this.allClearNextButton = page.getByTestId("all-clear-button")
    this.okLetsStakeButton = page.getByTestId("lets-stake-button")
    this.stakeConfirmModalAmountInput =
      this.stakeConfirmModal.getByLabel("Amount")
    this.stakeConfirmModalButton = page.getByRole('button', { name: 'Confirm' })
    // this.stakeConfirmModalButton = page.getByTestId("confirm-button")
    this.loadingModalSpinner =
      this.stakeConfirmModalButton.getByTestId("loading-spinner")
    this.withdrawalCooldownButton = page.getByTestId(
      "withdrawal-cooldown-button",
    )
    this.auroraPendingWithdrawalAmount = page.getByTestId(
      "aurora-pending-withdrawal-amount",
    )
    this.auroraBalance = page.getByTestId("aurora-balance-value")
    this.auroraStakedBalance = page.getByTestId("aurora-staked-value")
    this.unstakeConfirmModal = page.getByTestId("unstake-confirm-modal")
    this.unstakeConfirmModalButton = page.getByTestId("unstake-now-button")
  }

  async confirmDashboardPageLoaded(page: Page) {
    await expect(page).toHaveURL('https://aurora.plus/dashboard')
  }

  async isAnyPendingWithdrawals() {
    const isVisible = this.withdrawalCooldownButton.isVisible()

    return isVisible
  }

  getPendingWithdrawalAmount = async (): Promise<number> => {
    let messageOnFail = "Withdrawal cooldown button is not visible"
    await expect(this.withdrawalCooldownButton, messageOnFail).toBeVisible(
      midTimeout,
    )
    await this.withdrawalCooldownButton.click()

    messageOnFail = "Withdrawal cooldown amount is not visible"
    await expect(
      this.auroraPendingWithdrawalAmount,
      messageOnFail,
    ).toBeVisible()

    const amount = Number(
      await this.auroraPendingWithdrawalAmount.textContent(),
    )
    await this.withdrawalCooldownButton.click()

    return amount
  }

  async isOnboardingVisible() {
    const isVisible = await this.onboardingModal.isVisible(shortTimeout)

    return isVisible
  }

  async skipOnboarding() {
    let messageOnFail = 'Button "Got it, Continue" is not visible'
    await expect(this.gotItContinueButton, messageOnFail).toBeVisible()
    await this.gotItContinueButton.click()

    messageOnFail = 'Button "All clear, Next" is not visible'
    await expect(this.allClearNextButton, messageOnFail).toBeVisible()
    await this.allClearNextButton.click()

    messageOnFail = 'Button "OK, Lets stake" is not visible'
    await expect(this.okLetsStakeButton, messageOnFail).toBeVisible()
    await this.okLetsStakeButton.click()
  }

  async clickStakeButton() {
    const messageOnFail = "Stake button is not visible"
    await expect(this.stakeButton, messageOnFail).toBeVisible()
    await this.stakeButton.click()
  }

  async stakeModal_enterAmount(amount: number) {
    const messageOnFail =
      "Stake amount input field in stake modal is not visible"
    await expect(this.stakeAmountInput, messageOnFail).toBeVisible()
    await this.stakeAmountInput.fill(amount.toString())
  }

  async stakeModal_confirmStake() {
    const messageOnFail = "Stake confirm button in stake modal is not visible"
    await expect(this.stakeConfirmModalButton, messageOnFail).toBeVisible()
    await this.stakeConfirmModalButton.click()
  }

  async getAuroraBalance() {
    const messageOnFail = "Aurora balance is not visible"
    await expect(this.auroraBalance, messageOnFail).toBeVisible()
    const balance = await this.auroraBalance.innerText()

    return parseFloat(balance)
  }

  async getStakedBalance() {
    const messageOnFail = "Aurora staked balance is not visible"
    await expect(this.auroraStakedBalance, messageOnFail).toBeVisible()
    const balance = await this.auroraStakedBalance.innerText()

    return parseFloat(balance)
  }

  async clickUnstakeButton() {
    const messageOnFail = "Unstake button is not visible"
    await expect(this.unstakeButton, messageOnFail).toBeVisible()

    await this.unstakeButton.click()
  }

  async clickUnstakeModalConfirmButton() {
    const messageOnFail = "Unstake confirm modal button is not visible"
    await expect(this.unstakeConfirmModalButton, messageOnFail).toBeVisible()

    await this.unstakeConfirmModalButton.click()
  }

  async enterUnstakeAmount(amount: number) {
    const messageOnFail = "Unstake amount input field is not visible"
    await expect(this.unstakeAmountInput, messageOnFail).toBeVisible()

    await this.unstakeAmountInput.fill(amount.toString())
  }

  async confirmStakeModalGone() {
    let retries = 30
    let isModalVisible = true
    while (isModalVisible && retries >= 0) {
      await setTimeout(200)
      isModalVisible = await this.stakeConfirmModal.isVisible()
    }
    const messageOnFail =
      "Stake confirm modal should disappear"
    await expect(this.stakeConfirmModal, messageOnFail).toHaveCount(0)
  }

  async waitForAuroraBalanceUpdate(balance: number) {
    const retries = 50
    let newBalance = balance
    while (balance === newBalance && retries > 0) {
      newBalance = await this.getAuroraBalance()
      await setTimeout(200);
    }
  }

  async confirmLoadingSpinnedDisappear() {
    // await setTimeout(15000)
    const messageOnFail =
      "Modal loading spinner should disappear"
    await expect(this.loadingModalSpinner, messageOnFail).toHaveCount(0)
  }

  async confirmThatConfirmButtonDisabled() {
    const messageOnFail = "Stake confirm button in stake modal is not disabled"
    await expect(this.stakeConfirmModalButton, messageOnFail).toBeDisabled()
  }

  async confirmValuesIsCorrectAfterTransfer(initialAuroraBalance: number, updatedAuroraBalance: number, transferAmount: number) {
    const messageOnFail = `Initial Aurora balance: ${initialAuroraBalance} expected to be higher than updated: ${updatedAuroraBalance}`

    expect((initialAuroraBalance - transferAmount).toFixed(), messageOnFail).toBe(
      updatedAuroraBalance.toFixed(),
    )
  }
}
