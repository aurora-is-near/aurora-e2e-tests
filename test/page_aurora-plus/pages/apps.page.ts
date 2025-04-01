import { expect, type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

export class AppsPage extends BasePage {
  allAppElements: Locator
  searchInputField: Locator
  favoritesSection: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.allAppElements = page.locator(`a[target="_blank"]`)
    this.searchInputField = page.getByPlaceholder("Search projects by name")
    this.favoritesSection = page.getByRole("button", { name: "Favourites" })
  }

  async getRandomdAppName(): Promise<string> {
    const allElem = await this.allAppElements.all()
    const randomApp = allElem[Math.floor(Math.random() * (allElem.length - 5))]
    const randomAppText = await randomApp.innerText()
    const [tempArr] = randomAppText.split("\n")

    return tempArr
  }

  async fillAppSearch(name: string) {
    await expect(this.searchInputField).toBeVisible()
    await this.searchInputField.fill(name)
  }

  // TODO: Try to find a good way to do this
  async searchAppFilter(name: string) {
    const allElem = await this.allAppElements.all()
    const dAppNames: string[] = []

    await Promise.all(
      allElem.map(async (elem) => {
        const innerText = await elem.innerText()
        const [targetText] = innerText.split("\n")
        dAppNames.push(targetText)
      }),
    )
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

  // TODO: Try to find a good way to do this
  async confirmFavoritesHasApp(name: string) {
    const allElem = await this.allAppElements.all()
    const dAppNames: string[] = []

    await Promise.all(
      allElem.map(async (elem) => {
        const innerText = await elem.innerText()
        const [targetText] = innerText.split("\n")
        dAppNames.push(targetText)
      }),
    )
    expect(dAppNames).toContain(name)
    expect(dAppNames.length).toEqual(1)
  }
}
