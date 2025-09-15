import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"
import {
  longTimeout,
  midTimeout,
  miniTimeout,
  shortTimeout,
} from "../../helpers/constants/timeouts"

export class PoolPage extends BasePage {
  addLiquidityBtn: Locator
  createPairBtn: Locator
  poolCurrencyInputSelector: Locator
  poolCurrencyOutputSelector: Locator
  poolCurrentInputField: Locator
  poolCurrentOutputField: Locator
  searchTokenField: Locator
  supplyBtn: Locator
  confirmSupplyBtn: Locator
  closeSuccefulTxDialog: Locator
  trisolarisBalance: Locator
  importPoolLink: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.addLiquidityBtn = this.page.getByRole("link", {
      name: "Add liquidity",
    })

    this.poolCurrencyInputSelector = page
      .locator("#add-liquidity-input-tokena")
      .getByRole("button")
    this.poolCurrencyOutputSelector = page
      .locator("#add-liquidity-input-tokenb")
      .getByRole("button")

    this.poolCurrentInputField = page
      .locator("#add-liquidity-input-tokena")
      .getByPlaceholder("0.0")

    this.poolCurrentOutputField = page
      .locator("#add-liquidity-input-tokenb")
      .getByPlaceholder("0.0")

    this.searchTokenField = page.getByPlaceholder(
      "Search name or paste address",
    )
    this.supplyBtn = page.getByRole("button", { name: "Supply" })
    this.confirmSupplyBtn = page.getByRole("button", { name: "Confirm Supply" })
    this.closeSuccefulTxDialog = page.getByRole("button", { name: "Close" })
    this.createPairBtn = page.getByRole("link", { name: "Create a pair" })
    this.trisolarisBalance = page.getByRole("button", { name: "$0." })
    this.importPoolLink = page.getByRole("link", { name: "Import it." })
  }

  async confirmPoolPageLoaded(page = this.page) {
    await this.confirmCorrectPageLoaded(page, "/pool")
  }

  async clickAddLiquidity() {
    await expect(this.addLiquidityBtn).toBeVisible(miniTimeout)
    await this.addLiquidityBtn.click()
  }

  async clickCreatePair() {
    await expect(this.createPairBtn).toBeVisible(miniTimeout)
    await this.createPairBtn.click()
  }

  async selectTokenToPoolFrom(asset: string, searchForAsset: boolean = false) {
    const messageOnFail: string = `Token ${asset} was not found in input token list which contains any balance`
    await expect(this.poolCurrencyInputSelector, messageOnFail).toBeVisible()
    await this.poolCurrencyInputSelector.click()

    if (searchForAsset) {
      await expect(this.searchTokenField).toBeVisible()
      await this.searchTokenField.fill(asset)
    }

    const swapTokenFromSelector = this.page.getByText(asset, { exact: true })

    await swapTokenFromSelector.click()
  }

  async selectTokenToPoolTo(asset: string, searchForAsset: boolean = false) {
    const messageOnFail: string = `Token ${asset} was not found in output token list which contains any balance`
    await expect(this.poolCurrencyOutputSelector, messageOnFail).toBeVisible()
    await this.poolCurrencyOutputSelector.click()

    if (searchForAsset) {
      await expect(this.searchTokenField).toBeVisible()
      await this.searchTokenField.fill(asset)
    }

    const swapTokenToSelector = this.page.getByText(asset, { exact: true })
    await swapTokenToSelector.click()
  }

  async enterPoolFromAmount(amount: number) {
    await this.poolCurrentInputField.isVisible(shortTimeout)
    await this.poolCurrentInputField.fill(amount.toString())
  }

  async isNotAvailableToPool(fromToken: string): Promise<boolean> {
    const insufficientBalanceBtn = this.page.getByRole("button", {
      name: `Insufficient ${fromToken} balance`,
    })

    const isVisible: boolean =
      await insufficientBalanceBtn.isVisible(midTimeout)

    return isVisible
  }

  async clickSupply() {
    await expect(this.supplyBtn).toBeVisible(longTimeout)
    await expect(this.supplyBtn).toBeEnabled(longTimeout)
    await this.supplyBtn.click()
  }

  async confirmSupply() {
    await expect(this.confirmSupplyBtn).toBeVisible(longTimeout)
    await expect(this.confirmSupplyBtn).toBeEnabled(longTimeout)
    await this.confirmSupplyBtn.click()
  }

  async closeSuccessNotificationDialog() {
    await expect(this.closeSuccefulTxDialog).toBeVisible(longTimeout)
    await this.closeSuccefulTxDialog.click()
  }

  async confirmTransactionIsDone(
    txFrom: string,
    txTo: string,
    amountFrom: number,
    amountTo: number,
  ) {
    const txConfirmedDialog = this.page.getByText(
      `Add ${amountFrom} ${txFrom} and ${amountTo} ${txTo}`,
    )
    await txConfirmedDialog.isVisible(longTimeout)
    await this.page.waitForTimeout(5_000)
  }

  async getConvertedAmount(): Promise<number> {
    const result = await this.poolCurrentOutputField.innerText()

    return Number(result)
  }

  async waitForBalanceToLoad() {
    await expect(this.trisolarisBalance).toBeVisible(longTimeout)
  }

  async importPool(
    fromToken: string,
    toToken: string,
    searchForAsset: boolean,
  ) {
    await expect(this.importPoolLink).toBeVisible(shortTimeout)
    await this.importPoolLink.click()

    const temp1 = this.page.getByRole("button", { name: "ETH" })
    const temp2 = this.page.getByRole("button", { name: "Select a Token" })

    await temp1.click()

    if (searchForAsset) {
      await expect(this.searchTokenField).toBeVisible()
      await this.searchTokenField.fill(fromToken)
    }

    const swapTokenFromSelector = this.page.getByText(fromToken, {
      exact: true,
    })
    await swapTokenFromSelector.click()

    await temp2.click()

    if (searchForAsset) {
      await expect(this.searchTokenField).toBeVisible()
      await this.searchTokenField.fill(toToken)
    }

    const swapTokenToSelector = this.page.getByText(toToken, {
      exact: true,
    })
    await swapTokenToSelector.click()

    const importThisPoolLink = this.page.getByRole("link", {
      name: "Import this pool",
    })

    await expect(importThisPoolLink).toBeVisible(midTimeout)
    await importThisPoolLink.click()
  }

  async assertLiquidityPairVisible() {
    // await this.page.pause()
  }

  private escapeRegExp(text: string) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  composeExactRegex(tokenFrom: string, tokenTo: string, separator = "/") {
    const t1 = this.escapeRegExp(tokenFrom)
    const t2 = this.escapeRegExp(tokenTo)
    const sep = this.escapeRegExp(separator)
    const pattern = `^${t1}${sep}${t2}$`

    return new RegExp(pattern)
  }
}
