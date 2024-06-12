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

  constructor(page: Page) {
    this.page = page
    this.auroraLogo = page.locator("//header/div/a")
    this.homeTab = page.getByRole("link", { name: "Home" })
    this.forwarderTab = page.getByRole("link", { name: "Forwarder" })
    this.swapTab = page.getByRole("link", { name: "Swap" })
    this.earnTab = page.getByRole("link", { name: "Earn" })
    this.appsTab = page.getByRole("link", { name: "Apps" })
    this.bridgeDropdown = page.getByRole("link", { name: "Bridge" })
  }

  async clickAuroraLogo() {
    await this.auroraLogo.click()
    await expect(this.page).toHaveURL("/dashboard")
  }

  async navigateToHomePage() {
    await this.homeTab.click()
    await expect(this.page).toHaveURL("/dashboard")
  }

  async navigateToForwarderPage() {
    await this.forwarderTab.click()
    await expect(this.page).toHaveURL("/forwarder")
  }

  async navigateToSwapPage() {
    await this.swapTab.click()
    await expect(this.page).toHaveURL("/swap")
  }

  async navigateToEarnPage() {
    await this.earnTab.click()
    await expect(this.page).toHaveURL("/earn")
  }

  async navigateToAppsPage() {
    await this.appsTab.click()
    await expect(this.page).toHaveURL("/apps")
  }

  async selectDropDownOption(option: string) {
    await this.bridgeDropdown.click()
    void this.page.getByText(option).click()
  }
}
