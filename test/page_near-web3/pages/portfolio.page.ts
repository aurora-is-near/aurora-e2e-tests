import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

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
    await this.page.locator(`//h3[starts-with(text(), '${asset}')]/..`).click()
    const temp = await this.page
      .locator(`//h3[starts-with(text(), '${asset}')]/../div/p`)
      .innerText()
    const num = Number(temp.split(" ")[0])

    return num
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
    await expect(this.successNotification, messageOnFail).toBeVisible()
  }
}
