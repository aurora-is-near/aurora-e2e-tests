import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"
import { midTimeout } from "../../helpers/constants/timeouts"

export class PortfolioPage extends BasePage {
  exampleLocator: Locator
  buyButton: Locator
  sendButton: Locator
  amountInputField: Locator
  continueButton: Locator
  nearIdInputField: Locator
  confirmAndSendButton: Locator
  confirmTransactionButton: Locator
  successNotification: Locator
  closeSuccessfulSentFundsBtn: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.exampleLocator = page.getByRole("link", { name: "Selector Name" })
    this.buyButton = page.getByRole("button", { name: "Buy" })
    this.sendButton = page.getByRole("button", { name: "Send" })
    this.amountInputField = page.getByPlaceholder("0")
    this.continueButton = page.getByRole("button", { name: "Continue" })
    this.nearIdInputField = page.getByPlaceholder("Enter NEAR account ID")
    this.confirmAndSendButton = page.getByRole("button", {
      name: "Confirm & send",
    })
    this.confirmTransactionButton = page.getByRole("button", {
      name: "Confirm transaction",
    })
    this.successNotification = page.getByText("Successfully sent!")
    this.closeSuccessfulSentFundsBtn = page.getByRole("button", {
      name: "Close",
    })
  }

  async clickBuyButton() {
    await this.buyButton.click()
  }

  async selectPaymentMethod(payment: string) {
    await this.page.getByRole("link", { name: payment }).click()
  }

  async clickSendButton() {
    await this.sendButton.click()
  }

  async selectAsset(asset: string): Promise<number> {
    const numberString = await this.page
      .getByRole("button", { name: asset })
      .getByText(RegExp(`[+-]?([0-9]*[.])?[0-9]+ ${asset}`))
      .innerText()

    await this.page
      .getByRole("button", { name: asset })
      .getByRole("heading", { name: asset, exact: true })
      .click()
    const number = Number(numberString.split(" ")[0])

    return number
  }

  async enterTransferAmount(amount: number) {
    await this.amountInputField.fill(amount.toString())
  }

  async clickContinueButton() {
    await this.continueButton.click()
  }

  async enterNearAccountId(nearId: string) {
    await this.nearIdInputField.fill(nearId)
  }

  async clickConfirmAndSend() {
    await this.confirmAndSendButton.click()
  }

  async clickConfirmTransactionButton() {
    await this.confirmTransactionButton.click()
  }

  async confirmSuccessNotificationAppears() {
    const messageOnFail: string = '"Confirm transaction" button is not visible'
    await expect(this.successNotification, messageOnFail).toBeVisible(
      midTimeout,
    )
  }

  async closeSuccessfulSentFunds() {
    await this.closeSuccessfulSentFundsBtn.click()
  }

  async getAvailableBalance(): Promise<number> {
    // we need to wait a bit since there is animation on the amount, starting from 0
    await this.page.waitForTimeout(5_000)
    const balance = await this.balanceElement.innerText()

    return parseFloat(balance)
  }

  async checkSenderBalance(previousBalance: number) {
    const currentBalance = await this.getAvailableBalance()
    expect(currentBalance).toBeLessThan(previousBalance)
  }
}
