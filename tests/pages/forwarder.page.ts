import type { Locator, Page } from "playwright/test"
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
    // this.auroraDepositCodeHint =
    this.auroraDepositCodeCopyButton = page.getByRole("button", {
      name: "Copy",
    })
    // this.auroraDepositQrCode =
    //   this.walletHint =
    //   this.transferFee =
    this.historyTab = page.getByRole("button", { name: "History" })
    this.refreshHistryButton = page.locator("//div[2]/img")
  }

  async switchToTransferTab() {
    await this.transferTab.click()
  }

  async switchToHistoryTab() {
    await this.historyTab.click()
  }

  async refreshTransactionsHistory() {
    await this.refreshHistryButton.click()
  }

  selectTransaction(transaction: number) {
    const transactionContainer = this.page.locator(
      `//div/div[2]/div/div[2]/a[${transaction}]`,
    )

    return transactionContainer
  }
}
