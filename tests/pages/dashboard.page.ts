// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { expect, type Locator, type Page } from "@playwright/test"
import { BasePage } from "./base.page"

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
  auroraBalanceValue: Locator
  auroraStakedValue: Locator
  gettingStartedTitle: Locator
  stakeAmountInput: Locator
  unstakeConfirmModal: Locator
  unstakeAmountInput: Locator
  unstakeButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.stakeAmountInput = page.locator("#stake-amount")
    this.unstakeAmountInput = page.locator("#stake-amount")
    this.gettingStartedTitle = page.getByText("Get started with Aurora")
    this.stakeButton = page.getByRole("button", { name: "Stake", exact: true })
    this.onboardingModal = page.getByTestId("stake-onboarding-modal")
    this.stakeConfirmModal = page.getByTestId("stake-confirm-modal")
    this.stakeRewardsModal = page.getByTestId("stake-rewards-modal")
    this.gotItContinueButton = this.onboardingModal.getByRole("button", {
      name: "Got it, continue",
    })
    this.allClearNextButton = this.onboardingModal.getByRole("button", {
      name: "All clear, next",
    })
    this.okLetsStakeButton = this.onboardingModal.getByRole("button", {
      name: "OK, let's stake",
    })
    this.stakeConfirmModalAmountInput =
      this.stakeConfirmModal.getByLabel("Amount")
    this.stakeConfirmModalButton = this.stakeConfirmModal.getByRole("button", {
      name: "Confirm",
    })
    this.loadingModalSpinner =
      this.stakeConfirmModalButton.getByTestId("loading-spinner")
    this.unstakeButton = page.getByRole("button", {
      name: "Unstake",
    })
    // exact: true,
    this.withdrawalCooldownButton = page.getByTestId(
      "withdrawal-cooldown-button",
    )
    this.auroraPendingWithdrawalAmount = page.getByTestId(
      "aurora-pending-withdrawal-amount",
    )
    this.auroraBalanceValue = page.getByTestId("aurora-balance-value")
    this.auroraStakedValue = page.getByTestId("aurora-staked-value")
    this.unstakeConfirmModal = page.getByTestId("unstake-confirm-modal")
    this.unstakeConfirmModalButton = this.unstakeConfirmModal.getByRole(
      "button",
      {
        name: "Unstake now",
      },
    )
  }

  getWalletValues = async () => {
    const balance = Number(await this.auroraBalanceValue.textContent())
    const stakedAmount = Number(await this.auroraStakedValue.textContent())

    return { balance, stakedAmount }
  }

  getPendingWithdrawalAmount = async (): Promise<number> => {
    await expect(this.withdrawalCooldownButton).toBeVisible({ timeout: 3000 })
    await this.withdrawalCooldownButton.click()

    const amount = Number(
      await this.auroraPendingWithdrawalAmount.textContent(),
    )

    await this.withdrawalCooldownButton.click()

    return amount
  }

  async isOnboardingVisible() {
    const isVisible = await this.onboardingModal.isVisible({ timeout: 20000 })

    return isVisible
  }

  async skipOnboarding() {
    await this.gotItContinueButton.click()
    await this.allClearNextButton.click()
    await this.okLetsStakeButton.click()
  }

  confirmDashboardPageLoaded() {
    expect(this.page.url()).toBe("https://aurora.plus/dashboard")
  }

  async clickStakeButton() {
    await this.stakeButton.click()
  }

  async stakeModal_enterAmount(amount: number) {
    await this.stakeAmountInput.fill(amount.toString())
  }

  async stakeModal_confirmStake() {
    await this.stakeConfirmModalButton.click()
  }

  async getAuroraBalance() {
    const balance = await this.auroraBalanceValue.innerText()

    return parseFloat(balance)
  }

  async getStakedBalance() {
    const balance = await this.auroraStakedValue.innerText()

    return parseFloat(balance)
  }

  async confirmStakeModalGone() {
    await expect(this.stakeConfirmModal).not.toBeVisible({
      timeout: 60000,
    })
  }

  async clickUnstakeButton() {
    await this.unstakeButton.click()
  }

  async clickUnstakeModalConfirmButton() {
    await this.unstakeConfirmModalButton.click()
  }

  async enterUnstakeValue(amount: number) {
    await this.unstakeAmountInput.fill(amount.toString())
  }

  async confirmLoadingSpinnedDisappear() {
    await expect(this.loadingModalSpinner).not.toBeVisible({ timeout: 60000 })
  }
}
