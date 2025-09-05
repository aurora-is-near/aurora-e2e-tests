import { expect, type Locator, type Page } from "playwright/test"
import {
  longTimeout,
  midTimeout,
  miniTimeout,
  shortTimeout,
} from "../../helpers/constants/timeouts"
import { BasePage } from "./base.page"

export class SwapPage extends BasePage {
  swapCurrencyInputSelector: Locator
  swapCurrencyOutputSelector: Locator
  swapCurrentInputField: Locator
  swapCurrentOutputField: Locator
  noLiquidity: Locator
  searchTokenField: Locator
  fromBalance: Locator
  toBalance: Locator
  swapAnywayBtn: Locator
  swapBtn: Locator
  confirmSwapBtn: Locator
  priceImpactHigh: Locator
  trisolarisBalance: Locator
  closeSuccessNotificationDialogBtn: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.swapCurrencyInputSelector = page
      .locator("#swap-currency-input")
      .getByRole("button")
    this.swapCurrencyOutputSelector = page
      .locator("#swap-currency-output")
      .getByRole("button")

    this.swapCurrentInputField = page
      .locator("#swap-currency-input")
      .getByPlaceholder("0.0")

    this.swapCurrentOutputField = page
      .locator("#swap-currency-output")
      .getByPlaceholder("0.0")

    this.noLiquidity = page.getByText("Insufficient liquidity for")
    this.priceImpactHigh = page.getByText("Price Impact High")
    this.searchTokenField = page.getByPlaceholder(
      "Search name or paste address",
    )

    this.fromBalance = page.getByText("FromBalance:")
    this.toBalance = page.getByText("ToBalance:")

    this.swapAnywayBtn = page.getByRole("button", { name: "Swap  Anyway" })
    this.swapBtn = page.getByRole("button", { name: "Swap" })
    this.confirmSwapBtn = page.getByRole("button", { name: "Confirm Swap" })
    this.trisolarisBalance = page.getByRole("button", { name: "$0." })
    this.closeSuccessNotificationDialogBtn = page.getByRole("button", {
      name: "Close",
    })
  }

  async selectTokenToSwapFrom(asset: string, searchForAsset: boolean = false) {
    const messageOnFail: string = `Token ${asset} was not found in input token list which contains any balance`
    await expect(this.swapCurrencyInputSelector, messageOnFail).toBeVisible()
    await this.swapCurrencyInputSelector.click()

    if (searchForAsset) {
      await expect(this.searchTokenField).toBeVisible()
      await this.searchTokenField.fill(asset)
    }

    const swapTokenFromSelector = (
      await this.page.locator("div.css-8mokm4").all()
    ).filter(async (element) => (await element.innerText()) === asset)[0]

    await swapTokenFromSelector.click()
  }

  async selectTokenToSwapTo(asset: string, searchForAsset: boolean = false) {
    const messageOnFail: string = `Token ${asset} was not found in output token list which contains any balance`
    await expect(this.swapCurrencyOutputSelector, messageOnFail).toBeVisible()
    await this.swapCurrencyOutputSelector.click()

    if (searchForAsset) {
      await expect(this.searchTokenField).toBeVisible()
      await this.searchTokenField.fill(asset)
    }

    const swapTokenToSelector = (
      await this.page.locator("div.css-8mokm4").all()
    ).filter(async (element) => (await element.innerText()) === asset)[0]

    await swapTokenToSelector.click()
  }

  async enterSwapFromAmount(amount: number) {
    await this.swapCurrentInputField.isVisible(shortTimeout)
    await this.swapCurrentInputField.fill(amount.toString())
  }

  async confirmInsufficientLiquidity() {
    await this.noLiquidity.isVisible(midTimeout)
  }

  async isNotAvailableToSwap(): Promise<boolean> {
    try {
      await expect(this.swapBtn).toBeVisible(miniTimeout)

      return false
    } catch {
      return true
    }
  }

  async isPriceImpactTooHigh(): Promise<boolean> {
    const isVisible: boolean = await this.priceImpactHigh.isVisible(miniTimeout)

    return isVisible
  }

  async getFromTokenBalance() {
    await this.fromBalance.isVisible(midTimeout)
    const temp = await this.fromBalance.innerText()
    const m = temp.match(/[-+]?\d+(?:\.\d+)?/)
    const num = m ? parseFloat(m[0]) : NaN

    return num
  }

  async clickSwapButton() {
    await expect(this.swapBtn).toBeVisible(shortTimeout)
    await this.swapBtn.click()
  }

  async confirmSwapping() {
    await expect(this.confirmSwapBtn).toBeVisible(shortTimeout)
    await this.confirmSwapBtn.click()
  }

  async isSuccessNotificationVisible(): Promise<boolean> {
    const transactionConfirmDialog = this.page
      .getByLabel("dialog")
      .locator("div")
      .filter({ hasText: "Transaction SubmittedView on" })
      .nth(1)

    await expect(transactionConfirmDialog).toBeVisible()
    const isVisible = await transactionConfirmDialog.isVisible(shortTimeout)

    return isVisible
  }

  async closeSuccessNotificationDialog() {
    await expect(this.closeSuccessNotificationDialogBtn).toBeVisible()
    await this.closeSuccessNotificationDialogBtn.click()
  }

  async waitForBalanceToLoad() {
    await expect(this.trisolarisBalance).toBeVisible(longTimeout)
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
}
