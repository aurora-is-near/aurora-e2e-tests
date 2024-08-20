import { type Locator, type Page } from "playwright/test"
import { BasePage } from "./base.page"

export class HomePage extends BasePage {
    swapContainer: Locator
    swapFromWallet: Locator
    swapToWallet: Locator
    fromAmountInputField: Locator
    toAmountInputField: Locator

    constructor(page: Page) {
        super(page)
        this.page = page
        this.swapContainer = page.getByRole("heading", { name: "Swap on NEAR" })
        this.swapFromWallet = page
            .locator("form")
            .getByText("NEAR", { exact: true })
        this.swapToWallet = page.getByText("REF", { exact: true })
        this.fromAmountInputField = page.getByText('NEAR~$').getByPlaceholder('0.0')
        this.toAmountInputField = page.getByText('REF~$').getByPlaceholder('0.0')
    }

    async confirmSwapPageLoaded(url: string, page = this.page) {
        await this.confirmCorrectPageLoaded(page, url)
    }

    async scrollToSwapContainer() {
        await this.swapContainer.scrollIntoViewIfNeeded()
    }

    async selectSwapFromToken(tokenName = 'NEAR') {

    }
}
