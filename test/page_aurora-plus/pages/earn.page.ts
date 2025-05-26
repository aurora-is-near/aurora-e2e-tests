import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"
import {
  longTimeout,
  midTimeout,
  shortTimeout,
} from "../../helpers/constants/timeouts"
import { parseFloatWithRounding } from "../../helpers/functions/helper-functions"

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
  availableBalanceToTrade: Locator
  insufficientFundsNotification: Locator
  approveButton: Locator
  borrowButton: Locator
  borrowMoreButton: Locator
  borrowedAmount: Locator
  amountInputField: Locator
  borrowedAmountLine: Locator
  repayButton: Locator
  myBorrowWrapper: Locator
  withdrawDepositButton: Locator
  incorrectAmountNotification: Locator
  availableBorrowAmount: Locator
  withdrawButton: Locator

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
    this.availableBalanceToTrade = page.getByText("You have")
    this.insufficientFundsNotification = page.getByText(
      "Insufficient funds, you only",
    )
    this.approveButton = page.getByRole("button", { name: "Approve" })
    this.borrowMoreButton = page.getByRole("button", { name: "Borrow More" })
    this.borrowedAmount = page.locator(
      '//*[@id="__next"]/div[1]/main/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]',
    )
    this.amountInputField = page.getByPlaceholder("0.00")
    this.borrowedAmountLine = page.getByText("You need to repay")
    this.borrowButton = page.getByRole("button", {
      name: "Borrow",
      exact: true,
    })
    this.repayButton = page.getByRole("button", { name: "Repay" })
    this.myBorrowWrapper = page.getByRole("heading", { name: "My borrow" })
    this.withdrawDepositButton = page.getByTestId("withdraw-deposit-button")
    this.incorrectAmountNotification = page.getByText(
      "You may only withdraw up to",
    )
    this.withdrawButton = page.getByRole("button", { name: "Withdraw" })
    this.availableBorrowAmount = page.getByText("You may borrow up to")
  }

  async confirmEarnPageLoaded(url: string, page = this.page) {
    await this.confirmCorrectPageLoaded(page, url)
  }

  async isOnboardingVisible(): Promise<boolean> {
    const isVisible: boolean =
      await this.firstOnboardingMessage.isVisible(shortTimeout)

    return isVisible
  }

  async skipOnboardingIfVisible() {
    await this.page.waitForTimeout(2000)

    if (await this.isOnboardingVisible()) {
      // eslint-disable-next-line no-await-in-loop
      while (await this.nextSlideButton.isVisible()) {
        // eslint-disable-next-line no-await-in-loop
        await this.nextSlideButton.click()
      }
    }

    const messageOnFail: string = "Button 'Get Started' not visible"
    await expect(this.getStartButton, messageOnFail).toBeVisible()

    await this.getStartButton.click()
  }

  async selectAuroraToDeposit() {
    const messageOnFail: string = "AURORA deposit button not visible"
    await expect(this.auroraDepositButton, messageOnFail).toBeVisible()

    await this.auroraDepositButton.click()
  }

  async clickDepositMoreButton() {
    const messageOnFail: string = '"Deposit more" button not visible'
    await expect(this.depositMoreButton, messageOnFail).toBeVisible(
      shortTimeout,
    )

    await this.depositMoreButton.click()
  }

  async enterAmountToDeposit(amount: number) {
    const messageOnFail: string = "Deposit input field not visible"
    await expect(this.depositInputField, messageOnFail).toBeVisible()
    // deposit value seems to need being filled in slowly
    await this.depositInputField.fill(amount.toString())
  }

  async confirmDeposit() {
    await this.page.waitForTimeout(5000)

    if (await this.confirmDepositButton.isVisible(shortTimeout)) {
      await this.confirmDepositButton.isEnabled(shortTimeout)
      await this.confirmDepositButton.click()
    } else if (await this.approveDepositButton.isVisible(shortTimeout)) {
      await this.approveDepositButton.click()
    } else if (await this.depositButton.isVisible(shortTimeout)) {
      await this.depositButton.click()
    } else {
      throw new Error("None of described buttons is visible")
    }
  }

  async confirmSuccessfullyDepositedNotificationVisible() {
    const messageOnFail: string =
      "Successful deposit notification do not appeared"
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

  async isAbleToDeposit(): Promise<boolean> {
    const isVisible =
      await this.insufficientFundsNotification.isVisible(midTimeout)

    return isVisible
  }

  async getDepositedTokenBalance(): Promise<number> {
    const balance: string = await this.depositedTokenBalance.innerText()

    return parseFloatWithRounding(balance, 3)
  }

  async getDepositedTokenValue(): Promise<number> {
    const value: string = await this.depositedTokenValue.innerText()

    return parseFloat(value.replace("$", ""))
  }

  async getAmountOfAvailableBalance(): Promise<number> {
    const balanceString: string = await this.availableBalanceToTrade.innerText()
    const balance: number = parseFloat(
      balanceString
        .replace("You have", "")
        .replace("AURORA available to trade", ""),
    )

    return balance
  }

  async borrowExists() {
    const isButtonVisible = await this.borrowMoreButton.isVisible(midTimeout)

    return isButtonVisible
  }

  async clickBorrowButton() {
    await expect(this.borrowButton).toBeEnabled(shortTimeout)
    await this.borrowButton.click()
  }

  async clickBorrowMoreButton() {
    await expect(this.borrowMoreButton).toBeEnabled(shortTimeout)
    await this.borrowMoreButton.click()
  }

  async getBorrowedAmount(): Promise<number> {
    await this.borrowMoreButton.waitFor({ state: "visible" })
    const borrowedAmountText = await this.borrowedAmount.innerText()
    const borrowedAmount = Number(borrowedAmountText.replace("$", ""))

    return borrowedAmount
  }

  async enterAmount(amount: number | string) {
    const string = typeof amount === "string" ? amount : amount.toFixed(4)
    await this.amountInputField.fill(string)
  }

  confirmBorrowMoreWasSuccessfull(
    amountBefore: number,
    amountAfter: number,
    transactionAmount: number,
  ) {
    const messageOnFail: string = `Expected amount is: ${amountBefore + transactionAmount}, but ${amountAfter} received`

    expect((amountBefore + transactionAmount).toFixed(4), messageOnFail).toBe(
      amountAfter.toFixed(4),
    )
  }

  async getBorrowedAmountToReturn(): Promise<string> {
    const borrowedAmountTextLine = await this.borrowedAmountLine.innerText()
    const borrowedInformation = borrowedAmountTextLine.split(",")
    const amountCurrencyInformationString = borrowedInformation[0].replace(
      "You need to repay ",
      "",
    )
    const repayAmount = amountCurrencyInformationString.split(" ")

    return repayAmount[0]
  }

  async selectTokenByTokenName(tokenName: string) {
    await this.page.getByTestId(`${tokenName}-market-borrow-button`).click()
  }

  async clickRepayButton() {
    await expect(this.repayButton).toBeEnabled(shortTimeout)
    await this.repayButton.click()
  }

  async clickApproveButton() {
    await expect(this.approveButton).toBeEnabled(shortTimeout)
    await this.approveButton.click()
  }

  async confirmBorrowExists() {
    const messageOnFail: string = "Borrow do not exist"
    await expect(this.myBorrowWrapper, messageOnFail).toBeVisible(longTimeout)
  }

  async confirmBorrowNotExists() {
    expect(await this.borrowExists()).toBeFalsy()
  }

  async clickWithdrawDeposit() {
    await this.withdrawDepositButton.click()
  }

  async confirmIncorrectAmountNotificationVisible() {
    await expect(this.incorrectAmountNotification).toBeVisible()
  }

  confirmWithdrawalSuccessfull(
    depositedValueBefore: number,
    depositedValueAfter: number,
    amount: number,
  ) {
    const messageOnFail: string = `Expected depositValue: ${depositedValueBefore - amount}, but received: ${depositedValueAfter}`
    const currentBalance = depositedValueBefore - amount
    expect(depositedValueAfter, messageOnFail).toBe(
      parseFloatWithRounding(currentBalance.toString(), 3),
    )
  }

  async confirmBorrowButtonIsNotClickable() {
    const messageOnFail: string = "Borrow button must be disabled"
    await expect(this.borrowButton, messageOnFail).toBeDisabled()
  }

  async confirmApproveButtonNotClickable() {
    const messageOnFail: string = "Approve buttone expected to be disabled"
    await expect(this.approveButton, messageOnFail).toBeDisabled()
  }

  async getAmountOfAvailableBorrowAmount(): Promise<number> {
    const balanceString = await this.availableBorrowAmount.innerText()
    const amountInfo = balanceString.replace("You may borrow up to ", "")
    const splitInfo = amountInfo.split(" ")

    return parseFloatWithRounding(splitInfo[0], 3)
  }

  async clickWitdrawButton() {
    await this.withdrawButton.hover({ timeout: 5_000 })
    await expect(this.withdrawButton).toBeEnabled(shortTimeout)
    await this.withdrawButton.click()
  }
}
