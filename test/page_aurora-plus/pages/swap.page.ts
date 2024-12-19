import { expect, type Locator, type Page } from "playwright/test"
import { setTimeout } from "timers/promises"
import { BasePage } from "./base.page"
import { midTimeout } from "../../helpers/constants/timeouts"

export class SwapPage extends BasePage {
  swapFromContainer: Locator
  swapToContainer: Locator
  reviewSwapButton: Locator
  reviewSwapModalTitle: Locator
  approveSwapButton: Locator
  swapNowButton: Locator
  swapFromInput: Locator
  tokensWithBalance: Locator
  availableToTrade: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.swapFromContainer = page.getByTestId("swap-from-container")
    this.swapToContainer = page.getByTestId("swap-to-container")

    this.reviewSwapButton = page.getByTestId("review-swap-button")
    this.reviewSwapModalTitle = page.getByText("Review your Swap")
    this.approveSwapButton = page.getByRole("button", { name: "Approve" })
    this.swapNowButton = page.getByTestId("swap-now-button")
    this.swapFromInput = page.locator("#input-amount")
    this.tokensWithBalance = page.locator('[data-testid*="-swap-button"]')
    this.availableToTrade = page.getByText("You have ")
  }

  async confirmHomePageLoaded(url: string, page = this.page) {
    await this.confirmCorrectPageLoaded(page, url)
  }

  async selectTokenWithBalance(token: string) {
    const tokenWithBalance = this.swapFromContainer.getByTestId(
      `${token}-swap-button`,
    )

    const messageOnFail: string = `not visible in list of tokens with balance`
    await expect(tokenWithBalance, `${token} ${messageOnFail}`).toBeVisible()

    await tokenWithBalance.click()
  }

  async selectDestinationSupportedToken(token: string) {
    const supportedToken = this.swapToContainer.getByTestId(
      `${token}-swap-button`,
    )

    const messageOnFail: string = `${token} not visible in list of supported tokens`
    await expect(supportedToken, `${token} ${messageOnFail}`).toBeVisible()

    await supportedToken.click()
  }

  async enterSwapFromAmount(amount: number) {
    const messageOnFail: string = '"From" input field not visible'
    await expect(this.swapFromInput, messageOnFail).toBeVisible()

    await this.swapFromInput.fill(amount.toString())
  }

  async clickReviewSwapButton() {
    let messageOnFail: string = "Review swap button not visible"
    await expect(this.reviewSwapButton, messageOnFail).toBeVisible()
    messageOnFail = "Review swap button not enabled"
    await expect(this.reviewSwapButton, messageOnFail).toBeEnabled()

    await this.reviewSwapButton.click()
  }

  async confirmThatReviewYourSwapModalVisible() {
    const messageOnFail: string = "Review swap modal title not visible"
    await expect(this.reviewSwapModalTitle, messageOnFail).toBeVisible(
      midTimeout,
    )
  }

  async getAvailableToTradeBalance(): Promise<number> {
    const balanceString = await this.availableToTrade.innerText()
    const cleanString = balanceString
      .replace("You have ", "")
      .replace(" available to trade", "")
    const amountToken = cleanString.split(" ")

    return Number(amountToken[0])
  }

  async clickApproveSwapButton() {
    const messageOnFail: string = "Approve Swap button not visible"
    await expect(this.approveSwapButton, messageOnFail).toBeVisible()
    await this.approveSwapButton.click()
  }

  async clickSwapNowButton() {
    const messageOnFail: string = "Swap now button not visible"
    await expect(this.swapNowButton, messageOnFail).toBeVisible(midTimeout)
    await this.swapNowButton.click()
  }

  async getTokens() {
    await setTimeout(1000)

    const getTokensWithBalance = async () => {
      const tokensWithBalance = []

      const swapFromEelements = await this.swapFromContainer
        .filter({
          has: this.page.locator(
            '//button[contains(@data-testid, "swap-button")]',
          ),
        })
        .all()

      for await (const element of swapFromEelements) {
        const token = await element.innerText()
        tokensWithBalance.push(token)
      }

      return tokensWithBalance
    }

    const getAvailableTransfers = async () => {
      const tokensTransferTo = []

      const swapToElements = await this.swapToContainer
        .filter({
          has: this.page.locator(
            '//button[contains(@data-testid, "swap-button")]',
          ),
        })
        .all()

      for await (const element of swapToElements) {
        const token = await element.innerText()
        tokensTransferTo.push(token)
      }

      return tokensTransferTo
    }

    return {
      withBalance: await getTokensWithBalance(),
      availableTransfers: await getAvailableTransfers(),
    }
  }

  async confirmTransactionData(
    tokenWithBalance: string,
    destinationToken: string,
    amount: number,
  ) {
    let messageOnFail: string = `Transfer amount field with value of: "${amount.toString}" is not visible in transfer summary`
    const amountField = this.page.getByText(amount.toString())
    await expect(amountField, messageOnFail).toBeVisible()

    messageOnFail = `Token with balance: ${tokenWithBalance} is not visible in transfer summary`
    const fromCurrency = this.page.getByText(tokenWithBalance, { exact: true })
    await expect(fromCurrency, messageOnFail).toBeVisible()

    messageOnFail = `Destination token: ${destinationToken} is not visible in transfer summary`
    const toCurrency = this.page.getByText(destinationToken, { exact: true })
    await expect(toCurrency, messageOnFail).toBeVisible()
  }

  confirmTransactionWasCorrect(
    tokenWithBalance: string,
    amountBefore: number,
    amountAfter: number,
    amount: number,
  ) {
    const messageOnFail: string = `Balance of: ${tokenWithBalance} expected to be: ${amountBefore - amount}, but is: ${amountAfter}`
    expect(amountAfter, messageOnFail).toBe(amountBefore - amount)
  }

  confirmSwapWasCompleted(
    amountBefore: number,
    amountAfter: number,
    amount: number,
  ) {
    const messageOnFail: string = `Expected token balance is: ${amountBefore - amount}, but received: ${amountAfter}`
    expect(amountAfter, messageOnFail).toBe(amountBefore - amount)
  }
}
