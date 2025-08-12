import type { Locator, Page } from "playwright"

export class LoginPage {
  page: Page
  emailInput: Locator
  sendSignInLink: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByPlaceholder("Email address")
    this.sendSignInLink = page.getByRole("button", {
      name: "Send sign-in link",
    })
  }

  async writeEmailAddressAndSend(email: string) {
    await this.emailInput.isVisible()
    await this.emailInput.fill(email)

    await this.sendSignInLink.isVisible()
    await this.sendSignInLink.click()
  }
}
