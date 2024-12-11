import { expect, type Locator, type Page } from "@playwright/test"
import { BasePage } from "./base.page"

export class HomePage extends BasePage {
  page: Page

  launchAppButton: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.launchAppButton = page.getByRole("link", { name: "Launch app" })
  }

  async clickLaunchAppButton() {
    await expect(
      this.launchAppButton,
      '"Launch app" button is not visible',
    ).toBeVisible()
    await this.launchAppButton.click()
  }
}
