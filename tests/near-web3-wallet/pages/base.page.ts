import { expect, type Page } from "@playwright/test"

export class BasePage {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async confirmCorrectPageLoaded(page: Page, url: string) {
    await expect(page, `Loaded page is not ${url}`).toHaveURL(
      `https://web3-wallet-three.vercel.app${url}`,
    )
  }
}
