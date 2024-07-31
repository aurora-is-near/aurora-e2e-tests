// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { expect, type Locator, type Page } from "@playwright/test"

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
    this.homeTab = page.getByTestId('home-tab-button')
    this.forwarderTab = page.getByTestId('forwarder-tab-button')
    this.swapTab = page.getByTestId('swap-tab-button')
    this.earnTab = page.getByTestId('earn-tab-button')
    this.appsTab = page.getByTestId('apps-tab-button')
    this.bridgeDropdown = page.getByRole("link", { name: "Bridge" })
  }

  async confirmCorrectPageLoaded(page: Page, url: string) {
    await expect(page, `Loaded page is not ${url}`).toHaveURL(
      `https://aurora.plus${url}`,
    )
  }

  async clickAuroraLogo() {
    const url = "/dashboard"
    const messageOnFail = "Aurora logo not visible"
    await expect(this.auroraLogo, messageOnFail).toBeVisible()
    await this.auroraLogo.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToHomePage() {
    const url = "/dashboard"
    const messageOnFail = "Home tab button not visible"
    await expect(this.homeTab, messageOnFail).toBeVisible()

    await this.homeTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToForwarderPage() {
    const url = "/forwarder"
    const messageOnFail = "Forwarder tab button not visible"
    await expect(this.forwarderTab, messageOnFail).toBeVisible()

    await this.forwarderTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToSwapPage() {
    const url = "/swap"
    const messageOnFail = "Swap tab button not visible"
    await expect(this.swapTab, messageOnFail).toBeVisible()

    await this.swapTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToEarnPage() {
    const url = "/earn"
    const messageOnFail = "Earn tab button not visible"
    await expect(this.earnTab, messageOnFail).toBeVisible()

    await this.earnTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToAppsPage() {
    const url = "/apps"
    const messageOnFail = "Apps tab button not visible"
    await expect(this.appsTab, messageOnFail).toBeVisible()

    await this.appsTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async selectDropDownOption(option: string) {
    const messageOnFail = "Navigate to apps dropdown not visible"
    await expect(this.bridgeDropdown, messageOnFail).toBeVisible()

    await this.bridgeDropdown.click()
    void this.page.getByText(option).click()
  }
}
