import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"
import { shortTimeout } from "../../helpers/constants/timeouts"

export class ExplorePage extends BasePage {
  allAppElements: Locator
  searchInputField: Locator
  appsHeader: Locator
  searchSpinner: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.allAppElements = page.getByTestId("explore-apps-link")
    this.searchInputField = page.getByPlaceholder("Search dapps on NEAR")
    this.appsHeader = page.getByRole("heading", { name: "Explore" })
    this.searchSpinner = page.getByTestId("search-dapps-spinner")
  }

  async getRandomdAppName(): Promise<string> {
    await expect(this.appsHeader).toBeVisible(shortTimeout)
    const allElem = await this.allAppElements.all()
    const randomApp = allElem[Math.floor(Math.random() * allElem.length)]
    const randomAppText = await randomApp.innerText()

    return randomAppText.split("\n")[0]
  }

  async searchApp(name: string) {
    await expect(this.searchInputField).toBeVisible()
    await this.searchInputField.fill(name)
    // wait for the element to be visible
    await this.searchSpinner.waitFor({ state: "visible", timeout: 3000 })
    // Wait for the element to be hidden or removed from the DOM
    await this.searchSpinner.waitFor({ state: "hidden", timeout: 3000 })
  }

  async searchAppFilter(name: string) {
    const allElem = await this.allAppElements.all()
    const dAppNames: string[] = []

    const targetTexts = await Promise.all(
      allElem.map((elem) =>
        elem.innerText().then((innerText) => innerText.split("\n")[0]),
      ),
    )
    dAppNames.push(...targetTexts)
    expect(dAppNames).toContain(name)
    expect(dAppNames.length).toEqual(1)
  }
}
