import { type Locator, type Page } from "playwright/test"
import { expect } from "@playwright/test"
import { BasePage } from "./base.page"

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
    // Dropdown locators must be updated
    this.firstDropdownArrow = page
      .locator("form")
      .getByText("NEAR", { exact: true })
    this.secondDropdownArrow = page
      .locator("form")
      .getByText("REF", { exact: true })
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

  async confirmHomePageLoaded(url: string, page = this.page) {
    await this.confirmCorrectPageLoaded(page, url)
  }

  async scrollToSwapContainer() {
    await this.swapContainer.scrollIntoViewIfNeeded()
  }

  async getFromTokenBalance() {
    await this.page.waitForTimeout(2000)
    const messageOnFail: string = '"From" token balance is not visible'
    await expect(this.balance, messageOnFail).toBeVisible()
    const balanceText = await this.balance.innerText()

    return balanceText
  }

  async selectTokenToSwapFrom(tokenName: string) {
    if (tokenName !== "NEAR") {
      await this.firstDropdownArrow.click()
      // Must be updated to IDS
      const tokenSelector = this.page.getByText(tokenName, { exact: true })
      const messageOnFail: string = `Token ${tokenName} was not found in token list which contains any balance`
      await expect(tokenSelector, messageOnFail).toBeVisible()
      await tokenSelector.click()
    }
  }

  async selectTokenToSwapTo(tokenName: string) {
    if (tokenName !== "REF") {
      await this.secondDropdownArrow.click()
      const tokenSelector = this.page.getByText(tokenName, { exact: true })
      const messageOnFail: string = `Token ${tokenName} was not found in token list of destination tokens`
      await expect(tokenSelector, messageOnFail).toBeVisible()
      await tokenSelector.click()
    }
  }

  async enterSwapFromAmount(amount: number) {
    const messageOnFail: string = "From input field is not visible"
    await expect(this.amountInputField, messageOnFail).toBeVisible()
    await this.amountInputField.fill(amount.toString())
  }

  async clickSwapButton() {
    const messageOnFail: string =
      '"Swap" button is disabled, while it should be enabled'
    await expect(this.swapButton, messageOnFail).toBeEnabled()
    await this.swapButton.click()
  }

  async confirmTransactionPopup() {
    const messageOnFail: string =
      '"Confirm transaction" in transaction overview pop-up not visible'
    await expect(
      this.popUpConfirmTransactionButton,
      messageOnFail,
    ).toBeVisible()
    await this.popUpConfirmTransactionButton.click()
  }

  async confirmSuccessNotificationAppears() {
    const messageOnFail: string =
      "Pop up of successfull transaction does not appear"
    await expect(this.successNotificationTitle, messageOnFail).toBeVisible()
    await this.successNotificationCloseButton.click()
    await this.page.reload()
  }

  confirmTransactionWasCorrect(
    balanceBeforeString: string,
    balanceAfterString: string,
    transfer: number,
  ) {
    const balanceBefore = Number(balanceBeforeString.replace("Balance: ", ""))
    const balanceAfter = Number(balanceAfterString.replace("Balance: ", ""))

    expect((balanceBefore - transfer).toFixed()).toBe(balanceAfter)
  }

  async confirmSwapButtonNotAvailable() {
    const messageOnFail: string =
      '"Swap" button is enabled, while it should be disabled'
    await expect(this.swapButton, messageOnFail).toBeDisabled()
  }

  async restoreToDefaultTokens(tokenFrom: string, tokenTo: string) {
    await this.page
      .locator("form")
      .getByText(tokenFrom, { exact: true })
      .click()
    await this.page.getByText("NEAR", { exact: true }).click()

    await this.page.getByText(tokenTo, { exact: true }).click()
    await this.page.getByText("REF", { exact: true }).click()
  }
}
