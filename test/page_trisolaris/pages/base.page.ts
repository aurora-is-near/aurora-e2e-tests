import { expect, type Locator, type Page } from "@playwright/test"
import { TRISOLARIS_PAGE } from "../../helpers/constants/pages"

export class BasePage {
  page: Page
  homeTab: Locator
  swapTab: Locator
  stakingTab: Locator
  poolTab: Locator
  farmTab: Locator

  constructor(page: Page) {
    this.page = page
    this.homeTab = page.getByRole("link", { name: "Home" })
    this.swapTab = page.getByRole("link", { name: "Swap" })
    this.poolTab = page.getByRole("link", { name: "Pool" })
    this.stakingTab = page.getByRole("link", { name: "Stake" })
    this.farmTab = page.getByRole("link", { name: "Farm" })
  }

  async confirmCorrectPageLoaded(page: Page, urlExtension: string) {
    await expect(page, `Loaded page is not ${urlExtension}`).toHaveURL(
      `${TRISOLARIS_PAGE.baseURL}${urlExtension}`,
    )
  }

  async navigateToHomePage() {
    const url = "/"
    const messageOnFail: string = "NEAR logo is not visible"
    await expect(this.homeTab, messageOnFail).toBeVisible()
    await this.homeTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToSwapPage() {
    const url = "/swap"
    const messageOnFail: string = "Swap tab button is not visible"
    await expect(this.swapTab, messageOnFail).toBeVisible()
    await this.swapTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToPoolPage() {
    const url = "/pool"
    const messageOnFail: string = "Pool tab button is not visible"
    await expect(this.poolTab, messageOnFail).toBeVisible()
    await this.poolTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  async navigateToStakePage() {
    const url = "/stake"
    const messageOnFail: string = "Stake tab button is not visible"
    await expect(this.stakingTab, messageOnFail).toBeVisible()
    await this.stakingTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }
  async navigateToFarmPage() {
    const url = "/farm"
    const messageOnFail: string = "Farm tab button is not visible"
    await expect(this.farmTab, messageOnFail).toBeVisible()
    await this.farmTab.click()
    await this.confirmCorrectPageLoaded(this.page, url)
  }

  // async openAccountDropdown() {
  //   await expect(this.accountDropdown).toBeVisible()
  //   await this.accountDropdown.click()
  //   await expect(this.accountDropdownExpanded).toBeVisible()
  // }

  // async disconnectAccount() {
  //   await expect(this.disconnectAccountButton).toBeVisible()
  //   await this.disconnectAccountButton.click()
  //   await expect(this.loginButton).toBeVisible()
  // }

  // async copyAccountAddress() {
  //   await expect(this.copyAccountAddressButton).toBeVisible()
  //   await this.copyAccountAddressButton.click()
  // }

  // async confirmAccountLoggedIn(isLoggedIn: boolean) {
  //   if (isLoggedIn) {
  //     await expect(
  //       this.page
  //         .getByRole("banner")
  //         .getByRole("button", { name: "Log in with Ethereum" }),
  //     ).not.toBeVisible()
  //   } else {
  //     await expect(
  //         .getByRole("banner")
  //         .getByRole("button", { name: "Log in with Ethereum" }),
  //     ).toBeVisible()
  //   }
  // }
}
