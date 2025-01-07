import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

export class ForwarderPage extends BasePage {
  recommendedExchangesDropdown: Locator

  supportedTokensButtonDropdown: Locator

  transferTab: Locator

  historyTab: Locator

  myPointsAmount: Locator

  auroraDepositCodeCopyButton: Locator

  transfersContainerTitle: Locator

  refreshHistryButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page

    this.recommendedExchangesDropdown = page.getByText("Recommended exchanges")
    this.supportedTokensButtonDropdown = page.getByText("Supported tokens")

    this.transfersContainerTitle = page.getByText("Deposit tokens to Aurora")
    this.transferTab = page.getByRole("button", { name: "Transfer" })
    this.myPointsAmount = page.getByText("My points").locator("//div/span")
    this.auroraDepositCodeCopyButton = page.getByRole("button", {
      name: "Copy",
    })
    this.historyTab = page.getByRole("button", { name: "History" })
    this.refreshHistryButton = page.locator("//div[2]/img")
  }

  async switchToTransferTab() {
    const messageOnFail: string = "Transfer tab button not visible"
    await expect(this.transferTab, messageOnFail).toBeVisible()
    await this.transferTab.click()
  }

  async switchToHistoryTab() {
    const messageOnFail: string = "History tab button not visible"
    await expect(this.historyTab, messageOnFail).toBeVisible()
    await this.historyTab.click()
  }

  async refreshTransactionsHistory() {
    const messageOnFail: string =
      "Refresh transation button history button not visible"
    await expect(this.refreshHistryButton, messageOnFail).toBeVisible()
    await this.refreshHistryButton.click()
  }

  async selectTransaction(transaction: number) {
    const transactionContainer = this.page.locator(
      `//div/div[2]/div/div[2]/a[${transaction}]`,
    )
    const messageOnFail: string = `${transaction} transaction not visible`
    await expect(transactionContainer, messageOnFail).toBeVisible()

    return transactionContainer
  }
}
