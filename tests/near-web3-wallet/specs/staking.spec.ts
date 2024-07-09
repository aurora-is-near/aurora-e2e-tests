import { WEB3_WALLET_TAG } from "../../../lib/constants/tags"
import { test } from "../../../lib/fixtures"
// import { MetamaskActions } from "../../helpers/metamask.actions"
import { HomePage } from "../pages/home.page"

test.describe.configure({ mode: "serial" })

test.beforeEach(
  "Setup Metamask extension:",
  async ({ metamask, web3wallet }) => {
    await metamask.setup()
    await web3wallet.goto("/")
    await web3wallet.connectToMetaMask()
  },
)

test.describe("NEAR Web3 Wallet: Swapping", { tag: WEB3_WALLET_TAG }, () => {
  test.only(`Confirm that user can swap some tokens`, async ({
    page,
  }, testInfo) => {
    console.log(testInfo.title)
    const homePage = new HomePage(page)
    // const metamaskActions = new MetamaskActions()

    await homePage.confirmSwapPageLoaded("/")

    await homePage.scrollToSwapContainer()

    await page.pause()
  })
})
