import { expect, type Locator, type Page } from "@playwright/test"
import { NEAR_INTENTS_PAGE } from "../../helpers/constants/pages"

export class BasePage {
  page: Page
  nearIntentsLogo: Locator
  depositTab: Locator

  constructor(page: Page) {
    this.page = page
    this.nearIntentsLogo = page.getByAltText("Near Intent Logo")
    this.depositTab = page.getByRole("button", { name: "Deposit" })
  }

  async confirmCorrectPageLoaded(page: Page, url: string) {
    const messageOnFail: string = `Loaded page is not ${url}`
    await expect(page, messageOnFail).toHaveURL(
      `${NEAR_INTENTS_PAGE.baseURL}${url}`,
    )

    await page.waitForLoadState()
  }

  async clickNearIntentsLogo() {
    const url: string = "/dashboard"
    const messageOnFail: string = "Near-Intents logo not visible"
    await expect(this.nearIntentsLogo, messageOnFail).toBeVisible()
    await this.nearIntentsLogo.click()
    await this.page.waitForLoadState("domcontentloaded")
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToDepositPage() {
    const url: string = "/deposit"
    const messageOnFail: string = "Deposit tab button not visible"
    await expect(this.depositTab, messageOnFail).toBeVisible()

    await this.depositTab.click()
    await this.page.waitForLoadState("domcontentloaded")
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async timeout(seconds: number) {
    await this.page.waitForTimeout(seconds * 1000)
  }

  async waitForActionToComplete() {
    await this.page.waitForTimeout(15000)
  }
}
