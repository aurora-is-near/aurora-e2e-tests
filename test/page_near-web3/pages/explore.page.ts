import { type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

export class ExplorePage extends BasePage {
  exampleLocator: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.exampleLocator = page.getByRole("link", { name: "Selector Name" })
  }
}
