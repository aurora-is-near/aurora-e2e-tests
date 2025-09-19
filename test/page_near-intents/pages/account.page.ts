import { expect, type Locator, type Page } from "@playwright/test"
import { BasePage } from "./base.page"
import { NEAR_INTENTS_PAGE } from "../../helpers/constants/pages"
import { midTimeout } from "../../helpers/constants/timeouts"

export class AccountPage extends BasePage {
  page: Page
  withdrawBtn: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.withdrawBtn = page.getByLabel("Withdraw")
  }

  async confirmAccountPageLoaded() {
    await expect(this.page).toHaveURL(`${NEAR_INTENTS_PAGE.baseURL}/account`)
  }

  async pressAccountsBtn() {
    await expect(this.withdrawBtn).toBeVisible(midTimeout)
    await this.withdrawBtn.click()
  }


}
