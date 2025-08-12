import { expect, type Locator, type Page } from "@playwright/test"
import { setTimeout } from "timers/promises"
import { BasePage } from "./base.page"
import {
  longTimeout,
  midTimeout,
  shortTimeout,
} from "../../helpers/constants/timeouts"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"

type PendingWithdrawal = {
  amount: number
  days: string | null
}

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
  auroraPendingWithdrawalBtn: Locator
  auroraPendingWithdrawalDays: Locator
  auroraBalance: Locator
  auroraStakedBalance: Locator
  gettingStartedTitle: Locator
  stakeAmountInput: Locator
  unstakeConfirmModal: Locator
  unstakeAmountInput: Locator
  unstakeButton: Locator
  connectWalletButton: Locator
  modalConnectWalletButton: Locator
  skipIHaveWalletButton: Locator
  modalMetamaskButton: Locator
  acceptAndSignButton: Locator
  availableBalance: Locator
  stakeConfirmButton: Locator
  unstakeConfirmButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.gettingStartedTitle = page.getByText("Get started with Aurora")
    this.stakeButton = page.getByTestId("stake-button")
    this.unstakeButton = page.getByTestId("unstake-button")
    this.onboardingModal = page.getByTestId("stake-onboarding-modal")
    this.stakeAmountInput = page.locator("#stake-amount")
    this.unstakeAmountInput = page.getByPlaceholder("0.00")
    this.stakeConfirmModal = page.getByTestId("stake-confirm-modal")
    this.stakeRewardsModal = page.getByTestId("stake-rewards-modal")
    this.gotItContinueButton = page.getByTestId("got-it-button")
    this.allClearNextButton = page.getByTestId("all-clear-button")
    this.okLetsStakeButton = page.getByTestId("lets-stake-button")
    this.stakeConfirmModalAmountInput =
      this.stakeConfirmModal.getByLabel("Amount")
    this.stakeConfirmModalButton = page.getByRole("button", { name: "Confirm" })
    this.loadingModalSpinner =
      this.stakeConfirmModalButton.getByTestId("loading-spinner")
    this.withdrawalCooldownButton = page.getByTestId(
      "withdrawal-cooldown-button",
    )
    this.auroraPendingWithdrawalAmount = page.getByTestId(
      "aurora-pending-withdrawal-amount",
    )

    this.auroraPendingWithdrawalBtn = page.getByTestId(
      "aurora-pending-withdrawal",
    )
    this.auroraPendingWithdrawalDays = page.getByText("Available in")
    this.auroraBalance = page.getByTestId("aurora-balance-value")
    this.auroraStakedBalance = page.getByTestId("aurora-staked-value")
    this.unstakeConfirmModal = page.getByTestId("unstake-confirm-modal")
    this.unstakeConfirmModalButton = page.getByTestId("unstake-now-button")
    this.connectWalletButton = page.getByRole("button", {
      name: "Connect wallet",
    })
    this.modalConnectWalletButton = page
      .getByLabel("Connect and authenticate")
      .getByRole("button", { name: "Connect wallet" })

    this.skipIHaveWalletButton = page.getByRole("button", {
      name: "Skip, I have a wallet",
    })
    this.modalMetamaskButton = page.getByRole("button", {
      name: "MetaMask MetaMask",
    })
    this.acceptAndSignButton = page.getByRole("button", {
      name: "Accept and sign",
    })
    this.availableBalance = page.getByText("You have")
    this.stakeConfirmButton = page.getByRole("button", { name: "Confirm" })
    this.unstakeConfirmButton = page.getByRole("button", {
      name: "Unstake now",
    })
  }

  async confirmDashboardPageLoaded() {
    await expect(this.page).toHaveURL(`${AURORA_PLUS_PAGE.baseURL}/dashboard`)
  }

  async waitForStakeModalToDisappear() {
    const messageOnFail: string = "Unstake modal still visible after 25s"
    await expect(this.unstakeConfirmModal, messageOnFail).not.toBeVisible(
      longTimeout,
    )
  }

  async waitForUnstakeModalToDisappear() {
    const messageOnFail: string = "Stake modal still visible after 25s"
    await expect(this.stakeConfirmModal, messageOnFail).not.toBeVisible(
      longTimeout,
    )
  }

  async clickConfirmStakeButton() {
    const messageOnFail: string = "Confirm button in stake modal is not visible"
    await expect(this.stakeConfirmButton, messageOnFail).toBeVisible()
    await this.stakeConfirmButton.click()
  }

  async getAvailableStakeBalance(): Promise<number> {
    const messageOnFail: string = "Available balance for staking is not visible"
    await expect(this.availableBalance, messageOnFail).toBeVisible()
    const balance = (await this.availableBalance.innerText())
      .replace("You have ", "")
      .replace(" AURORA available to stake.", "")

    return parseFloat(balance)
  }

  async clickConnectWalletButton() {
    const messageOnFail: string = '"Connect wallet" button is not visible'
    await expect(this.connectWalletButton, messageOnFail).toBeVisible(
      shortTimeout,
    )
    await this.connectWalletButton.click()
  }

  async clickConnectWalletButtonInModal() {
    const messageOnFail: string = '"Connect wallet" button in modal not visible'
    await expect(this.modalConnectWalletButton, messageOnFail).toBeVisible(
      shortTimeout,
    )
    await this.modalConnectWalletButton.click()
  }

  async clickSkipIHaveWallet() {
    const messageOnFail: string =
      '"Skip, I have a wallet" button is not visible'
    await expect(this.skipIHaveWalletButton, messageOnFail).toBeVisible(
      shortTimeout,
    )
    await this.skipIHaveWalletButton.click()
  }

  async selectMetaMaskWalletInModal() {
    const messageOnFail: string =
      '"MetaMask" wallet button not visible in modal'
    await expect(this.modalMetamaskButton, messageOnFail).toBeVisible(
      shortTimeout,
    )
    await this.modalMetamaskButton.click()
  }

  async clickAcceptAndSignButton() {
    const messageOnFail: string = '"Accept and sign" button not visible'
    await expect(this.acceptAndSignButton, messageOnFail).toBeVisible(
      shortTimeout,
    )
    await this.acceptAndSignButton.click()
  }

  async isAnyPendingWithdrawals(): Promise<boolean> {
    const isVisible: boolean = await this.withdrawalCooldownButton.isVisible()

    return isVisible
  }

  async getPendingWithdrawalAmount(): Promise<PendingWithdrawal> {
    let messageOnFail: string = "Withdrawal cooldown button is not visible"
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

    const daysRaw = await this.auroraPendingWithdrawalDays.textContent()
    const days = daysRaw!.split("Available in")[1].split(" days")[0]
    await this.withdrawalCooldownButton.click()

    return { amount, days }
  }

  async isPendingWithdrawalAvailable(): Promise<boolean> {
    const isEnabled: boolean = await this.auroraPendingWithdrawalBtn.isEnabled()

    return isEnabled
  }

  async skipOnboardingIfVisible() {
    let retries = 30
    let isVisible = false

    while (!isVisible && retries > 0) {
      // eslint-disable-next-line no-await-in-loop
      isVisible = await this.onboardingModal.isVisible()
      retries -= 1

      // eslint-disable-next-line no-await-in-loop
      await this.page.waitForTimeout(200)
    }

    if (isVisible) {
      let messageOnFail: string = 'Button "Got it, Continue" is not visible'
      await expect(this.gotItContinueButton, messageOnFail).toBeVisible()
      await this.gotItContinueButton.click()

      messageOnFail = 'Button "All clear, Next" is not visible'
      await expect(this.allClearNextButton, messageOnFail).toBeVisible()
      await this.allClearNextButton.click()

      messageOnFail = 'Button "OK, Lets stake" is not visible'
      await expect(this.okLetsStakeButton, messageOnFail).toBeVisible()
      await this.okLetsStakeButton.click()
    }
  }

  async clickStakeButton() {
    const messageOnFail: string = "Stake button is not visible"
    await expect(this.stakeButton, messageOnFail).toBeVisible()
    await this.stakeButton.click()
  }

  async enterStakeAmount(amount: number) {
    const messageOnFail: string =
      "Stake amount input field in stake modal is not visible"
    await expect(this.stakeAmountInput, messageOnFail).toBeVisible()
    await this.stakeAmountInput.fill(amount.toString())
  }

  async stakeModal_confirmStake() {
    const messageOnFail: string =
      "Stake confirm button in stake modal is not visible"
    await expect(this.stakeConfirmModalButton, messageOnFail).toBeVisible()
    await this.stakeConfirmModalButton.click()
  }

  async getAuroraBalance(): Promise<number> {
    const messageOnFail: string = "Aurora balance is not visible"
    await expect(this.auroraBalance, messageOnFail).toBeVisible()
    const balance = await this.auroraBalance.innerText()

    return parseFloat(balance)
  }

  async getStakedBalance(): Promise<number> {
    const messageOnFail: string = "Aurora staked balance is not visible"
    await expect(this.auroraStakedBalance, messageOnFail).toBeVisible()
    const balance = await this.auroraStakedBalance.innerText()

    return parseFloat(balance)
  }

  async clickUnstakeButton() {
    const messageOnFail: string = "Unstake button is not visible"
    await expect(this.unstakeButton, messageOnFail).toBeVisible()

    await this.unstakeButton.click()
  }

  async clickUnstakeModalConfirmButton() {
    const messageOnFail: string = "Unstake confirm modal button is not visible"
    await expect(this.unstakeConfirmModalButton, messageOnFail).toBeVisible()

    await this.unstakeConfirmModalButton.click()
  }

  async enterUnstakeAmount(amount: number) {
    const messageOnFail: string = "Unstake amount input field is not visible"
    await expect(this.unstakeAmountInput, messageOnFail).toBeVisible()

    await this.unstakeAmountInput.fill(amount.toString())
  }

  async confirmStakeModalGone() {
    const retries = 30
    let isModalVisible = true

    while (isModalVisible && retries >= 0) {
      // eslint-disable-next-line no-await-in-loop
      await this.page.waitForTimeout(200)

      // eslint-disable-next-line no-await-in-loop
      isModalVisible = await this.stakeConfirmModal.isVisible()
    }

    const messageOnFail: string = "Stake confirm modal should disappear"
    await expect(this.stakeConfirmModal, messageOnFail).not.toBeVisible(
      midTimeout,
    )
  }

  async waitForAuroraBalanceUpdate(balance: number) {
    const retries = 50
    let newBalance = balance

    while (balance === newBalance && retries > 0) {
      // eslint-disable-next-line no-await-in-loop
      newBalance = await this.getAuroraBalance()

      // eslint-disable-next-line no-await-in-loop
      await setTimeout(200)
    }
  }

  async confirmLoadingSpinnedDisappear() {
    const messageOnFail: string = "Modal loading spinner should disappear"
    await expect(this.loadingModalSpinner, messageOnFail).not.toBeVisible(
      midTimeout,
    )
  }

  async confirmThatConfirmButtonDisabled() {
    const messageOnFail: string =
      "Stake confirm button in stake modal is not disabled"
    await expect(this.stakeConfirmModalButton, messageOnFail).toBeDisabled()
  }

  async clickUnstakeConfirmButton() {
    const messageOnFail: string =
      "Unstake confirm button in unstake modal is not enabled"
    await expect(this.unstakeConfirmButton, messageOnFail).toBeEnabled()
    await this.unstakeConfirmButton.click()
  }

  async confirmThatUnstakeButtonDisabled() {
    const messageOnFail: string =
      "Unstake confirm button in unstake modal is not disabled"
    await expect(this.unstakeConfirmButton, messageOnFail).toBeDisabled()
  }

  async confirmFavoriteAppsHasApp(name: string) {
    const allElem = await this.page
      .getByTestId("explore-apps-link-favorites")
      .all()
    const dAppNames: string[] = []
    const targetTexts = await Promise.all(
      allElem.map((elem) =>
        elem.innerText().then((innerText) => innerText.split("\n")[0]),
      ),
    )
    dAppNames.push(...targetTexts)
    expect(dAppNames).toContain(name)
  }

  /**
   *
   * @param initialAuroraBalance {number} Initial balance
   * @param updatedAuroraBalance {number} Balance after transaction were made
   * @param transferAmount {number} Amount that was transfered
   */
  confirmValuesIsCorrectAfterTransfer(
    initialAuroraBalance: number,
    updatedAuroraBalance: number,
    transferAmount: number,
  ) {
    const messageOnFail: string = `Initial Aurora balance: ${initialAuroraBalance} expected to be higher than updated: ${updatedAuroraBalance}`

    expect(
      (initialAuroraBalance - transferAmount).toFixed(),
      messageOnFail,
    ).toBe(updatedAuroraBalance.toFixed())
  }
}
