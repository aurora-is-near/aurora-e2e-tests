import { expect, type Locator, type Page } from "@playwright/test"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"

export class BasePage {
  page: Page
  auroraLogo: Locator
  homeTab: Locator
  forwarderTab: Locator
  swapTab: Locator
  earnTab: Locator
  appsTab: Locator
  bridgeDropdown: Locator
  svgLogo: Locator

  constructor(page: Page) {
    this.page = page
    this.svgLogo = page.getByTestId("aurora-logo")
    this.auroraLogo = page.locator("a").filter({ has: this.svgLogo })
    this.homeTab = page.getByTestId("home-tab-button")
    this.forwarderTab = page.getByTestId("forwarder-tab-button")
    this.swapTab = page.getByTestId("swap-tab-button")
    this.earnTab = page.getByTestId("earn-tab-button")
    this.appsTab = page.getByTestId("apps-tab-button")
    this.bridgeDropdown = page.getByRole("link", { name: "Bridge" })
  }

  async confirmCorrectPageLoaded(page: Page, url: string) {
    const messageOnFail: string = `Loaded page is not ${url}`
    await expect(page, messageOnFail).toHaveURL(
      `${AURORA_PLUS_PAGE.baseURL}${url}`,
    )

    await page.waitForLoadState()
  }

  async clickAuroraLogo() {
    const url: string = "/dashboard"
    const messageOnFail: string = "Aurora logo not visible"
    await expect(this.auroraLogo, messageOnFail).toBeVisible()
    await this.auroraLogo.click()
    await this.page.waitForLoadState("domcontentloaded")
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToHomePage() {
    const url: string = "/dashboard"
    const messageOnFail: string = "Home tab button not visible"
    await expect(this.homeTab, messageOnFail).toBeVisible()

    await this.homeTab.click()
    await this.page.waitForLoadState("domcontentloaded")
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToForwarderPage() {
    const url: string = "/forwarder"
    const messageOnFail: string = "Forwarder tab button not visible"
    await expect(this.forwarderTab, messageOnFail).toBeVisible()

    await this.forwarderTab.click()
    await this.page.waitForLoadState("domcontentloaded")
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToSwapPage() {
    const url: string = "/swap"
    const messageOnFail: string = "Swap tab button not visible"
    await expect(this.swapTab, messageOnFail).toBeVisible()

    await this.swapTab.click()
    await this.page.waitForLoadState("domcontentloaded")
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToEarnPage() {
    const url: string = "/earn"
    const messageOnFail: string = "Earn tab button not visible"
    await expect(this.earnTab, messageOnFail).toBeVisible()

    await this.earnTab.click()
    await this.page.waitForLoadState("domcontentloaded")
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToAppsPage() {
    const url: string = "/apps"
    const messageOnFail: string = "Apps tab button not visible"
    await expect(this.appsTab, messageOnFail).toBeVisible()

    await this.appsTab.click()
    await this.page.waitForLoadState("domcontentloaded")
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async selectDropDownOption(option: string) {
    const messageOnFail: string = "Navigate to apps dropdown not visible"
    await expect(this.bridgeDropdown, messageOnFail).toBeVisible()

    await this.bridgeDropdown.click()
    void this.page.getByText(option).click()
  }

  async timeout(seconds: number) {
    await this.page.waitForTimeout(seconds)
  }

  async waitForActionToComplete() {
    await this.page.waitForTimeout(15000)
  }
}
