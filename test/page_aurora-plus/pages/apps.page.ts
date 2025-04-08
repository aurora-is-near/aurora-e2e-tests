import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

export class AppsPage extends BasePage {
  allAppElements: Locator
  searchInputField: Locator
  favoritesSection: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.allAppElements = page.getByTestId("explore-apps-link")
    this.searchInputField = page.getByPlaceholder("Search projects by name")
    this.favoritesSection = page.getByRole("button", { name: "Favourites" })
  }

  async getRandomdAppName(): Promise<string> {
    const allElem = await this.allAppElements.all()
    const randomApp = allElem[Math.floor(Math.random() * allElem.length)]
    const randomAppText = await randomApp.innerText()

    return randomAppText.split("\n")[0]
  }

  async fillAppSearch(name: string) {
    await expect(this.searchInputField).toBeVisible()
    await this.searchInputField.fill(name)
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

  async saveAppAsFavorite(appName: string) {
    const favoriteBtn = this.page
      .getByRole("link", { name: appName })
      .getByRole("button")
    await expect(favoriteBtn).toBeVisible()
    await favoriteBtn.click()
  }

  async goToFavoritesSection() {
    await this.favoritesSection.scrollIntoViewIfNeeded()
    await expect(this.favoritesSection).toBeVisible()
    await this.favoritesSection.click()
  }

  async confirmFavoritesHasApp(name: string) {
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
