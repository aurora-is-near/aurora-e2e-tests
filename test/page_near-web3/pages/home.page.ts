import { type Locator, type Page } from "playwright/test"
import { expect } from "@playwright/test"
import { BasePage } from "./base.page"
import { longTimeout, midTimeout } from "../../helpers/constants/timeouts"

export class HomePage extends BasePage {
  swapContainer: Locator
  swapFromWallet: Locator
  swapToWallet: Locator
  fromAmountInputField: Locator
  toAmountInputField: Locator
  firstDropdownArrow: Locator
  secondDropdownArrow: Locator
  amountInputField: Locator
  swapButton: Locator
  popUpConfirmTransactionButton: Locator
  balance: Locator
  successNotificationTitle: Locator
  successNotificationCloseButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.swapContainer = page.getByRole("heading", { name: "Swap on NEAR" })
    this.swapFromWallet = page
      .locator("form")
      .getByText("NEAR", { exact: true })
    this.swapToWallet = page.getByText("REF", { exact: true })
    this.fromAmountInputField = page.getByText("NEAR~$").getByPlaceholder("0.0")
    this.toAmountInputField = page.getByText("REF~$").getByPlaceholder("0.0")
    this.firstDropdownArrow = page
      .getByRole("main")
      .getByText("NEAR", { exact: true })

    this.secondDropdownArrow = page.getByText("AURORA", {
      exact: true,
    })
    this.amountInputField = page.getByPlaceholder("0.0")
    this.swapButton = page.getByRole("button", { name: "Swap" })
    this.popUpConfirmTransactionButton = page.getByRole("button", {
      name: "Confirm transaction",
    })
    this.balance = page.getByText("Balance:")
    this.successNotificationTitle = page.getByText("Success!")
    this.successNotificationCloseButton = page.getByRole("button", {
      name: "Close",
    })
  }

  async confirmHomePageLoaded(page = this.page) {
    await this.confirmCorrectPageLoaded(page, "/")
  }

  async scrollToSwapContainer() {
    await this.swapContainer.scrollIntoViewIfNeeded()
  }

  async getFromTokenBalance(): Promise<number> {
    const messageOnFail: string = '"From" token balance is not visible'
    await expect(this.balance, messageOnFail).toBeVisible(midTimeout)
    const balanceText = (await this.balance.innerText()).toString()

    const balanceTextParsed = balanceText.split(/\s+/)
    const balance = balanceTextParsed[balanceTextParsed.length - 1]

    return parseFloat(balance)
  }

  async selectTokenToSwapFrom(tokenName: string) {
    if (tokenName !== "NEAR") {
      await this.firstDropdownArrow.click()
      const tokenSelector = this.page
        .getByText(tokenName, { exact: true })
        .first()
      const messageOnFail: string = `Token ${tokenName} was not found in token list which contains any balance`
      await expect(tokenSelector, messageOnFail).toBeVisible()
      await tokenSelector.click()
    }
  }

  async selectTokenToSwapTo(tokenName: string) {
    if (tokenName !== "AURORA") {
      // get current text in 2nd dropdown
      await this.secondDropdownArrow.click()
      const tokenSelector = this.page
        .getByText(tokenName, { exact: true })
        .first()
      const messageOnFail: string = `Token ${tokenName} was not found in token list of destination tokens`
      await expect(tokenSelector, messageOnFail).toBeVisible()
      await tokenSelector.click()
    }
  }

  async enterSwapFromAmount(amount: number) {
    const messageOnFail: string = "From input field is not visible"
    await expect(this.amountInputField, messageOnFail).toBeVisible()
    await this.amountInputField.fill(amount.toFixed(8))
  }

  async canPayGasFee(beforeBalance: number): Promise<boolean> {
    const amountInInput = parseFloat(await this.amountInputField.innerText())

    return beforeBalance - amountInInput > 0.02
  }

  async clickSwapButton() {
    const messageOnFail: string =
      '"Swap" button is disabled, while it should be enabled'
    await expect(this.swapButton, messageOnFail).toBeEnabled(longTimeout)
    await this.swapButton.click()
  }

  async confirmTransactionPopup() {
    const messageOnFail: string =
      '"Confirm transaction" in transaction overview pop-up not visible'
    await expect(this.popUpConfirmTransactionButton, messageOnFail).toBeVisible(
      longTimeout,
    )
    await this.popUpConfirmTransactionButton.click()
  }

  async confirmSuccessNotificationAppears() {
    const messageOnFail: string =
      "Pop up of successfull transaction does not appear"
    await expect(this.successNotificationTitle, messageOnFail).toBeVisible()
    await this.successNotificationCloseButton.click()
    await this.page.reload()
  }

  async isSuccessNotificationVisible() {
    const isNotificationVisible =
      await this.successNotificationTitle.isVisible(midTimeout)

    return isNotificationVisible
  }

  confirmTransactionWasCorrect(
    balanceBefore: number,
    balanceAfter: number,
    transfer: number,
  ) {
    expect(Math.round(balanceBefore - transfer)).toBeLessThanOrEqual(
      Math.round(balanceAfter),
    )
  }

  async confirmSwapButtonNotAvailable() {
    const messageOnFail: string =
      '"Swap" button is enabled, while it should be disabled'
    await expect(this.swapButton, messageOnFail).toBeDisabled()
  }
}
