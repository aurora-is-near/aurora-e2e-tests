import { expect, type Locator, type Page } from "@playwright/test"
import { nearEnvironment } from "../../helpers/functions/system-variables"

export class BasePage {
  page: Page

  homeTab: Locator

  portfolioTab: Locator

  stakingTab: Locator

  exploreTab: Locator

  constructor(page: Page) {
    this.page = page
    this.homeTab = page.getByRole("link", { name: "Home" })
    this.portfolioTab = page.getByRole("link", { name: "Portfolio" })
    this.stakingTab = page.getByRole("link", { name: "Staking" })
    this.exploreTab = page.getByRole("link", { name: "Explore", exact: true })
  }

  async confirmCorrectPageLoaded(page: Page, urlExtension: string) {
    const url = nearEnvironment().baseURL

    await expect(page, `Loaded page is not ${urlExtension}`).toHaveURL(
      `${url}${urlExtension}`,
    )
  }

  async navigateToHomePage() {
    const url = "/"
    const messageOnFail: string = "NEAR logo is not visible"
    await expect(this.homeTab, messageOnFail).toBeVisible()
    await this.homeTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToPortfolioPage() {
    const url = "/portfolio"
    const messageOnFail: string = "Portfolio tab button is not visible"
    await expect(this.portfolioTab, messageOnFail).toBeVisible()
    await this.portfolioTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToStakingPage() {
    const url = "/staking"
    const messageOnFail: string = "Staking tab button is not visible"
    await expect(this.stakingTab, messageOnFail).toBeVisible()
    await this.stakingTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToExplorePage() {
    const url = "/explore"
    const messageOnFail: string = "Explore tab button is not visible"
    await expect(this.exploreTab, messageOnFail).toBeVisible()
    await this.exploreTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }
}
