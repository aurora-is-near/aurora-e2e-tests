import { type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

export class ExplorePage extends BasePage {
  allAppElements: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.allAppElements = page.getByRole("link")
  }

  async getRandomdAppName(): Promise<string> {
    const allElem = (await this.allAppElements.all()).filter(
      async (elem) =>
        (await elem.getAttribute("target")) === "_blank" &&
        (await elem.getAttribute("rel")) === "noreferrer noopener",
    )

    // const temp: string[] = []

    const hujaks = await allElem[0]
      .getByRole("heading", { level: 3 })
      .innerText()
    console.log(hujaks)

    // allElem.forEach(async (elem) => {
    //   const innerHeading = elem.getByRole("heading", { level: 3 })
    //   const huh = await innerHeading.innerText()
    //   console.log(huh)

    //   temp.push(huh)
    // })

    // console.log(temp)

    return ""
  }
}
